import request from '@/utils/request'

export function getText() {
  return request({
    url: 'text/texts',
    method: 'get'
  })
}

export function fetchText(page, limit, text_type) {
  return request({
    url: 'text/texts',
    method: 'get',
    params: { page, limit, text_type }
  })
}

export function updateText(data, id) {
  return request({
    url: `text/texts/${id}`,
    method: 'put',
    data
  })
}

export function getTextById(id) {
  return request({
    url: `text/texts/${id}`,
    method: 'get'
  })
}

export function deleteTextById(id) {
  return request({
    url: `text/texts/${id}`,
    method: 'delete'
  })
}

export function addText(data) {
  return request({
    url: 'text/texts',
    method: 'post',
    data
  })
}
