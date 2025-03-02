<template>
  <div class="sidebar-logo-container" :class="{ 'collapse': collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M15.5 4.5C18 4.5 19 5.5 20.5 8L18 10C16.5 7.5 15.5 6.5 13 6.5C10.5 6.5 8 10.5 8 12C8 13.5 9 16.5 11.5 16.5C14 16.5 15 15.5 16.5 13L19 15C17.5 17.5 15 18.5 12.5 18.5C10 18.5 5 15.5 5 12C5 8.5 10 4.5 12.5 4.5"
              stroke="#6366F1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M15.5 4.5C18 4.5 19 5.5 20.5 8L18 10C16.5 7.5 15.5 6.5 13 6.5C10.5 6.5 8 10.5 8 12C8 13.5 9 16.5 11.5 16.5C14 16.5 15 15.5 16.5 13L19 15C17.5 17.5 15 18.5 12.5 18.5C10 18.5 5 15.5 5 12C5 8.5 10 4.5 12.5 4.5"
              stroke="#6366F1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '学生实习管理系统',
      // logo: 'http://mezereon.oss-cn-hangzhou.aliyuncs.com/7dba7e74ddd42169.png'
      logo: require('@/assets/logo.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 0.3s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 70px;
  background-color: #111827;
  text-align: center;
  overflow: hidden;
  padding: 20px 0;
  transition: all 0.3s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  &.collapse {
    .logo-icon {
      margin-right: 0px;
    }
  }
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
