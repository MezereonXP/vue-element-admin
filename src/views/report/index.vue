<template>
  <div>
    <TextManagement title="企业考察报告" route-name="report" :text-type="5" />
  </div>
</template>

<script>
import TextManagement from '@/components/TextManagement/index.vue'

export default {
  name: 'Report',
  components: { TextManagement }
}
</script>
