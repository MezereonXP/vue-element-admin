<template>
  <div class="container">
    <div class="header">
      <span class="title">岗位信息</span>
      <el-button type="success" class="refresh-button" plain @click="refresh">
        <i :class="['el-icon-refresh', { 'is-refreshing': isRefreshing }]" /> 刷新
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading..."
      style="width: 100%;margin-top: 20px;"
    >
      <el-table-column prop="id" label="编号" width="90" />
      <el-table-column prop="title" label="岗位名称" width="300">
        <template slot-scope="scope">
          <el-link type="primary" @click="viewPosition(scope.row)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="company_name" label="实习企业" />
      <el-table-column prop="location" label="岗位地点" />
      <el-table-column prop="salary_description" label="岗位薪资" />
      <!-- <el-table-column prop="description" label="岗位职责" /> -->
      <el-table-column prop="created_at" label="发布时间" :formatter="formatDate" sortable />
      <el-table-column prop="updated_at" label="更新时间" :formatter="formatDate" sortable />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="checkViewPermission()"
            type="info"
            icon="el-icon-view"
            plain
            @click="viewPosition(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      class="pagination-container"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    />

    <el-dialog title="岗位详情" :visible.sync="viewDialogVisible" width="50%">
      <div class="position-detail">
        <div class="detail-item">
          <div class="detail-label">岗位名称</div>
          <div class="detail-value">{{ form.title }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">实习企业</div>
          <div class="detail-value">{{ form.company_name }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">岗位地点</div>
          <div class="detail-value">{{ form.location }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">岗位薪资</div>
          <div class="detail-value">{{ form.salary_description }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">岗位职责</div>
          <div class="detail-value description-content" v-html="form.description" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/job'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {
      list: [],
      listLoading: true,
      dialogVisible: false,
      form: {
        title: '',
        company: ''
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      viewDialogVisible: false,
      editDialogVisible: false,
      isRefreshing: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'id'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getList()
    },
    handlePrevClick() {
      this.currentPage--
      this.getList()
    },
    handleNextClick() {
      this.currentPage++
      this.getList()
    },
    getList() {
      this.listLoading = true
      const query = {
        page: this.currentPage,
        limit: this.pageSize
      }
      fetchList(query).then(response => {
        this.list = response.jobs
        this.listLoading = false
        this.total = response.total
        this.currentPage = response.page
        this.$message.success('刷新成功')
      })
    },
    refresh() {
      this.isRefreshing = true
      this.getList()
      setTimeout(() => {
        this.isRefreshing = false
      }, 500)
    },
    checkViewPermission() {
      return true
    },
    viewPosition(row) {
      this.viewDialogVisible = true
      this.form = row
    },
    formatDate(row, column) {
      return moment(row[column.property]).utc().format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  position: relative;
  padding-left: 12px;
  display: inline-block;
}

.title::before {
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

.refresh-button {
  margin-left: 20px;
  background-color: #67758d;
  color: #fff;
  border: none;

  .el-icon-refresh.is-refreshing {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.container {
  padding: 35px 40px;
  max-width: 2000px;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* Header and title styling */
h2 {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 25px;
  font-size: 1.8rem;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 12px;
}

/* Table styling */
.el-table {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  border: none;
}

.el-table ::v-deep th {
  background-color: #f9fafc !important;
  color: #445566;
  font-weight: 600;
  padding: 14px 0;
  font-size: 0.95rem;
  border-bottom: 2px solid #e6ebf5;
}

.el-table ::v-deep td {
  padding: 16px 0;
  font-size: 0.95rem;
}

.el-table ::v-deep .el-table__row {
  transition: all 0.2s ease;
}

/* Fixed hover effect to prevent duplication */
.el-table ::v-deep .el-table__row:hover {
  background-color: #f8fbff;
  transform: translateY(-1px);
}

.el-table ::v-deep .cell {
  line-height: 1.6;
}

/* Link styling */
.el-link {
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

/*
.el-link:hover {
  text-decoration: underline;
  opacity: 0.9;
} */

/* Button styling */
.el-button {
  border-radius: 6px;
  font-weight: 500;
  padding: 10px 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  letter-spacing: 0.03em;
}

.el-button.is-plain {
  border: 1px solid rgba(64, 158, 255, 0.2);
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.el-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-button+.el-button {
  margin-left: 12px;
}

/* Pagination styling */
.pagination-container {
  padding: 20px 0 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
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

/* Dialog Styling */
::v-deep .el-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
}

::v-deep .el-dialog__header {
  padding: 20px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #eaecef;
}

::v-deep .el-dialog__title {
  font-weight: 600;
  color: #344767;
  font-size: 18px;
}

::v-deep .el-dialog__body {
  padding: 24px;
}

::v-deep .el-dialog__footer {
  padding: 16px 24px;
  border-top: 1px solid #eaecef;
}

/* Dialog footer buttons */
.dialog-footer .el-button {
  padding: 8px 20px;
  min-width: 90px;
  font-weight: 500;
  letter-spacing: 0.3px;
  border-radius: 6px;
}

.dialog-footer .el-button+.el-button {
  margin-left: 12px;
}

/* Position Detail styling */
.position-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 16px;
  margin-bottom: 0;
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-label {
  font-weight: 600;
  color: #344767;
  font-size: 15px;
}

.detail-value {
  color: #5a6a85;
  font-size: 14px;
  line-height: 1.6;
}

.description-content {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #eaecef;
}

.description-content ::v-deep p {
  margin-bottom: 10px;
}

.description-content ::v-deep ul,
.description-content ::v-deep ol {
  padding-left: 20px;
  margin-bottom: 10px;
}

.description-content ::v-deep img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>
