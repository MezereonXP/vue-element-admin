<template>
  <div class="app-container">
    <el-card class="main-card">
      <div slot="header" class="card-header">
        <div class="header-left">
          <span class="page-title">实习企业信息管理</span>
          <span class="page-subtitle">Internship Company Management</span>
        </div>
        <div class="header-right">
          <el-button type="primary" icon="el-icon-plus" class="action-button" @click="handleCreate">添加企业</el-button>
        </div>
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
          <el-table-column prop="logo" label="企业logo" align="center" width="150">
            <template slot-scope="scope">
              <img :src="scope.row.logo" alt="企业logo" class="company-logo">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="企业名称" align="center" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="企业地址" align="center" width="220">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone_number" label="联系电话" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.phone_number }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" align="center" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="established_date" label="建立日期" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.established_date ? new Date(scope.row.established_date).toLocaleDateString() : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="info" plain icon="el-icon-view" @click="handlePreview(scope.row)">预览</el-button>
              <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" class="company-dialog">
        <el-form :model="dialogForm" label-width="100px">
          <el-form-item label="企业logo">
            <Upload v-model="dialogForm.logo" />
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input v-model="dialogForm.name" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item label="企业地址">
            <el-input v-model="dialogForm.address" placeholder="请输入企业地址" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="dialogForm.phone_number" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="dialogForm.email" placeholder="请输入企业邮箱" />
          </el-form-item>
          <el-form-item label="企业简介">
            <Tinymce ref="editor" v-model="dialogForm.introduction" :height="400" />
          </el-form-item>
          <el-form-item label="企业网址">
            <el-input v-model="dialogForm.website" placeholder="请输入企业网址" />
          </el-form-item>
          <el-form-item label="建立日期">
            <el-date-picker v-model="dialogForm.established_date" type="date" placeholder="选择日期" style="width: 100%" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">{{ dialogType === 'create' ? '创建' : '保存' }}</el-button>
        </span>
      </el-dialog>

      <el-dialog title="企业简介预览" :visible.sync="previewVisible" width="700px" class="preview-dialog" top="5vh">
        <div class="preview-header">
          <i class="el-icon-document preview-icon" />
          <span>{{ dialogForm.name || '企业' }}简介</span>
        </div>
        <div class="preview-container">
          <div class="preview-content" v-html="dialogForm.introduction" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="previewVisible = false">取消</el-button>
          <el-button type="primary" @click="previewVisible = false">关闭预览</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCompanyList, createCompany, updateCompany, deleteCompany } from '@/api/company'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
export default {
  name: 'Company',
  components: { Tinymce, Upload },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogTitle: '',
      dialogForm: {},
      dialogType: 'create',
      loading: false,
      previewVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getCompanyList()
  },
  methods: {
    handleEdit(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑企业信息'
      this.dialogForm = { ...row }
      this.dialogType = 'edit'
    },
    handleDelete(row) {
      this.$confirm('确定要删除该企业吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCompany(row.id).then(res => {
          if (res.code === 20000) {
            this.$message.success('删除成功')
            this.getCompanyList()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    handlePreview(row) {
      this.previewVisible = true
      this.dialogForm = { ...row }
    },
    handleSave() {
      console.log(this.dialogForm)
      this.loading = true
      // this.dialogForm.established_date = this.dialogForm.established_date.getTime()
      if (this.dialogType === 'create') {
        createCompany(this.dialogForm).then(res => {
          if (res.code === 20000) {
            this.$message.success('创建成功')
            this.dialogVisible = false
            this.getCompanyList()
          } else {
            this.$message.error('创建失败')
          }
          this.loading = false
        })
      } else {
        updateCompany(this.dialogForm.id, this.dialogForm).then(res => {
          if (res.code === 20000) {
            this.$message.success('更新成功')
            this.dialogVisible = false
            this.getCompanyList()
          } else {
            this.$message.error('更新失败')
          }
          this.loading = false
        })
      }
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogTitle = '创建企业信息'
      this.dialogForm = {}
      this.dialogType = 'create'
    },
    getCompanyList() {
      this.loading = true
      getCompanyList({
        page: this.currentPage,
        limit: this.pageSize
      }).then(res => {
        this.tableData = res.companies
        if (res.code === 20000) {
          this.$message.success('获取数据成功')
          this.total = res.total
          this.currentPage = res.page
        } else {
          this.$message.error('获取数据失败')
        }
        this.loading = false
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getCompanyList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getCompanyList()
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
  width: 90%;
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

/* Company Logo Styling */
.company-logo {
  width: auto;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

/* Preview Dialog Enhancement */
::v-deep .preview-dialog {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 10px 25px rgba(0, 0, 0, 0.1);
}

::v-deep .preview-dialog .el-dialog__header {
  background: #f0f5ff;
  border-bottom: 1px solid #d9e5ff;
  padding: 16px 24px;
}

::v-deep .preview-dialog .el-dialog__title {
  color: #2b3b78;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
}

::v-deep .preview-dialog .el-dialog__title::before {
  content: "\e791";
  font-family: element-icons !important;
  margin-right: 10px;
  color: #4776E6;
  font-size: 20px;
}

.preview-header {
  display: flex;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
}

.preview-icon {
  color: #4776E6;
  font-size: 22px;
  margin-right: 12px;
}

.preview-header span {
  font-size: 18px;
  font-weight: 600;
  color: #344767;
}

.preview-container {
  position: relative;
  background-color: #fcfcfc;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #eaecef;
  margin: 0 0 16px 0;
}

.preview-content {
  height: 450px;
  overflow-y: auto;
  padding: 20px 24px;
  background-color: #fff;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}

/* Custom Scrollbar for the preview content */
.preview-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb {
  background: #cfd7e6;
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: #b0bcd0;
}

/* Style for content inside the preview */
.preview-content ::v-deep h1,
.preview-content ::v-deep h2,
.preview-content ::v-deep h3,
.preview-content ::v-deep h4,
.preview-content ::v-deep h5,
.preview-content ::v-deep h6 {
  color: #344767;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.preview-content ::v-deep p {
  margin-bottom: 16px;
  line-height: 1.6;
}

.preview-content ::v-deep a {
  color: #4776E6;
  text-decoration: none;
}

.preview-content ::v-deep a:hover {
  text-decoration: underline;
}

.preview-content ::v-deep img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 10px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.preview-content ::v-deep ul,
.preview-content ::v-deep ol {
  padding-left: 20px;
  margin-bottom: 16px;
}

.preview-content ::v-deep blockquote {
  border-left: 4px solid #4776E6;
  padding: 12px 20px;
  margin: 16px 0;
  background: #f8f9fa;
  color: #555;
  font-style: italic;
}

.preview-content ::v-deep table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.preview-content ::v-deep table th,
.preview-content ::v-deep table td {
  border: 1px solid #eaecef;
  padding: 8px 12px;
  text-align: left;
}

.preview-content ::v-deep table th {
  background-color: #f8f9fa;
  color: #344767;
  font-weight: 600;
}

.preview-content ::v-deep table tr:nth-child(even) {
  background-color: #fafbfc;
}

/* Enhanced buttons for the preview dialog */
::v-deep .preview-dialog .dialog-footer .el-button {
  padding: 10px 24px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

::v-deep .preview-dialog .dialog-footer .el-button--primary {
  background: linear-gradient(135deg, #4776E6 0%, #3843D0 100%);
  box-shadow: 0 4px 10px rgba(56, 67, 208, 0.25);
  transition: all 0.3s ease;
}

::v-deep .preview-dialog .dialog-footer .el-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(56, 67, 208, 0.35);
}

::v-deep .preview-dialog .el-dialog__body {
  padding: 20px 24px;
}

::v-deep .preview-dialog .el-dialog__footer {
  border-top: 1px solid #edf2f7;
  padding: 16px 24px;
  background: #fafbfd;
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
