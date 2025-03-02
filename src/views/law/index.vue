<template>
  <div>
    <TextManagement title="法律法规文件制度" route-name="law" :text-type="2" />
  </div>
</template>

<script>
import TextManagement from '@/components/TextManagement/index.vue'

export default {
  name: 'Law',
  components: { TextManagement }
}
</script>
