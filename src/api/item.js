import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/item/list',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: `/item/detail/${id}`,
    method: 'get'
  })
}

export function createItem(data) {
  return request({
    url: '/item/create',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: `/item/update/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteItem(query) {
  return request({
    url: `/item/delete`,
    method: 'get',
    params: query
  })
}

export function searchItem(query) {
  return request({
    url: `/item/search_items`,
    method: 'get',
    params: query
  })
}
