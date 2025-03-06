<template>
  <div class="app-container">
    <el-card class="main-card">
      <div slot="header" class="card-header">
        <div class="header-left">
          <span class="page-title">学生管理系统</span>
          <span class="page-subtitle">Student Management</span>
        </div>
        <div class="header-right">
          <el-button type="primary" icon="el-icon-plus" class="action-button" @click="openCreateDialog">新增学生</el-button>
          <el-button type="info" class="action-button refresh-button" @click="refresh">
            <i :class="['el-icon-refresh', { 'is-refreshing': isRefreshing }]" /> 刷新
          </el-button>

          <el-button type="primary" icon="el-icon-upload" @click="importStudentsFromExcel">导入</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportStudentsToExcel">导出</el-button>
          <el-button type="primary" icon="el-icon-download" @click="downloadExcelTemplate">下载模板</el-button>

        </div>
      </div>

      <div class="filter-section">
        <div class="search-wrapper">
          <el-input
            v-model="search"
            placeholder="搜索姓名或手机号"
            prefix-icon="el-icon-search"
            clearable
            class="search-input"
            @keyup.enter.native="searchStudent"
          />
          <el-button type="primary" class="search-button" @click="searchStudent">查找</el-button>
        </div>

        <!-- <div class="filter-options"> -->
        <!-- You could add filter dropdowns here in the future -->
        <!-- </div> -->

      </div>

      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="studentList"
          border
          fit
          highlight-current-row
          class="data-table"
          :header-cell-style="{ background: '#f8f9fa', color: '#344767', fontWeight: '600' }"
          :cell-style="{ padding: '12px 8px' }"
        >
          <el-table-column align="center" label="姓名" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="性别" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.sex == 'male' ? '男' : '女' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="民族" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.nationality }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="年龄" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.age }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="班级" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.school_class }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="专业" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.major }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.phone_number }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色" width="120">
            <template slot-scope="scope">
              <div class="role-tags-wrapper">
                <el-tag v-if="scope.row.roles.includes('user')" type="info" size="small">学生</el-tag>
                <el-tag v-if="scope.row.roles.includes('admin')" type="warning" size="small">管理员</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="210">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-edit" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getStudentList"
      />

      <el-dialog :visible.sync="dialogVisible" title="编辑学生信息" width="500px">
        <div>
          <el-form label-width="80px" size="medium">
            <el-form-item label="姓名">
              <el-input v-model="selectedStudent.username" placeholder="请输入姓名" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="selectedStudent.email" placeholder="请输入邮箱" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="selectedStudent.phone_number" placeholder="请输入手机号" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="selectedStudent.sex" placeholder="请选择性别" style="width: 300px;">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input-number v-model="selectedStudent.age" :min="0" :max="150" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="民族">
              <el-select v-model="selectedStudent.nationality" placeholder="请选择民族" style="width: 300px;">
                <el-option v-for="nation in nations" :key="nation.name" :label="nation.name" :value="nation.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="班级">
              <el-input v-model="selectedStudent.school_class" placeholder="请输入班级" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="selectedStudent.major" placeholder="请输入专业" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="实习企业">
              <el-input v-model="selectedStudent.internship_company" placeholder="请输入实习企业" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="实习岗位">
              <el-input v-model="selectedStudent.internship_position" placeholder="请输入实习岗位" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="selectedStudent.roles" placeholder="请选择角色" multiple style="width: 300px;">
                <el-option label="学生" value="user" />
                <el-option label="管理员" value="admin" />
              </el-select>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="password" style="width: 200px;" />
              <el-button type="primary" style="margin-left: 10px;" @click="generatePassword">生成密码</el-button>
            </el-form-item>
          </el-form>

          <!-- Add more fields as necessary -->
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="isEdit" type="primary" @click="saveChanges">更新</el-button>
          <el-button v-if="!isEdit" type="primary" @click="createStudent">创建</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserList, updateProfile, createUser, deleteUser, searchUser, downloadTemplate, importStudents, exportStudents } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'StudentList',
  components: { Pagination },
  data() {
    return {
      studentList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogVisible: false,
      selectedStudent: {},
      isEdit: false,
      password: '',
      createDialogVisible: false,
      search: '',
      nations: [{ name: '汉族' }, { name: '回族' }, { name: '藏族' }, { name: '维吾尔族' }],
      isRefreshing: false
    }
  },
  created() {
    this.getStudentList()
  },
  methods: {
    getStudentList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.studentList = res.users
        this.total = res.total
        this.$message.success('获取学生列表成功')
        this.listLoading = false
      })
    },
    openEditDialog(row) {
      this.password = ''
      this.selectedStudent = row
      this.dialogVisible = true
      this.isEdit = true
    },
    saveChanges() {
      if (!this.isEdit) {
        this.createStudent()
      } else {
        const userData = { ...this.selectedStudent }
        // Ask user to confirm the update
        console.log(this.password)
        if (this.password) {
          this.$confirm('确定要更新密码吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            userData.password = this.password
            updateProfile(userData).then(res => {
              if (res.code === 20000) {
                this.dialogVisible = false
                this.$message.success('更新成功')
              } else {
                this.$message.error('更新失败')
              }
            })
          })
        } else {
          updateProfile(userData).then(res => {
            if (res.code === 20000) {
              this.dialogVisible = false
              this.$message.success('更新成功')
            } else {
              this.$message.error('更新失败')
            }
          })
        }
      }
    },
    handleEdit(row) {
      console.log(row)
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(res => {
          if (res.code === 20000) {
            this.$message.success('删除成功')
            this.getStudentList()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    generatePassword() {
      const randomString = Math.random().toString(36).substring(2, 15)
      console.log(randomString)
      this.password = randomString
    },
    openCreateDialog() {
      this.dialogVisible = true
      this.createDialogVisible = true
      this.isEdit = false
      this.selectedStudent = {
        roles: ['user'],
        sex: 'male',
        age: 20,
        nationality: '汉族',
        school_class: '',
        major: '',
        internship_company: '',
        internship_position: ''
      }
    },
    createStudent() {
      const userData = { ...this.selectedStudent }
      // validate all fields
      if (!userData.username || !userData.email || !userData.phone_number || !userData.sex || !userData.age || !userData.roles || !userData.school_class || !userData.major || !userData.internship_company || !userData.internship_position) {
        this.$message.error('请填写所有必填项')
        return
      }
      userData.password = this.password
      createUser(userData).then(res => {
        if (res.code === 20000) {
          this.dialogVisible = false
          this.$message.success('创建成功')
          this.getStudentList()
        }
      })
    },
    searchStudent() {
      if (!this.search) {
        this.$message.error('请输入搜索内容')
        return
      }
      this.listLoading = true
      const query = {
        query: this.search,
        page: 1,
        limit: 20
      }
      searchUser(query).then(res => {
        this.studentList = res.users
        this.total = res.total
        this.listLoading = false
        this.$message.success('搜索成功')
      })
    },
    refresh() {
      this.isRefreshing = true
      this.getStudentList()
      setTimeout(() => {
        this.isRefreshing = false
      }, 500)
    },
    importStudentsFromExcel() {
      // open file input
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.xlsx, .xls, .csv'
      fileInput.onchange = (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        importStudents(formData).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            this.getStudentList()
          }
        })
      }
      fileInput.click()
    },
    exportStudentsToExcel() {
      exportStudents().then(res => {
        if (res.code === 20000) {
          this.$message.success(res.message)
          window.open(res.url, '_blank')
        } else {
          this.$message.error('导出失败')
        }
      })
    },
    downloadExcelTemplate() {
      downloadTemplate().then(res => {
        if (res.code === 20000) {
          window.open(res.url, '_blank')
        } else {
          this.$message.error('下载模板失败')
        }
      })
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
  width: 80%;
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

/* Search Button Styling */
.search-button {
  border-radius: 0 6px 6px 0;
  height: 40px;
  margin-left: 0;
  padding: 0 16px;
  background: linear-gradient(135deg, #4776E6 0%, #3843D0 100%);
  border: none;
  font-weight: 500;
}

.search-button:hover {
  background: linear-gradient(135deg, #5584FF 0%, #4251E8 100%);
}

/* Table Button Styling */
.data-table ::v-deep .el-button {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
  min-width: 80px;
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

/* Password Button Styling */
::v-deep .el-form-item__content .el-button {
  height: 42px;
  border-radius: 8px;
  font-weight: 500;
}

/* Disabled Button Styling */
.el-button.is-disabled,
.el-button.is-disabled:hover {
  background: #f5f7fa;
  border-color: #dcdfe6;
  color: #c0c4cc;
}

/* Refresh Button Enhancement */
.refresh-button {
  min-width: 80px;
}

/* Filter Section */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.search-wrapper {
  display: flex;
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
}

.search-input ::v-deep .el-input__inner {
  border-radius: 8px 0 0 8px;
  border-right: none;
  height: 40px;
  padding-left: 35px;
}

.search-input ::v-deep .el-input__prefix {
  left: 10px;
  display: flex;
  align-items: center;
}

.search-input ::v-deep .el-input__icon {
  line-height: normal;
  color: #909399;
}

.search-input ::v-deep .el-input__icon+.el-input__inner {
  padding-left: 35px;
}

.search-input ::v-deep .el-input__icon.el-icon-circle-close {
  right: 10px;
  left: auto;
  color: #C0C4CC;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.search-input ::v-deep .el-input__icon.el-icon-circle-close:hover {
  color: #909399;
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

/* Refresh Animation */
.refresh-button .is-refreshing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Pagination Styling */
::v-deep .pagination-container {
  padding: 15px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
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

::v-deep .el-input-number.is-controls-right .el-input__inner {
  padding-right: 50px;
}

/* Tag styling */
::v-deep .el-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* Role tag styling and alignment */
.data-table ::v-deep .el-table__row .el-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  line-height: 1;
  border: none;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

/* Student role tag */
.data-table ::v-deep .el-tag--success {
  background: rgba(38, 187, 107, 0.1);
  color: #26bb6b;
}

/* Admin role tag */
.data-table ::v-deep .el-tag--info {
  background: rgba(90, 106, 133, 0.1);
  color: #5a6a85;
}

/* Center tags in cell */
.data-table ::v-deep .el-table__cell {
  vertical-align: middle;
}

/* Role column tag wrapper */
.role-tags-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

/* Remove any horizontal scrolling within the card */
.main-card ::v-deep .el-table__body-wrapper,
.main-card ::v-deep .el-table__header-wrapper {
  width: 100% !important;
  overflow-x: hidden;
}

/* Fix potential table header/body misalignment */
.data-table ::v-deep .el-table__header,
.data-table ::v-deep .el-table__body {
  width: 100% !important;
  table-layout: fixed !important;
}

/* Fix potential padding issues */
.main-card ::v-deep .el-card__body>* {
  width: 100%;
  box-sizing: border-box;
}
</style>
