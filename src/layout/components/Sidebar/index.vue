<template>
  <div :class="{ 'has-logo': showLogo }" class="primevue-sidebar">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="'#111827'"
        :text-color="'#8994A6'"
        :unique-opened="false"
        :active-text-color="'#ffffff'"
        :collapse-transition="false"
        mode="vertical"
        class="primevue-menu"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
      teams: [
        { name: 'Heroicons', initial: 'H' },
        { name: 'Tailwind Labs', initial: 'T' },
        { name: 'Workcation', initial: 'W' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.primevue-sidebar {
  box-shadow: none;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: width 0.28s;
  background-color: #111827;
}

.primevue-menu {
  border: none;
  padding: 16px 12px;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;

  &:not(.el-menu--collapse) {
    width: calc(#{$sideBarWidth} - 24px);
  }
}

.scrollbar-wrapper {
  overflow-x: hidden !important;
}

.el-scrollbar__view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-scrollbar__bar.is-vertical {
  right: 0px;
}

.el-scrollbar {
  height: 100%;
}

:deep(.el-menu) {
  border: none;
  background-color: transparent !important;

  &.el-menu--collapse {
    width: 54px;

    .el-submenu__icon-arrow {
      display: none;
    }
  }
}

.section-title {
  padding: 16px 16px 8px;
  font-size: 13px;
  color: #6A7A90;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
}

.team-item {
  margin: 2px 0;
}

.team-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #8994A6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.settings-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
