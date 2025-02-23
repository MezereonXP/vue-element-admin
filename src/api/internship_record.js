import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/internship_record/list',
    method: 'get',
    params: query
  })
}

export function createInternshipRecord(data) {
  return request({
    url: '/internship_record/create',
    method: 'post',
    data
  })
}

export function updateInternshipRecord(data, id) {
  return request({
    url: `/internship_record/update/${id}`,
    method: 'put',
    data
  })
}

export function deleteInternshipRecord(id) {
  return request({
    url: `/internship_record/delete/${id}`,
    method: 'delete'
  })
}

export function searchInternshipRecord(data) {
  return request({
    url: '/internship_record/search?query=' + data,
    method: 'get'
  })
}
