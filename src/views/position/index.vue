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
      style="margin-top: 20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    />

    <el-dialog title="岗位详情" :visible.sync="viewDialogVisible" width="50%">
      <table
        style="width: 100%; border: 1px solid #000; border-collapse: collapse;"
        border="1"
        cellpadding="10"
        cellspacing="0"
        border-collapse="collapse"
      >
        <tr>
          <td style="width: 20%; font-weight: bold;">岗位名称：</td>
          <td style="width: 80%;">{{ form.title }}</td>
        </tr>
        <tr>
          <td style="width: 20%; font-weight: bold;">实习企业：</td>
          <td style="width: 80%;">{{ form.company_name }}</td>
        </tr>
        <tr>
          <td style="width: 20%; font-weight: bold;">岗位地点：</td>
          <td style="width: 80%;">{{ form.location }}</td>
        </tr>
        <tr>
          <td style="width: 20%; font-weight: bold;">岗位薪资：</td>
          <td style="width: 80%;">{{ form.salary_description }}</td>
        </tr>
        <tr>
          <td style="width: 20%; font-weight: bold;">岗位职责：</td>
          <td style="width: 80%;" v-html="form.description" />
        </tr>
      </table>
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
  background-color: #409EFF;
  color: #fff;
  border: none;

  .el-icon-refresh.is-refreshing {
    -webkit-animation: spin 1s linear infinite;
    -moz-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
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
.el-pagination {
  text-align: center;
  margin: 35px 0 20px;
  padding: 15px 0;
  background-color: #f9fafc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.el-pagination ::v-deep .el-pagination__total,
.el-pagination ::v-deep .el-pagination__jump {
  color: #606880;
}

.el-pagination ::v-deep .btn-prev,
.el-pagination ::v-deep .btn-next {
  border-radius: 4px;
  transition: all 0.2s;
}

.el-pagination ::v-deep .el-pager li {
  border-radius: 4px;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  font-weight: 500;
  color: #606880;
  transition: all 0.2s;
}

.el-pagination ::v-deep .el-pager li.active {
  background-color: #409eff;
  color: white;
  font-weight: 600;
}

.el-pagination ::v-deep .el-pager li:hover:not(.active) {
  color: #409eff;
}

/* Dialog styling */
.el-dialog ::v-deep .el-dialog__header {
  padding: 20px 25px;
  border-bottom: 1px solid #ebeef5;
  position: relative;
}

.el-dialog ::v-deep .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 12px;
}

.el-dialog ::v-deep .el-dialog__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 3px;
  background-color: #409EFF;
  border-radius: 2px;
}

.el-dialog ::v-deep .el-dialog__body {
  padding: 25px 30px;
}

.el-dialog ::v-deep .el-dialog__footer {
  padding: 15px 25px 20px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

.el-dialog ::v-deep .el-dialog__wrapper {
  backdrop-filter: blur(5px);
}

.el-dialog ::v-deep .el-dialog {
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.el-dialog ::v-deep .el-dialog__headerbtn {
  font-size: 18px;
  top: 20px;
  right: 20px;
}

.el-dialog ::v-deep .el-dialog__headerbtn:hover .el-dialog__close {
  color: #409EFF;
  transform: rotate(90deg);
  transition: all 0.3s ease;
}

.el-dialog ::v-deep .el-dialog__close {
  transition: all 0.3s ease;
}

/* Dialog content table styling */
.el-dialog table {
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5 !important;
}

.el-dialog table td {
  padding: 14px 20px !important;
  line-height: 1.5;
  color: #606266;
  border: 1px solid #ebeef5 !important;
}

.el-dialog table tr td:first-child {
  background-color: #f8f9fc;
  color: #303133;
  font-weight: 600;
  width: 140px;
}

.el-dialog table tr:hover {
  background-color: #f8fbff;
}

/* Dialog footer buttons */
.dialog-footer .el-button {
  padding: 10px 25px;
  font-size: 14px;
}
</style>
