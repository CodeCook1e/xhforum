/*
 * @Author: qiuqi
 * @Date: 2021-09-17 20:27:07
 * @LastEditTime: 2021-11-25 13:28:32
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
// 管理员登录
export const adminLoginApi = (loginForm) => {
  return http.axios
    .post("/users/adminLogin", loginForm)
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

// 更改头像
export const updateImageApi = (userForm) => {
  return http.axios.put('/user/image', userForm)
}

/*
 *
 * @ 档案Api 
 *
 */
// 获取用户资料
export const getProfileApi = (userId) => {
  return http.axios.get('/profiles/' + userId)
}
// 关注用户
export const followUserApi = (userId) => {
  return http.axios.post('/profiles/' + userId + '/follow')
}
// 取消关注用户
export const unfollowUserApi = (userId) => {
  return http.axios.delete('/profiles/' + userId + '/unfollow')
}

/*
 *
 * @ 文章Api 
 *
 */
// 获取文章列表
export const getArticleListApi = (params) => {
  return http.axios({
    url: '/articles',
    method: 'GET',
    params: params
  })
}
// 获取热门文章列表
export const getHotArticleListApi = (params) => {
  return http.axios({
    url: '/articles/hot',
    method: 'GET',
    params: params
  })
}
// 获取用户关注的作者文章列表
export const getFeedArticlesApi = () => {
  return http.axios.get('/articles/feed')
}
// 获取文章
export const getArticleApi = (articleId) => {
  return http.axios.get('/articles/' + articleId)
}
// 创建文章
export const createArticleApi = (params) => {
  return http.axios.post('/articles', params)
}
// 更新当前文章
export const updateArticleApi = (articleId, params) => {
  return http.axios.put('/articles/' + articleId, params)
}
// 更新当前文章（管理员）
export const adminUpdateArticleApi = (articleId, params) => {
  return http.axios.put('/articles/admin/' + articleId, params)
}
// 删除当前文章
export const deleteArticleApi = (articleId) => {
  return http.axios.delete('/articles/' + articleId)
}
// 删除当前文章（管理员）
export const adminDeleteArticleApi = (articleId) => {
  return http.axios.delete('/articles/admin/' + articleId)
}
// 在当前文章添加评论
export const addCommentsApi = (articleId, params) => {
  return http.axios.post('/articles/' + articleId + '/comments', params)
}
// 获取当前文章评论
export const getCommentsApi = (articleId) => {
  return http.axios.get('/articles/' + articleId + '/comments')
}
// 删除评论
export const deleteCommentApi = (articleId, commentId) => {
  return http.axios.delete('/articles/' + articleId + '/comments/' + commentId)
}
// 收藏文章
export const favoriteArticleApi = (articleId) => {
  return http.axios.post('/articles/' + articleId + '/favorite')
}
// 取消收藏文章
export const unfavoriteArticleApi = (articleId) => {
  return http.axios.delete('/articles/' + articleId + '/favorite')
}

/*
 *
 * @ 标签Api 
 *
 */
// 获取标签
export const getTagsApi = () => {
  return http.axios.get('/tags')
}

// 添加父标签
export const createTagApi = (params) => {
  return http.axios.post('tags/create', params)
}

// 添加子标签
export const createChildTagApi = (tagId, params) => {
  return http.axios.post('tags/create/' + tagId, params)
}

// 添加子标签图片
export const createChildTagImageApi = (tagForm) => {
  return http.axios.put('tags/create/image', tagForm)
}

// 编辑父标签
export const updateTagApi = (tagId, params) => {
  return http.axios.put('tags/update/' + tagId, params)
}

// 编辑子标签
export const updateChildTagApi = (tagParentId, tagChildrenId, params) => {
  return http.axios.put('tags/update/children/' + tagParentId + "/" + tagChildrenId, params)
}

// 删除父标签
export const deleteTagApi = (tagId, params) => {
  return http.axios.delete('tags/delete/' + tagId, params)
}

// 删除子标签
export const deleteChildTagApi = (tagParentId, tagChildrenId) => {
  return http.axios.delete('tags/delete/children/' + tagParentId + "/" + tagChildrenId)
}