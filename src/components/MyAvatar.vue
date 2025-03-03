<template>
  <div class="my-avatar" :style="avatarStyle">
    <i v-if="icon" :class="icon" :style="iconStyle" />
    <slot v-else />
  </div>
</template>

<script>
export default {
  name: 'MyAvatar',
  props: {
    icon: {
      type: String,
      default: 'el-icon-user'
    },
    backgroundColor: {
      type: String,
      default: '#ece9fc'
    },
    color: {
      type: String,
      default: '#2a1261'
    },
    size: {
      type: Number,
      default: 32
    },
    iconSize: {
      type: Number,
      default: 0.6 // 60% of avatar size by default
    }
  },
  computed: {
    avatarStyle() {
      return {
        backgroundColor: this.backgroundColor,
        color: this.color,
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    },
    iconStyle() {
      return {
        fontSize: `${this.size * this.iconSize}px`
      }
    }
  }
}
</script>

<style scoped>
.my-avatar {
  margin-top: 10px;
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.my-avatar i {
  font-weight: bold;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
