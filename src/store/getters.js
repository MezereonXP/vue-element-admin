const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  email: state => state.user.email,
  address: state => state.user.address,
  phone_number: state => state.user.phone_number,
  sex: state => state.user.sex,
  age: state => state.user.age,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  id: state => state.user.id
}
export default getters
