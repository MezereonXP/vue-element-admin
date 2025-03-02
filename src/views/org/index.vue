<template>
  <div>
    <TextManagement title="组织架构" route-name="org" :text-type="3" />
  </div>
</template>

<script>
import TextManagement from '@/components/TextManagement/index.vue'

export default {
  name: 'Org',
  components: { TextManagement }
}
</script>
