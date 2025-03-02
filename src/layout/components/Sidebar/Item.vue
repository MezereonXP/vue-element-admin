<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon', 'primevue-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} class='primevue-icon' />)
      }
    }

    if (title) {
      vnodes.push(<span slot='title' class='primevue-title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}

.primevue-icon {
  margin-right: 12px;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: #8994A6;
  opacity: 0.85;
}

.el-menu-item .primevue-title,
.el-submenu__title .primevue-title,
.primevue-title {
  font-weight: 900 !important;
  font-size: 14px;
  transition: all 0.3s;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #8994A6;
}

/* More specific active selectors */
.el-menu-item.is-active>.primevue-icon,
.el-menu-item.is-active>.primevue-title,
.el-submenu__title.is-active>.primevue-icon,
.el-submenu__title.is-active>.primevue-title {
  color: white !important;
  opacity: 1;
}

.el-menu-item:hover .primevue-icon,
.el-menu-item:hover .primevue-title,
.el-submenu__title:hover .primevue-icon,
.el-submenu__title:hover .primevue-title {
  color: white;
  opacity: 1;
}

/* Collapsed menu icon styling */
.el-menu--collapse {
  .primevue-icon {
    margin-right: 0 !important;
    margin-left: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
    font-size: 16px !important;
    vertical-align: middle !important;
    position: relative !important;
    top: 0 !important;
    left: 0 !important;
    transform: translateY(0) !important;
  }

  .el-menu-item,
  .el-submenu__title {
    &.is-active .primevue-icon {
      color: white !important;
      opacity: 1;
    }
  }

  .svg-icon {
    margin-top: 40% !important;
  }
}

.el-submenu__title--collapse {
  .primevue-icon {
    margin-right: 0 !important;
    margin-left: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
    font-size: 16px !important;
    position: relative !important;
  }

  .svg-icon .primevue-icon {
    margin-top: 40% !important;
  }
}
</style>
