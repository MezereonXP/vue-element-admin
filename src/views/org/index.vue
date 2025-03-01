<template>
  <div class="container">
    <el-card>
      <div slot="header" class="card-header">
        <span class="title">组织架构</span>
        <el-button
          v-if="isAdmin"
          type="success"
          size="small"
          icon="el-icon-plus"
          plain
          class="add-button"
          @click="openEditorForAdd"
        >添加</el-button>
      </div>

      <el-table :data="tableData" style="width: 100%;">
        <!-- <el-table-column prop="id" label="编号" width="100" /> -->
        <el-table-column prop="title" label="标题" min-width="60%">
          <template slot-scope="scope">
            <router-link :to="`/org/detail/${scope.row.id}`" class="title-link">{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间" min-width="25%" :formatter="formatDate" />
        <el-table-column v-if="isAdmin" label="操作" min-width="15%">
          <template slot-scope="scope">
            <el-button
              v-if="isAdmin"
              type="primary"
              size="small"
              icon="el-icon-edit"
              plain
              @click="openEditor(scope.row)"
            />
            <el-button
              v-if="isAdmin"
              type="danger"
              size="small"
              icon="el-icon-delete"
              plain
              @click="deleteContent(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="limit"
        :current-page="page"
        class="pagination"
        @current-change="fetchSchoolData"
        @size-change="handleSizeChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
      />
    </el-card>
    <el-dialog
      :visible.sync="addVisible"
      title="添加"
      custom-class="custom-dialog"
      width="60%"
      :close-on-click-modal="false"
      :before-close="handleCloseDialog"
    >
      <div class="dialog-content">
        <div class="form-group" :class="{ 'has-error': titleError }">
          <label>标题：<span class="required">*</span></label>
          <el-input v-model="title" placeholder="请输入标题" maxlength="100" show-word-limit @input="validateTitle" />
          <div v-if="titleError" class="error-message">{{ titleError }}</div>
        </div>
        <div class="form-group" :class="{ 'has-error': contentError }">
          <label>内容：<span class="required">*</span></label>
          <Tinymce ref="editor" v-model="editorContent" :height="400" @change="validateContent" />
          <div v-if="contentError" class="error-message">{{ contentError }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          :disabled="!isFormValid || submitLoading"
          @click="addContent"
        >添加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editorVisible"
      title="编辑"
      custom-class="custom-dialog"
      width="60%"
      :close-on-click-modal="false"
      :before-close="handleCloseDialog"
    >
      <div class="dialog-content">
        <div class="form-group" :class="{ 'has-error': titleError }">
          <label>标题：<span class="required">*</span></label>
          <el-input v-model="title" placeholder="请输入标题" maxlength="100" show-word-limit @input="validateTitle" />
          <div v-if="titleError" class="error-message">{{ titleError }}</div>
        </div>
        <div class="form-group" :class="{ 'has-error': contentError }">
          <label>内容：<span class="required">*</span></label>
          <Tinymce ref="editor" v-model="editorContent" :height="400" @change="validateContent" />
          <div v-if="contentError" class="error-message">{{ contentError }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          :disabled="!isFormValid || submitLoading"
          @click="saveContent"
        >保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addText, fetchText, updateText, deleteTextById } from '@/api/text'
import moment from 'moment'
import Tinymce from '@/components/Tinymce'
import router from '@/router'

export default {
  name: 'SchoolIntroduction',
  components: { Tinymce },
  data() {
    return {
      tableData: [],
      updatedAt: '',
      isAdmin: false,
      loading: false,
      editorVisible: false,
      addVisible: false,
      editorContent: '',
      text_type: 3,
      page: 1,
      limit: 10,
      total: 0,
      title: '',
      id: 0,
      titleError: '',
      contentError: '',
      submitLoading: false,
      formChanged: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'id'
    ]),
    isFormValid() {
      return this.title.trim() !== '' &&
        this.editorContent.trim() !== '' &&
        !this.titleError &&
        !this.contentError
    }
  },
  created() {
    this.fetchSchoolData()
    this.checkUserRole()
  },
  methods: {
    async fetchSchoolData() {
      try {
        this.loading = true
        const response = await fetchText(this.page, this.limit, this.text_type)
        this.tableData = response.texts
        this.total = response.total
        this.page = response.page
        this.loading = false
      } catch (error) {
        console.error('Error fetching school data:', error)
        this.loading = false
      }
    },
    checkUserRole() {
      if (this.roles !== undefined) {
        this.isAdmin = this.roles.includes('admin')
        console.log(this.roles)
      }
    },
    validateTitle() {
      this.formChanged = true
      if (!this.title.trim()) {
        this.titleError = '标题不能为空'
      } else if (this.title.length > 100) {
        this.titleError = '标题不能超过100个字符'
      } else {
        this.titleError = ''
      }
    },
    validateContent() {
      this.formChanged = true
      if (!this.editorContent.trim()) {
        this.contentError = '内容不能为空'
      } else {
        this.contentError = ''
      }
    },
    validateForm() {
      this.validateTitle()
      this.validateContent()
      return this.isFormValid
    },
    handleCloseDialog() {
      if (this.formChanged) {
        this.$confirm('您有未保存的更改，确定要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resetForm()
        }).catch(() => { })
      } else {
        this.resetForm()
      }
    },
    resetForm() {
      this.title = ''
      this.editorContent = ''
      this.titleError = ''
      this.contentError = ''
      this.submitLoading = false
      this.formChanged = false
      this.editorVisible = false
      this.addVisible = false
    },
    async saveContent() {
      if (!this.validateForm()) {
        this.$message({
          message: '请完成必填项',
          type: 'warning'
        })
        return
      }

      try {
        this.submitLoading = true
        await updateText({
          title: this.title,
          text_type: this.text_type,
          text: this.editorContent
        }, this.id)

        this.$notify({
          title: '成功',
          message: '内容已成功更新',
          type: 'success',
          duration: 3000
        })

        this.resetForm()
        this.fetchSchoolData()
      } catch (error) {
        this.$notify({
          title: '更新失败',
          message: error.message || '保存过程中发生错误',
          type: 'error',
          duration: 5000
        })
      } finally {
        this.submitLoading = false
      }
    },
    async addContent() {
      if (!this.validateForm()) {
        this.$message({
          message: '请完成必填项',
          type: 'warning'
        })
        return
      }

      try {
        this.submitLoading = true
        await addText({
          title: this.title,
          text_type: this.text_type,
          text: this.editorContent
        })

        this.$notify({
          title: '成功',
          message: '内容已成功添加',
          type: 'success',
          duration: 3000
        })

        this.resetForm()
        this.fetchSchoolData()
      } catch (error) {
        this.$notify({
          title: '添加失败',
          message: error.message || '添加过程中发生错误',
          type: 'error',
          duration: 5000
        })
      } finally {
        this.submitLoading = false
      }
    },
    handleSizeChange(newSize) {
      this.limit = newSize
      this.fetchSchoolData()
    },
    handlePrevClick() {
      this.page--
      this.fetchSchoolData()
    },
    handleNextClick() {
      this.page++
      this.fetchSchoolData()
    },
    deleteContent(id) {
      this.$confirm('确定删除该内容吗？删除后无法恢复。', '警告', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        distinguishCancelAndClose: true,
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        this.submitLoading = true
        deleteTextById(id).then(() => {
          this.$notify({
            title: '成功',
            message: '内容已成功删除',
            type: 'success',
            duration: 3000
          })
          this.fetchSchoolData()
        }).catch(error => {
          this.$notify({
            title: '删除失败',
            message: error.message || '删除过程中发生错误',
            type: 'error',
            duration: 5000
          })
        }).finally(() => {
          this.submitLoading = false
        })
      }).catch(() => { })
    },
    openEditor(row) {
      this.id = row.id
      this.title = row.title
      this.editorContent = row.text
      this.formChanged = false
      this.editorVisible = true
    },
    openEditorForAdd() {
      this.title = ''
      this.editorContent = ''
      this.formChanged = false
      this.addVisible = true
    },
    formatDate(row, column) {
      return moment(row.updated_at).utc().format('YYYY-MM-DD HH:mm:ss')
    },
    getColumnWidth(column) {
      const totalWidth = 1000 // Example total width
      const ratios = {
        title: 0.6 // 60% of the total width
        // Add other columns and their ratios here
      }
      return totalWidth * (ratios[column] || 0.1) // Default to 10% if not specified
    },
    jumpToDetail(id) {
      router.push(`/org/detail/${id}`)
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-button {
  margin-left: auto;
  margin-right: 90px;
}

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

.container {
  margin: 30px;
  width: calc(100% - 60px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.title-link {
  color: #409EFF;
  text-decoration: none;
  transition: color 0.2s;
}

.title-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* Dialog styling */
.custom-dialog>>>.el-dialog__header {
  padding: 22px 24px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f9fafc;
  position: relative;
}

.custom-dialog>>>.el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.2px;
}

.custom-dialog>>>.el-dialog__headerbtn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 18px;
  transition: all 0.3s;
}

.custom-dialog>>>.el-dialog__headerbtn:hover .el-dialog__close {
  color: #409eff;
  transform: rotate(90deg);
  transition: all 0.3s;
}

.custom-dialog>>>.el-dialog__body {
  padding: 30px 28px;
  color: #606266;
}

.custom-dialog>>>.el-dialog__footer {
  padding: 18px 24px;
  border-top: 1px solid #ebeef5;
  background-color: #f9fafc;
  text-align: right;
}

.dialog-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 5px;
}

.dialog-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-track {
  background-color: #f4f4f5;
  border-radius: 3px;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.form-group .required {
  color: #f56c6c;
  margin-left: 4px;
}

.form-group.has-error .el-input__inner {
  border-color: #f56c6c;
}

.form-group .error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
  line-height: 1.2;
}

.form-group>>>.el-input__inner {
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 15px;
  transition: all 0.2s;
}

.form-group>>>.el-input__inner:hover {
  border-color: #c0c4cc;
}

.form-group>>>.el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.form-group.has-error>>>.el-input__inner:focus {
  border-color: #f56c6c;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .container {
    margin: 20px;
    width: calc(100% - 40px);
  }
}

@media (max-width: 768px) {
  .container {
    margin: 15px;
    width: calc(100% - 30px);
  }
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
</style>
