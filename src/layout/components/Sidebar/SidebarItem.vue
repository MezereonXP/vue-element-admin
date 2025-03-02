<template>
  <div v-if="!item.hidden">
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow"
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest, 'primevue-style-item': true }"
        >
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
      class="primevue-style-submenu"
    >
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
.primevue-style-item {
  margin: 5px 0;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:not(.is-active):hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
    color: #fff !important;
  }

  &.is-active {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
    box-shadow: none;
  }
}

.primevue-style-submenu {
  margin: 2px 0;

  &:hover {
    >.el-submenu__title {
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 0.05) !important;
      color: #fff !important;
    }
  }

  &.is-active {

    /* Only apply to the title, not affecting child items */
    >.el-submenu__title {
      border-radius: 6px;
      color: #fff !important;
    }

    /* This prevents the active styling from cascading to children */
    background-color: transparent !important;
  }

  .el-menu--inline {
    padding: 0;
    background-color: transparent !important;

    .el-menu-item {
      border-radius: 6px;
      color: #8994A6 !important;
      background-color: transparent !important;

      &:not(.is-active):hover {
        background-color: rgba(255, 255, 255, 0.05) !important;
        color: #fff !important;
      }

      &.is-active {
        background-color: rgba(255, 255, 255, 0.1) !important;
        color: white !important;
        box-shadow: none;
      }
    }
  }
}

.el-menu-item,
.el-submenu__title {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  font-weight: 700;
  color: #8994A6 !important;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.el-menu--inline .el-menu-item {
  padding-left: 36px !important;
  height: 40px;
  line-height: 40px;
  margin: 2px 0;
  color: #8994A6 !important;
}

:deep(svg-icon) {
  margin-right: 12px;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: 0em;
}

:deep(.el-icon) {
  margin-right: 12px;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: 0em;
}

/* Fix alignment in submenu titles specifically */
:deep(.el-submenu__title) {
  display: flex !important;
  align-items: center !important;
}

/* Target the specific structure of the Item component */
:deep(.el-submenu__title .primevue-icon) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-right: 12px !important;
  vertical-align: 0em !important;
}

:deep(.el-submenu__title .svg-icon) {
  vertical-align: 0em !important;
}

:deep(.el-submenu__title .primevue-title) {
  display: inline-flex !important;
  align-items: center !important;
}

/* Make sure parent element has flex */
:deep(.el-submenu) {
  .el-submenu__title>* {
    display: flex !important;
    align-items: center !important;
    vertical-align: 0em !important;
  }
}

/* Ensure submenu items in active parent keep normal styling */
:deep(.el-submenu.is-active) {
  /* Reset background for the active submenu itself */
  background-color: transparent !important;
}

/* Override for ALL menu items to ensure they have the default style unless specifically active */
:deep(.el-menu .el-menu-item) {
  background-color: transparent !important;
  color: #8994A6 !important;

  /* Only apply active styling to items that have the is-active class directly */
  &.is-active {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
    box-shadow: none !important;
  }
}

/* Styles for popup submenus */
:deep(.el-menu--popup) {
  border-radius: 8px;
  padding: 5px;
  min-width: 150px;
  background-color: #111827 !important;
  border: 1px solid rgba(255, 255, 255, 0.06);

  .el-menu-item {
    border-radius: 6px;
    margin: 2px 0;
    color: #8994A6 !important;

    &:not(.is-active):hover {
      background-color: rgba(255, 255, 255, 0.05) !important;
      color: #fff !important;
    }

    &.is-active {
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      box-shadow: none;
    }
  }
}

/* Submenu arrow styling */
:deep(.el-submenu__icon-arrow) {
  right: 14px;
  margin-top: -4px;
  transition: all 0.2s;
  font-size: 12px;
  color: #8994A6;
}

/* RESET ALL PREVIOUS OVERRIDES */
/* Specific fix for submenu active styles */
:deep(.el-menu) {

  /* Reset all menu items to default styling first */
  .el-menu-item {
    background-color: transparent !important;
    color: #8994A6 !important;
  }

  /* Then apply active styling ONLY to direct active items */
  .el-menu-item.is-active {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
  }

  /* Make sure submenu container is transparent even when active */
  .el-submenu.is-active {
    background-color: transparent !important;

    /* Ensure nested items remain default unless specifically active */
    .el-menu--inline .el-menu-item:not(.is-active) {
      background-color: transparent !important;
      color: #8994A6 !important;
    }
  }
}
</style>
