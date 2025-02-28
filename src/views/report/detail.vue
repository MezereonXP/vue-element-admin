<template>
  <div class="report-container">
    <div class="report-card">
      <h1 class="report-title">{{ title }}</h1>
      <div class="report-content" v-html="text" />
      <div class="report-meta">
        <span><i class="el-icon-time" /> 更新时间：{{ formatDate(updated_at) }}</span>
        <span><i class="el-icon-date" /> 创建时间：{{ formatDate(created_at) }}</span>
      </div>
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
<style scoped>
.report-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.report-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 40px;
  border: 1px solid #eaeaea;
}

.report-title {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  font-weight: 600;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 20px;
}

.report-content {
  width: 85%;
  margin: 0 auto;
  line-height: 1.8;
  color: #333;
  font-size: 16px;
}

.report-meta {
  margin-top: 40px;
  text-align: right;
  color: #888;
  font-size: 14px;
  border-top: 1px solid #eaeaea;
  padding-top: 20px;
}

.report-meta span {
  display: inline-block;
  margin-left: 20px;
}

.report-meta i {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .report-card {
    padding: 20px;
  }

  .report-content {
    width: 100%;
  }

  .report-title {
    font-size: 24px;
  }
}
</style>
