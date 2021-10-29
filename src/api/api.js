/*
 * @Author: qiuqi
 * @Date: 2021-09-17 20:27:07
 * @LastEditTime: 2021-10-29 16:11:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xh_forum\src\api\api.js
 */
import http from "./http";

/*
 *
 * @ 用户Api 
 *
 */
// 用户登录
export const loginApi = (loginForm) => {
  return http.axios
    .post("/users/login", loginForm)
}
// 用户注册
export const registerApi = (registerForm) => {
  return http.axios
    .post("/users", registerForm)
}

// 获取所有用户（管理端）
export const getAllUsersApi = () => {
  return http.axios.get("/user/allUsers")
}

// 获取当前登录用户
export const getCurrentUserApi = () => {
  return http.axios.get("/user")
}
// 更新当前登录用户
export const updateCurrentUserApi = (userForm) => {
  return http.axios.put('/user', userForm)
}

// 编辑用户（管理端）
export const updateUserApi = (userId, updateUserForm) => {
  return http.axios.put('/user/updateUser/' + userId, updateUserForm)
}

// 删除用户（管理端）
export const deleteUserApi = (userId) => {
  return http.axios.delete('/user/deleteUser/' + userId)
}
/*
 *
 * @ 档案Api 
 *
 */
// // 获取用户资料
// export const getProfileApi = (username) => {
//   return http.axios.get('/profiles/' + username)
// }
// // 关注用户
// export const followUserApi = (username) => {
//   return http.axios.post('/profiles/' + username + '/follow')
// }
// // 取消关注用户
// export const unfollowUserApi = (username) => {
//   return http.axios.delete('/profiles/' + username + '/follow')
// }

/*
 *
 * @ 文章Api 
 *
 */
// 获取文章列表
export const getArticleListApi = () => {
  return http.axios.get('/articles')
}
// 获取用户关注的作者文章列表
// export const getFeedArticlesApi = () => {
//   return http.axios.get('/articles/feed')
// }
// 获取文章
export const getArticleApi = (articleId) => {
  return http.axios.get('/articles/' + articleId)
}
// 创建文章
export const createArticleApi = () => {
  return http.axios.post('/articles')
}
// 更新当前文章
export const updateArticleApi = (articleId) => {
  return http.axios.put('/articles/' + articleId)
}
// 删除当前文章
export const deleteArticleApi = (articleId) => {
  return http.axios.delete('/articles/' + articleId)
}
// // 在当前文章添加评论
// export const addCommentsApi = (articleId) => {
//   return http.axios.post('/articles/' + articleId + '/comments')
// }
// // 获取当前文章评论
// export const getCommentsApi = (articleId) => {
//   return http.axios.get('/articles/' + articleId + '/comments')
// }
// // 删除评论
// export const deleteCommentApi = (articleId, commentId) => {
//   return http.axios.delete('/articles/' + articleId + '/comments/' + commentId)
// }
// // 收藏文章
// export const favoriteArticleApi = (articleId) => {
//   return http.axios.post('/articles/' + articleId + '/favorite')
// }
// // 取消收藏文章
// export const unfavoriteArticleApi = (articleId) => {
//   return http.axios.delete('/articles/' + articleId + '/favorite')
// }

/*
 *
 * @ 标签Api 
 *
 */
// 获取标签
// export const getTagsApi = () => {
//   return http.axios.get('/tags')
// }