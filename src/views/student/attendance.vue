<template>
  <div class="attendance-container">
    <el-card>
      <div slot="header">
        <span class="title">学生考勤情况</span>
      </div>
      <el-input v-model="search" placeholder="请输入学生姓名或者手机号" style="width: 200px; margin-bottom: 10px;" />
      <el-button type="primary" style="margin-left: 10px;" plain @click="searchAttendance">搜索</el-button>
      <el-table v-loading="listLoading" :data="tableData" style="width: 100%;">
        <el-table-column prop="user_name" label="学生姓名" />
        <el-table-column prop="phone_number" label="手机号" />
        <el-table-column prop="check_in_time" label="最近打卡时间" :formatter="formatDate" />
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="limit"
        :current-page="page"
        style="margin-top: 20px;"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { searchAttendance } from '@/api/user'
import moment from 'moment'
export default {
  name: 'StudentAttendance',
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'id'
    ])
  },
  data() {
    return {
      tableData: [],
      listLoading: false,
      page: 1,
      limit: 10,
      total: 0,
      search: ''
    }
  },
  methods: {
    searchAttendance() {
      this.listLoading = true
      const query = {
        search_key: this.search,
        page: this.page,
        limit: this.limit
      }
      searchAttendance(query).then(response => {
        this.tableData = response.data
        this.listLoading = false
        this.total = response.total
        this.page = response.page
        this.limit = response.limit
      }).catch(error => {
        console.error('Error fetching attendance:', error)
        this.listLoading = false
      })
    },
    formatDate(row, column) {
      return moment(row.check_in_time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
.attendance-container {
  padding: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  position: relative;
  padding-left: 12px;
  display: inline-block;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 16px;
    width: 4px;
    background-color: #409EFF;
    border-radius: 2px;
  }
}
</style>
