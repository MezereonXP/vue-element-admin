import request from '@/utils/request'

export function getCompanyList(query) {
  return request({
    url: '/company/companies',
    method: 'get',
    params: query
  })
}

export function createCompany(data) {
  return request({
    url: '/company/companies',
    method: 'post',
    data
  })
}

export function updateCompany(id, data) {
  return request({
    url: `/company/companies/${id}`,
    method: 'put',
    data
  })
}

export function deleteCompany(id) {
  return request({
    url: `/company/delete/${id}`,
    method: 'delete'
  })
}
