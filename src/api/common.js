import request from '@/utils/request'

export function getIntro(query) {
  return request({
    url: '/article/articles/1',
    method: 'get'
  })
}

export function updateIntro(data) {
  return request({
    url: '/article/articles/1',
    method: 'put',
    data
  })
}

export function getLaw(query) {
  return request({
    url: '/article/articles/2',
    method: 'get'
  })
}

export function updateLaw(data) {
  return request({
    url: '/article/articles/2',
    method: 'put',
    data
  })
}

export function getOrg(query) {
  return request({
    url: '/article/articles/3',
    method: 'get'
  })
}

export function updateOrg(data) {
  return request({
    url: '/article/articles/3',
    method: 'put',
    data
  })
}

export function getApproval(query) {
  return request({
    url: '/article/articles/4',
    method: 'get'
  })
}

export function updateApproval(data) {
  return request({
    url: '/article/articles/4',
    method: 'put',
    data
  })
}

export function getReport(query) {
  return request({
    url: '/article/articles/5',
    method: 'get'
  })
}

export function updateReport(data) {
  return request({
    url: '/article/articles/5',
    method: 'put',
    data
  })
}

export function getTrain(query) {
  return request({
    url: '/article/articles/6',
    method: 'get'
  })
}

export function updateTrain(data) {
  return request({
    url: '/article/articles/6',
    method: 'put',
    data
  })
}
