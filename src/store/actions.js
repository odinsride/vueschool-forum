import firebase from 'firebase'

export default {
  createPost ({commit, state}, post) {
    const postId = 'greatPost' + Math.random()
    post['.key'] = postId
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    commit('setPost', {post, postId})
    commit('appendPostToThread', {parentId: post.threadId, childId: postId})
    commit('appendPostToUser', {parentId: post.userId, childId: postId})
    return Promise.resolve(state.posts[postId])
  },

  createThread ({state, commit, dispatch}, {text, title, forumId}) {
    return new Promise((resolve, reject) => {
      const threadId = 'greatThread' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)

      const thread = {'.key': threadId, title, forumId, publishedAt, userId}

      commit('setThread', {threadId, thread})
      commit('appendThreadToForum', {parentId: forumId, childId: threadId})
      commit('appendThreadToUser', {parentId: userId, childId: threadId})

      dispatch('createPost', {text, threadId})
        .then(post => {
          commit('setThread', {threadId, thread: {...thread, firstPostId: post['.key']}})
        })
      resolve(state.threads[threadId])
    })
  },

  updatePost ({state, commit}, {id, text}) {
    return new Promise((resolve, reject) => {
      const post = state.posts[id]
      commit('setPost', {
        postId: id,
        post: {
          ...post,
          text,
          edited: {
            at: Math.floor(Date.now() / 1000),
            by: state.authId
          }
        }
      })
      resolve(post)
    })
  },

  updateThread ({state, commit, dispatch}, {text, title, id}) {
    return new Promise((resolve, reject) => {
      const thread = state.threads[id]
      const newThread = {...thread, title}
      commit('setThread', {thread: newThread, threadId: id})

      dispatch('updatePost', {id: thread.firstPostId, text})
        .then(() => {
          resolve(newThread)
        })
    })
  },

  updateUser ({commit}, user) {
    commit('setUser', {userId: user['.key'], user})
  },

  fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id}),
  fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'forums', id}),
  fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id}),
  fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'posts', id}),
  fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'users', id}),

  fetchCategories: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'categories', ids}),
  fetchForums: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'forums', ids}),
  fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'threads', ids}),
  fetchPosts: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'posts', ids}),
  fetchUsers: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'users', ids}),

  /* Following code refactored into arrow functions above
  fetchCategory ({dispatch}, {id}) {
    return dispatch('fetchItem', {resource: 'categories', id})
  },

  fetchForum ({dispatch}, {id}) {
    return dispatch('fetchItem', {resource: 'forums', id})
  },

  fetchThread ({dispatch}, {id}) {
    return dispatch('fetchItem', {resource: 'threads', id})
  },

  fetchPost ({dispatch}, {id}) {
    return dispatch('fetchItem', {resource: 'posts', id})
  },

  fetchUser ({dispatch}, {id}) {
    return dispatch('fetchItem', {resource: 'users', id})
  },

  fetchCategories ({dispatch}, {ids}) {
    return dispatch('fetchItems', {resource: 'categories', ids})
  },

  fetchForums ({dispatch}, {ids}) {
    return dispatch('fetchItems', {resource: 'forums', ids})
  },

  fetchThreads ({dispatch}, {ids}) {
    return dispatch('fetchItems', {resource: 'threads', ids})
  },

  fetchPosts ({dispatch}, {ids}) {
    return dispatch('fetchItems', {resource: 'posts', ids})
  },

  fetchUsers ({dispatch}, {ids}) {
    return dispatch('fetchItems', {resource: 'users', ids})
  }, */

  fetchAllCategories ({state, commit}) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categoriesObject = snapshot.val()
        Object.keys(categoriesObject).forEach(categoryId => {
          const category = categoriesObject[categoryId]
          commit('setItem', {resource: 'categories', id: categoryId, item: category})
        })
        resolve(Object.values(state.categories))
      })
    })
  },

  fetchItem ({state, commit}, {id, resource}) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
        resolve(state[resource][id])
      })
    })
  },

  fetchItems ({dispatch}, {ids, resource}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource})))
  }
}
