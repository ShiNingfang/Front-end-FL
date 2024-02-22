import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/data_mine/getItems',
    method: 'get',
    params: query
  })
}

export function createArticle(data) {
  return request({
    url: '/data_mine/create',
    method: 'post',
    data
  })
}

export function deleteList(data) {
  return request({
    url: '/data_mine/delete',
    method: 'post',
    data
  })
}

export function outher_fetchList(query) {
  return request({
    url: '/data_other/getItems',
    method: 'get',
    params: query
  })
}

export function applyAuthority(data) {
  return request({
    url: '/data_other/apply',
    method: 'post',
    data
  })
}

export function author_fetchList(query) {
  return request({
    url: 'data_author/getItems',
    method: 'get',
    params: query
  })
}

export function handleApply(data) {
  return request({
    url: '/data_author/handle',
    method: 'post',
    data
  })
}

export function mineproject_fetchList(query) {
  return request({
    url: '/project_mine/getItems',
    method: 'get',
    params: query
  })
}

export function options_fetchList(query) {
  return request({
    url: '/project_mine/getOptions',
    method: 'get',
    params: query
  })
}

export function createObject(data) {
  return request({
    url: '/project_mine/create',
    method: 'post',
    data
  })
}

export function taskboard_getSimples(query) {
  return request({
    url: '/taskboard/getsimples',
    method: 'get',
    params: query
  })
}
// export function fetchArticle(id) {
//   return request({
//     url: '/vue-element-admin/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function updateArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/update',
//     method: 'post',
//     data
//   })
// }
