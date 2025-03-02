<template>
  <div>
    <TextManagement title="实习培训" route-name="train" :text-type="6" />
  </div>
</template>

<script>
import TextManagement from '@/components/TextManagement/index.vue'

export default {
  name: 'Train',
  components: { TextManagement }
}
</script>
