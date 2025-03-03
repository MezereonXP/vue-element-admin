<template>
  <div class="container">
    <el-card class="card-container">
      <div slot="header" class="card-header">
        <span class="title">{{ title }}</span>
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
        <el-table-column prop="title" label="标题" min-width="60%">
          <template slot-scope="scope">
            <router-link :to="`/${routeName}/detail/${scope.row.id}`" class="title-link">{{ scope.row.title
            }}</router-link>
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
        :layout="isMobileView ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
        :total="total"
        :page-size="limit"
        :current-page="page"
        class="pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
      />
    </el-card>

    <el-dialog
      :visible.sync="editorVisible"
      :title="transTitle"
      custom-class="custom-dialog"
      :width="isMobileView ? '95%' : '60%'"
      :close-on-click-modal="false"
      :before-close="handleCloseDialog"
    >
      <el-form :model="form" class="dialog-content" label-position="top">
        <el-form-item label="标题" :class="{ 'is-error': titleError }">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
            maxlength="100"
            show-word-limit
            @input="validateTitle"
          />
          <div v-if="titleError" class="error-message">{{ titleError }}</div>
        </el-form-item>
        <el-form-item label="内容" :class="{ 'is-error': contentError }">
          <Tinymce ref="editor" v-model="form.content" :height="400" @change="validateContent" />
          <div v-if="contentError" class="error-message">{{ contentError }}</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="transTitle === '编辑' ? saveContent() : addContent()"
        >{{ transTitle === '编辑' ? '保存' : '添加'
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addText, fetchText, updateText, deleteTextById } from '@/api/text'
import moment from 'moment'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TextManagement',
  components: { Tinymce },
  props: {
    title: {
      type: String,
      required: true
    },
    routeName: {
      type: String,
      required: true
    },
    textType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tableData: [],
      updatedAt: '',
      isAdmin: false,
      loading: false,
      editorVisible: false,
      addVisible: false,
      editorContent: '',
      page: 1,
      limit: 10,
      total: 0,
      titleInput: '',
      id: 0,
      titleError: '',
      contentError: '',
      submitLoading: false,
      formChanged: false,
      form: {
        title: '',
        content: ''
      },
      transTitle: '',
      windowWidth: window.innerWidth
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ]),
    isFormValid() {
      return this.form.title && this.form.title.trim() !== '' &&
                this.form.content && this.form.content.trim() !== ''
    },
    isMobileView() {
      return this.windowWidth < 768
    }
  },
  created() {
    this.fetchData()
    this.checkUserRole()
    window.addEventListener('resize', this.handleResize)
  },
  mounted() {
    this.handleResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth
    },
    async fetchData() {
      try {
        this.loading = true
        const response = await fetchText(this.page, this.limit, this.textType)
        this.tableData = response.texts
        this.total = response.total
        this.page = response.page
        this.loading = false
      } catch (error) {
        console.error(`Error fetching data for ${this.title}:`, error)
        this.loading = false
      }
    },
    checkUserRole() {
      if (this.roles !== undefined) {
        this.isAdmin = this.roles.includes('admin')
      }
    },
    validateTitle() {
      this.formChanged = true
      if (!this.form.title || !this.form.title.trim()) {
        this.titleError = '标题不能为空'
        return false
      } else if (this.form.title.length > 100) {
        this.titleError = '标题不能超过100个字符'
        return false
      } else {
        this.titleError = ''
        return true
      }
    },
    validateContent() {
      this.formChanged = true
      if (!this.form.content || !this.form.content.trim()) {
        this.contentError = '内容不能为空'
        return false
      } else {
        this.contentError = ''
        return true
      }
    },
    validateForm() {
      const isTitleValid = this.validateTitle()
      const isContentValid = this.validateContent()
      return isTitleValid && isContentValid
    },
    handleCloseDialog() {
      if (this.formChanged) {
        this.$confirm('您有未保存的更改，确定要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resetForm()
        }).catch(() => {
          // User clicked cancel, do nothing
        })
      } else {
        this.resetForm()
      }
    },
    resetForm() {
      // Reset form values
      this.form = {
        title: '',
        content: ''
      }
      this.titleInput = ''
      this.editorContent = ''
      this.titleError = ''
      this.contentError = ''
      this.submitLoading = false
      this.formChanged = false
      this.editorVisible = false
      this.addVisible = false
    },
    formatDate(row, column) {
      return moment(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    },
    openEditorForAdd() {
      this.transTitle = '添加'
      this.editorVisible = true
      this.form = {
        title: '',
        content: ''
      }
      this.$nextTick(() => {
        if (this.$refs.editor && typeof this.$refs.editor.setContent === 'function') {
          this.$refs.editor.setContent('')
        }
      })
    },
    openEditor(row) {
      this.transTitle = '编辑'
      this.editorVisible = true
      this.id = row.id
      this.form = {
        title: row.title,
        content: row.text
      }
      this.$nextTick(() => {
        if (this.$refs.editor && typeof this.$refs.editor.setContent === 'function') {
          this.$refs.editor.setContent(row.text)
        }
      })
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
          title: this.form.title,
          text_type: this.textType,
          text: this.form.content
        }, this.id)

        this.$notify({
          title: '成功',
          message: '内容已成功更新',
          type: 'success',
          duration: 3000
        })

        this.resetForm()
        this.fetchData()
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
          title: this.form.title,
          text_type: this.textType,
          text: this.form.content
        })

        this.$notify({
          title: '成功',
          message: '内容已成功添加',
          type: 'success',
          duration: 3000
        })

        this.resetForm()
        this.fetchData()
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
    async deleteContent(id) {
      try {
        await this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await deleteTextById(id)
        this.$notify({
          title: '成功',
          message: '内容已成功删除',
          type: 'success',
          duration: 3000
        })
        this.fetchData()
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify({
            title: '删除失败',
            message: error.message || '删除过程中发生错误',
            type: 'error',
            duration: 5000
          })
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.limit = val
      this.fetchData()
    },
    handlePrevClick() {
      if (this.page > 1) {
        this.page--
        this.fetchData()
      }
    },
    handleNextClick() {
      this.page++
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
    padding: 20px;
}

.card-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.title {
    font-size: 18px;
    font-weight: 600;
    color: #344767;
    position: relative;
    padding-left: 12px;
    display: inline-block;
    margin-bottom: 10px;
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

.add-button {
    margin-left: auto;
    margin-bottom: 10px;
}

.pagination {
    margin-top: 20px;
    overflow-x: auto;
    white-space: nowrap;
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.pagination::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

.dialog-content {
    padding: 10px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #344767;
}

.required {
    color: #f56c6c;
    margin-left: 4px;
}

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
}

.has-error .el-input__inner {
    border-color: #f56c6c;
}

.title-link {
    color: #409eff;
    text-decoration: none;
    font-weight: 500;
    word-break: break-word;
}

.title-link:hover {
    text-decoration: underline;
}

/* Dialog Styling */
::v-deep .el-dialog {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
    margin: 0 auto !important;
    max-width: 90%;
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
    display: block;
}

::v-deep .el-form--label-top .el-form-item__label {
    padding: 0 0 8px 0;
    line-height: 1.5;
}

::v-deep .el-form-item.is-error .el-input__inner {
    border-color: #f56c6c;
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

/* Pagination Styling */
::v-deep .el-pagination {
    padding: 0;
    font-weight: normal;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

::v-deep .el-pagination .el-select .el-input {
    width: 110px;
}

::v-deep .el-pagination .el-select .el-input .el-input__inner {
    height: 28px;
    line-height: 28px;
    padding-right: 25px;
    padding-left: 10px;
}

::v-deep .el-pagination button {
    min-width: 28px;
    height: 28px;
}

::v-deep .el-pagination .el-pagination__sizes {
    margin: 0 10px 0 0;
}

/* Responsive Table */
::v-deep .el-table {
    width: 100% !important;
    overflow-x: auto;
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

::v-deep .el-table::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

::v-deep .el-table__body-wrapper {
    overflow-x: auto;
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

::v-deep .el-table__header-wrapper {
    overflow-x: auto;
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

::v-deep .el-table__header-wrapper::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

/* Media Queries */
@media (max-width: 1024px) {
    .card-container {
        width: 90%;
    }

    ::v-deep .el-form-item__label {
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }

    .card-container {
        width: 100%;
    }

    .title {
        font-size: 16px;
    }

    ::v-deep .el-table {
        font-size: 13px;
    }

    ::v-deep .el-button--small {
        padding: 7px 12px;
        font-size: 12px;
    }

    ::v-deep .el-dialog {
        width: 95% !important;
    }

    ::v-deep .el-dialog__title {
        font-size: 16px;
    }

    ::v-deep .el-dialog__body {
        padding: 15px;
    }

    ::v-deep .el-pagination {
        text-align: center;
    }
}

@media (max-width: 480px) {
    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .add-button {
        margin-left: 0;
        margin-top: 10px;
    }

    ::v-deep .el-dialog__header,
    ::v-deep .el-dialog__footer {
        padding: 15px;
    }

    ::v-deep .el-dialog__body {
        padding: 10px;
    }

    ::v-deep .el-table td,
    ::v-deep .el-table th {
        padding: 8px;
    }

    ::v-deep .el-pagination {
        margin-top: 15px;
    }

    ::v-deep .el-pagination .btn-prev,
    ::v-deep .el-pagination .btn-next {
        margin: 0 3px;
    }

    ::v-deep .el-pagination .el-pager li {
        min-width: 24px;
    }

    ::v-deep .el-input__inner,
    ::v-deep .el-select .el-input__inner {
        height: 38px;
        padding: 8px 12px;
    }
}
</style>
