import Vue from 'vue'

const makeAppendChildToParentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId] // user.name === user['name']
    if (!resource[child]) { // Only add the posts array if it's a new thread
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default {
  setPost (state, {post, postId}) {
    Vue.set(state.posts, postId, post)
  },

  setUser (state, {user, userId}) {
    Vue.set(state.users, userId, user)
  },

  setThread (state, {thread, threadId}) {
    Vue.set(state.threads, threadId, thread)
  },

  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  },

  appendPostToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'posts'}),

  appendContributorToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'contributors'}),

  appendPostToUser: makeAppendChildToParentMutation({parent: 'users', child: 'posts'}),

  appendThreadToForum: makeAppendChildToParentMutation({parent: 'forums', child: 'threads'}),

  appendThreadToUser: makeAppendChildToParentMutation({parent: 'users', child: 'threads'})

// Below mutations refactored into higher order function `makeAppendChildToParentMutation`
// appendPostToThread (state, {postId, threadId}) {
//   const thread = state.threads[threadId]
//   if (!thread.posts) { // Only add the posts array if it's a new thread
//     Vue.set(thread, 'posts', {})
//   }
//   Vue.set(thread.posts, postId, postId)
// },

// appendPostToUser (state, {postId, userId}) {
//   const user = state.users[userId]
//   if (!user.posts) { // Only add the posts array if it's a new thread
//     Vue.set(user, 'posts', {})
//   }
//   Vue.set(user.posts, postId, postId)
// },

// appendThreadToForum (state, {forumId, threadId}) {
//   const forum = state.forums[forumId]
//   if (!forum.threads) { // Only add the posts array if it's a new thread
//     Vue.set(forum, 'threads', {})
//   }
//   Vue.set(forum.threads, threadId, threadId)
// },

// appendThreadToUser (state, {threadId, userId}) {
//   const user = state.users[userId]
//   if (!user.threads) { // Only add the posts array if it's a new thread
//     Vue.set(user, 'threads', {})
//   }
//   Vue.set(user.threads, threadId, threadId)
// }

}
