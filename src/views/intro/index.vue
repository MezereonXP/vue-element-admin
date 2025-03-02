<template>
  <div>
    <TextManagement title="学校概况" route-name="intro" :text-type="1" />
  </div>
</template>

<script>
import TextManagement from '@/components/TextManagement/index.vue'

export default {
  name: 'SchoolIntroduction',
  components: { TextManagement }
}
</script>
