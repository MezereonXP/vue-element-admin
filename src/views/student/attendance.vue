<template>
  <div class="app-container">
    <el-card class="main-card">
      <div slot="header" class="card-header">
        <div class="header-left">
          <span class="page-title">学生考勤情况</span>
          <span class="page-subtitle">Student Attendance Management</span>
        </div>
      </div>

      <div class="search-container">
        <el-input v-model="search" placeholder="请输入学生姓名或者手机号" style="width: 300px;" />
        <el-button type="primary" icon="el-icon-search" class="action-button" @click="searchAttendance">搜索</el-button>
      </div>

      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="tableData"
          border
          fit
          highlight-current-row
          class="data-table"
          :header-cell-style="{ background: '#f8f9fa', color: '#344767', fontWeight: '600' }"
          :cell-style="{ padding: '12px 8px' }"
        >
          <el-table-column prop="user_name" label="学生姓名" align="center" />
          <el-table-column prop="phone_number" label="手机号" align="center" />
          <el-table-column prop="check_in_time" label="最近打卡时间" :formatter="formatDate" align="center" />
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          :current-page="page"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
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
  created() {
    this.searchAttendance()
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
    },
    handlePageChange(page) {
      this.page = page
      this.searchAttendance()
    },
    handleSizeChange(size) {
      this.limit = size
      this.searchAttendance()
    }
  }
}
</script>

<style scoped>
/* Base Styles */
.app-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 84px);
}

/* Card Styling */
.main-card {
  width: 60%;
  border-radius: 12px;
  box-shadow: 0 7px 14px 0 rgba(65, 69, 88, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  background-color: #fff;
  border: none;
  margin-bottom: 30px;
}

.main-card ::v-deep .el-card__header {
  padding: 0;
  border-bottom: 1px solid #eaecef;
}

.main-card ::v-deep .el-card__body {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Header Styling */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #344767;
  line-height: 1.3;
  position: relative;
}

.page-subtitle {
  font-size: 14px;
  color: #8392AB;
  margin-top: 4px;
}

/* Search Container */
.search-container {
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
}

/* Button Styling */
.action-button {
  padding: 8px 16px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.15s ease;
  letter-spacing: 0.3px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 100px;
  height: 38px;
}

.action-button i {
  font-size: 15px;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

.action-button:active {
  transform: translateY(0);
}

/* Primary Button Styling */
.el-button--primary {
  background: linear-gradient(135deg, #4776E6 0%, #3843D0 100%);
  border: none;
  color: white;
}

.el-button--primary:hover {
  background: linear-gradient(135deg, #5584FF 0%, #4251E8 100%);
}

.el-button--primary:focus {
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.3);
}

/* Table Styling */
.table-container {
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}

.data-table {
  width: 100%;
  border-radius: 8px;
  margin: 0;
  padding: 0;
  table-layout: fixed;
}

.data-table ::v-deep .el-table__header,
.data-table ::v-deep .el-table__body {
  width: 100% !important;
  table-layout: fixed !important;
}

.data-table ::v-deep .el-table__header-wrapper,
.data-table ::v-deep .el-table__body-wrapper {
  width: 100% !important;
}

.data-table ::v-deep .el-table__body-wrapper {
  overflow-x: auto !important;
}

.data-table ::v-deep .cell {
  word-break: break-word;
  white-space: normal;
  line-height: 1.5;
}

.data-table ::v-deep th {
  font-size: 14px;
  padding: 16px 8px;
}

.data-table ::v-deep .el-table__row {
  transition: background-color 0.3s;
}

.data-table ::v-deep .el-table__row:hover {
  background-color: #f9fafc;
}

/* Pagination Styling */
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-pagination {
  display: flex;
  align-items: center;
}

::v-deep .el-pagination button,
::v-deep .el-pagination span:not([class*=suffix]) {
  font-size: 14px;
  font-weight: 500;
  height: 32px;
  line-height: 32px;
}

::v-deep .el-pagination .el-select .el-input {
  width: 110px;
  margin: 0 5px;
}

::v-deep .el-pagination .el-select .el-input__inner {
  height: 32px;
  line-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 14px;
  border-radius: 4px;
}

::v-deep .el-pagination__sizes {
  margin: 0 10px 0 0;
}

::v-deep .el-pagination .el-select .el-input .el-input__suffix {
  height: 100%;
  display: flex;
  align-items: center;
}

::v-deep .el-pagination.is-background .el-pager li {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  font-weight: 500;
  margin: 0 3px;
  background-color: #f4f6f9;
  color: #606266;
  border: none;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #5e72e4;
  color: white;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #5e72e4;
}

::v-deep .el-pagination.is-background .btn-prev,
::v-deep .el-pagination.is-background .btn-next {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  padding: 0;
  background-color: #f4f6f9;
  color: #606266;
  border: none;
  margin: 0 3px;
}

::v-deep .el-pagination.is-background .btn-prev:disabled,
::v-deep .el-pagination.is-background .btn-next:disabled {
  color: #c0c4cc;
  background-color: #f4f6f9;
}

::v-deep .el-pagination.is-background .btn-prev:hover:not(:disabled),
::v-deep .el-pagination.is-background .btn-next:hover:not(:disabled) {
  color: #5e72e4;
}
</style>
