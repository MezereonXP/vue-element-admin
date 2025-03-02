<template>
  <div>
    <TextManagement title="实习审批报备管理" route-name="approval" :text-type="4" />
  </div>
</template>

<script>
import TextManagement from '@/components/TextManagement/index.vue'

export default {
  name: 'Approval',
  components: { TextManagement }
}
</script>
