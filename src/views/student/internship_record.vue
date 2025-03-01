<template>
  <div class="app-container">
    <el-card class="main-card">
      <div slot="header" class="card-header">
        <div class="header-left">
          <span class="page-title">实习记录管理</span>
          <span class="page-subtitle">Internship Record Management</span>
        </div>
        <div class="header-right">
          <el-button type="primary" icon="el-icon-plus" class="action-button" @click="handleCreate">创建实习记录</el-button>
        </div>
      </div>

      <div class="search-container">
        <el-input v-model="search" placeholder="请输入手机号/姓名/公司名称/岗位" style="width: 300px;" />
        <el-button type="primary" icon="el-icon-search" class="action-button" @click="handleSearch">搜索</el-button>
      </div>

      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          fit
          highlight-current-row
          class="data-table"
          :header-cell-style="{ background: '#f8f9fa', color: '#344767', fontWeight: '600' }"
          :cell-style="{ padding: '12px 8px' }"
        >
          <el-table-column prop="username" label="姓名" align="center" />
          <el-table-column prop="phone_number" label="手机号" align="center" />
          <el-table-column prop="salary" label="工资" align="center" />
          <el-table-column prop="position" label="岗位" align="center" />
          <el-table-column prop="company_name" label="公司名称" align="center" />
          <el-table-column prop="location" label="地点" align="center" />
          <el-table-column prop="work_hours" label="实习时长" align="center" />
          <el-table-column prop="description" label="备注" align="center" />
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" class="company-dialog">
        <el-form :model="form" label-width="100px">
          <el-form-item label="手机号">
            <el-input v-model="form.phone_number" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="工资">
            <el-input v-model="form.salary" placeholder="请输入工资" />
          </el-form-item>
          <el-form-item label="岗位">
            <el-input v-model="form.position" placeholder="请输入岗位" />
          </el-form-item>
          <el-form-item label="公司名称">
            <el-input v-model="form.company_name" placeholder="请输入公司名称" />
          </el-form-item>
          <el-form-item label="地点">
            <el-input v-model="form.location" placeholder="请输入地点" />
          </el-form-item>
          <el-form-item label="实习时长">
            <el-input v-model="form.work_hours" placeholder="请输入实习时长" />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="form.start_date" type="datetime" placeholder="选择开始时间" style="width: 100%" />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="form.end_date" type="datetime" placeholder="选择结束时间" style="width: 100%" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.description" type="textarea" placeholder="请输入备注" :rows="4" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">{{ dialogTitle === '创建实习记录' ? '创建' : '保存' }}</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { fetchList, createInternshipRecord, updateInternshipRecord, deleteInternshipRecord, searchInternshipRecord } from '@/api/internship_record'
import moment from 'moment'

export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        phone_number: '',
        salary: '',
        position: '',
        company_name: '',
        location: '',
        work_hours: '',
        start_date: '',
        end_date: '',
        description: ''
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      search: '',
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      fetchList({
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(response => {
        this.tableData = response.data
        this.total = response.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCreate() {
      this.dialogTitle = '创建实习记录'
      this.dialogVisible = true
      this.form = {
        phone_number: '',
        salary: '',
        position: '',
        company_name: '',
        location: '',
        work_hours: '',
        start_date: '',
        end_date: '',
        description: ''
      }
    },
    handleSave() {
      if (this.dialogTitle === '创建实习记录') {
        createInternshipRecord(this.form).then(response => {
          this.$message.success('实习记录创建成功')
          this.fetchData()
          this.dialogVisible = false
        })
      } else {
        // convert date
        this.form.start_date = moment(this.form.start_date).format('YYYY-MM-DDTHH:mm:ss')
        this.form.end_date = moment(this.form.end_date).format('YYYY-MM-DDTHH:mm:ss')
        updateInternshipRecord(this.form, this.form.id).then(response => {
          this.$message.success('实习记录更新成功')
          this.fetchData()
          this.dialogVisible = false
        })
      }
    },
    handleEdit(row) {
      this.dialogTitle = '编辑实习记录'
      this.dialogVisible = true
      this.form = row
    },
    handleDelete(row) {
      this.$confirm('确定删除该实习记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInternshipRecord(row.id).then(response => {
          this.$message.success('实习记录删除成功')
          this.fetchData()
        })
      })
    },
    handleSearch() {
      this.loading = true
      searchInternshipRecord(this.search).then(response => {
        this.tableData = response.data
        this.total = response.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.fetchData()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchData()
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

.header-right {
  display: flex;
  gap: 12px;
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

/* Info Button Styling */
.el-button--info {
  background: linear-gradient(135deg, #67758d 0%, #5c677d 100%);
  border: none;
  color: white;
}

.el-button--info:hover {
  background: linear-gradient(135deg, #76859e 0%, #6c778d 100%);
}

/* Danger Button Styling */
.el-button--danger {
  background: linear-gradient(135deg, #f53f5b 0%, #d23451 100%);
  border: none;
}

.el-button--danger:hover {
  background: linear-gradient(135deg, #ff4d6a 0%, #e13d5c 100%);
}

.el-button--danger:focus {
  box-shadow: 0 0 0 3px rgba(245, 63, 91, 0.3);
}

/* Plain Button Styling */
.el-button--primary.is-plain {
  background: transparent;
  border: 1px solid #4776E6;
  color: #4776E6;
}

.el-button--primary.is-plain:hover {
  background: rgba(71, 118, 230, 0.05);
  color: #3843D0;
  border-color: #3843D0;
}

.el-button--info.is-plain {
  background: transparent;
  border: 1px solid #67758d;
  color: #67758d;
}

.el-button--info.is-plain:hover {
  background: rgba(103, 117, 141, 0.05);
  color: #5c677d;
  border-color: #5c677d;
}

.el-button--danger.is-plain {
  background: transparent;
  border: 1px solid #f53f5b;
  color: #f53f5b;
}

.el-button--danger.is-plain:hover {
  background: rgba(245, 63, 91, 0.05);
  color: #d23451;
  border-color: #d23451;
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

/* Table Button Styling */
.data-table ::v-deep .el-button {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
  min-width: 70px;
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

/* Form Styling */
::v-deep .el-form-item__label {
  font-weight: 500;
  color: #344767;
}

::v-deep .el-input__inner,
::v-deep .el-select .el-input__inner {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 10px 15px;
  height: 42px;
}

::v-deep .el-input__inner:focus,
::v-deep .el-select .el-input__inner:focus {
  border-color: #5e72e4;
}

/* Date Picker Fixes */
::v-deep .el-date-editor.el-input {
  width: 100%;
}

::v-deep .el-date-editor .el-input__prefix {
  left: 8px;
  top: 1px;
}

::v-deep .el-date-editor .el-input__inner {
  padding-left: 38px;
}

::v-deep .el-date-editor .el-input__suffix {
  right: 8px;
}

/* Dialog Footer Buttons */
::v-deep .el-dialog__footer .el-button {
  padding: 8px 20px;
  min-width: 90px;
  font-weight: 500;
  letter-spacing: 0.3px;
  border-radius: 6px;
}

::v-deep .el-dialog__footer .el-button+.el-button {
  margin-left: 12px;
}

::v-deep .el-dialog__footer .el-button:not(.el-button--primary) {
  background: #f4f6f9;
  border: 1px solid #e0e5ec;
  color: #4e5d78;
}

::v-deep .el-dialog__footer .el-button:not(.el-button--primary):hover {
  background: #ebeef5;
  color: #344767;
}
</style>
