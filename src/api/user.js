import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function updateProfile(data) {
  return request({
    url: `/user/update/${data.id}`,
    method: 'put',
    data
  })
}

export function getUserList(query) {
  return request({
    url: '/user/users',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/users',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/user/delete/${id}`,
    method: 'delete'
  })
}

export function searchUser(query) {
  return request({
    url: '/user/search',
    method: 'get',
    params: query
  })
}

export function checkIn(phoneNumber) {
  return request({
    url: '/attendance/checkin',
    method: 'post',
    data: {
      phone_number: phoneNumber
    }
  })
}

export function getAttendance(query) {
  return request({
    url: '/attendance/get_attendance',
    method: 'get',
    params: query
  })
}

export function searchAttendance(query) {
  return request({
    url: '/attendance/search_attendance',
    method: 'get',
    params: query
  })
}

export function getRecentAttendance(query) {
  return request({
    url: '/attendance/get_recent_attendance',
    method: 'get',
    params: query
  })
}

export function deleteRecentAttendance(id) {
  return request({
    url: '/attendance/delete_attendance',
    method: 'delete',
    data: {
      'attendance_id': id
    }
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/user/upload_avatar',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/update_password',
    method: 'post',
    data
  })
}
