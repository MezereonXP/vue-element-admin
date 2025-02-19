<template>
  <div>
    <h1 style="text-align: center;">{{ title }}</h1>
    <div style="width: 60%; margin: 20px auto;" v-html="text" />
    <div style="text-align: center; color: #999; font-size: 14px;">
      <span>更新时间：{{ formatDate(updated_at) }}</span>
      <br>
      <span>创建时间：{{ formatDate(created_at) }}</span>
    </div>
  </div>
</template>

<script>
import { getTextById } from '@/api/text'
import moment from 'moment'

export default {
  data() {
    return {
      id: this.$route.params.id,
      text: '',
      title: '',
      updated_at: '',
      created_at: ''
    }
  },
  created() {
    this.getTextById()
  },
  methods: {
    getTextById() {
      getTextById(this.id).then(res => {
        this.text = res.text.text
        this.title = res.text.title
        this.updated_at = res.text.updated_at
        this.created_at = res.text.created_at
      })
    },
    formatDate(date) {
      return moment(date).utc().format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
