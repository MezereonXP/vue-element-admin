import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'job/jobs',
    method: 'get',
    params: query
  })
}

export function fetchJob(id) {
  return request({
    url: `job/jobs/${id}`,
    method: 'get'
  })
}

export function createJob(data) {
  return request({
    url: 'job/jobs',
    method: 'post',
    data
  })
}

export function updateJob(data) {
  return request({
    url: `job/jobs/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteJob(id) {
  return request({
    url: `job/jobs/${id}`,
    method: 'delete'
  })
}

export function searchJob(query) {
  return request({
    url: 'job/jobs/search',
    method: 'get',
    params: query
  })
}

