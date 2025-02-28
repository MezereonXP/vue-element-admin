<template>
  <div class="container">
    <div class="header">
      <el-button type="success" icon="el-icon-refresh" plain @click="refresh">刷新</el-button>
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
      editDialogVisible: false
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
      })
    },
    refresh() {
      this.getList()
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
.el-dialog {
  border-radius: 10px;
  overflow: hidden;
  min-width: 700px;
}

.el-dialog ::v-deep .el-dialog__header {
  padding: 22px 25px;
  background-color: #f9fafc;
  border-bottom: 1px solid #eef2f6;
}

.el-dialog ::v-deep .el-dialog__title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.2rem;
}

.el-dialog ::v-deep .el-dialog__headerbtn {
  top: 18px;
  right: 20px;
}

.el-dialog ::v-deep .el-dialog__headerbtn:hover .el-dialog__close {
  color: #409eff;
  transform: rotate(90deg);
  transition: all 0.3s;
}

.el-dialog ::v-deep .el-dialog__body {
  padding: 30px 25px;
  color: #606266;
}

.el-dialog ::v-deep .el-dialog__footer {
  padding: 15px 25px 20px;
  border-top: 1px solid #eef2f6;
  background-color: #f9fafc;
}

/* Position details table */
table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ebeef5 !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
  width: 100%;
}

table td {
  border-color: #ebeef5 !important;
  padding: 16px 20px !important;
  line-height: 1.7;
  font-size: 0.95rem;
}

table td:first-child {
  color: #445566;
  font-weight: 600;
  background-color: #f9fafc;
}

table tr:nth-child(odd) {
  background-color: #fafbfc;
}

table tr:nth-child(even) {
  background-color: #ffffff;
}

table tr:last-child td {
  border-bottom: none !important;
}

.dialog-footer {
  text-align: right;
  margin-top: 25px;
}

/* Loading state */
.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}

/* Empty state */
.el-table__empty-block {
  min-height: 200px;
}

.el-table__empty-text {
  color: #909399;
}

/* Responsive adjustments */
@media screen and (max-width: 1600px) {
  .container {
    max-width: 95%;
  }
}

@media screen and (max-width: 992px) {
  .container {
    padding: 25px 30px;
    margin: 15px auto;
    max-width: 95%;
  }

  .el-dialog {
    min-width: auto;
  }

  .el-button {
    padding: 9px 16px;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 20px;
    margin: 10px;
  }

  .el-dialog ::v-deep .el-dialog__body {
    padding: 20px;
  }

  table td {
    padding: 12px 15px !important;
  }

  .el-button {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .el-pagination {
    margin: 25px 0 10px;
    padding: 10px 0;
  }
}

@media screen and (max-width: 576px) {
  .container {
    padding: 15px;
    margin: 5px;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .el-table ::v-deep th,
  .el-table ::v-deep td {
    padding: 10px 5px;
    font-size: 0.9rem;
  }

  .el-dialog {
    width: 95% !important;
    margin-top: 10vh !important;
  }
}
</style>
