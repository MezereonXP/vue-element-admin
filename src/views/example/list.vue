<template>
  <div class="app-container">
    <el-card class="main-card">
      <div slot="header" class="card-header">
        <div class="header-left">
          <span class="page-title">合同管理</span>
          <span class="page-subtitle">Contract Management</span>
        </div>
      </div>

      <!-- 使用各类信息过滤 -->
      <div v-if="isAdmin" class="filter-section">
        <div class="filter-title">筛选条件</div>
        <el-row :gutter="20">
          <el-col :span="2">
            <el-select v-model="filterStatus" placeholder="选择状态" style="width: 100%;">
              <el-option label="所有状态" value="all" />
              <el-option label="已发布" value="published" />
              <el-option label="草稿" value="draft" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input v-model="filterAuthorOrPhone" placeholder="上传者姓名或者手机号" style="width: 100%;" />
          </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="filterDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%;"
            />
          </el-col>
          <el-col :span="6">
            <el-button
              type="primary"
              icon="el-icon-search"
              class="action-button"
              @click="applyFilters"
            >应用过滤器</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          class="data-table"
          :stripe="true"
          :header-cell-style="{ background: '#f8f9fa', color: '#344767', fontWeight: '600' }"
          :cell-style="{ padding: '12px 8px' }"
        >
          <el-table-column align="center" label="编号" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="300px" label="标题">
            <template slot-scope="{row}">
              <a
                style="cursor: pointer; color: #344767; font-weight: 550; text-decoration: none;"
                @click="openEditDialog(row)"
              >{{ row.title }}</a>
            </template>
          </el-table-column>

          <el-table-column width="120px" align="center" label="上传者">
            <template slot-scope="scope">
              <span>{{ scope.row.author }}</span>
            </template>
          </el-table-column>

          <el-table-column class-name="status-col" label="状态" width="110">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter" :class="'status-tag-' + row.status">
                {{ convertStatus(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column width="180px" align="center" label="上传日期">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column width="180px" align="center" label="修改日期">
            <template slot-scope="scope">
              <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="240">
            <template slot-scope="scope">
              <el-button type="primary" plain size="small" icon="el-icon-edit" @click="openEditDialog(scope.row)">
                编辑
              </el-button>
              <el-button
                type="danger"
                plain
                size="small"
                icon="el-icon-delete-solid"
                style="margin-left: 10px;"
                @click="deleteRow(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>
    </el-card>

    <el-dialog title="合同详情" :visible.sync="editDialogVisible" width="50%" class="contract-dialog">
      <div class="dialog-content">
        <div class="dialog-body">
          <el-form :model="editDialogData" class="form-group">
            <el-form-item label="合同标题">
              <el-input v-model="editDialogData.title" placeholder="请输入合同标题" />
            </el-form-item>
            <el-form-item label="合同内容">
              <br>
              <Tinymce ref="editor" :key="editorKey" v-model="editDialogData.content" :height="400" />
              <!-- <el-input v-model="editContent" type="textarea" :rows="20" /> -->
            </el-form-item>
            <el-form-item label="合同状态">
              <el-select
                v-model="editDialogData.status"
                placeholder="选择状态"
                style="width: 20%; display: inline-block; margin-bottom: 10px;"
              >
                <el-option label="已发布" value="published" />
                <el-option label="草稿" value="draft" />
              </el-select>
            </el-form-item>
            <el-form-item label="合同图片">
              <Upload v-model="editDialogData.image_uri" />
            </el-form-item>
          </el-form>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEditDialog">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, deleteItem, searchItem, updateItem, fetchItem } from '@/api/item'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import moment from 'moment'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'

export default {
  name: 'ArticleList',
  components: { Pagination, Tinymce, Upload },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      isAdmin: false,
      search: '',
      filterStatus: '',
      filterAuthorOrPhone: '',
      filterDateRange: '',
      editDialogVisible: false,
      editorKey: 0,
      editDialogData: {
        id: '',
        title: '',
        content: '',
        status: '',
        image_uri: ''
      }
    }
  },
  created() {
    this.getList()
    this.checkAdminRole()
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'id'
    ])
  },
  watch: {
    editDialogVisible(val) {
      if (!val) {
        console.log('Dialog closing detected by watcher')
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
        if (response.code === 20000) {
          this.$message.success('获取成功')
        } else {
          this.$message.error('获取失败')
        }
      })
    },
    checkAdminRole() {
      // Check if the user has the 'admin' role
      if (this.roles !== undefined) {
        this.isAdmin = this.roles.includes('admin')
        console.log(this.roles)
      }
    },
    deleteRow(id) {
      // Logic to delete the item by id
      // You may want to confirm the deletion before proceeding
      // Example: call an API to delete the item
      // Logic to delete the item by id
      this.$confirm('你真的要删除该项吗?', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delete_query = {
          'user_id': this.id,
          'item_id': id
        }
        // Call the API to delete the item
        deleteItem(delete_query).then(response => {
          if (response.code === 20000) {
            this.getList() // Refresh the list after deletion
            this.$message.success('项目删除成功')
          } else {
            this.$message.error('删除失败')
          }
        })
          .catch(error => {
            console.error('Error deleting item:', error)
            this.$message.error('An error occurred while deleting the item')
          })
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    applyFilters() {
      this.listLoading = true
      // 检查是否一个过滤条件都没有
      if (this.filterStatus === '' && this.filterAuthorOrPhone === '' && this.filterDateRange === '') {
        this.$message.error('请至少选择一个过滤条件')
        this.listLoading = false
        return
      }
      console.log(this.filterDateRange)
      const query = {
        'item_status': this.filterStatus,
        'query': this.filterAuthorOrPhone,
        'page': this.listQuery.page,
        'limit': this.listQuery.limit
      }
      if (this.filterDateRange !== '' && this.filterDateRange !== null && this.filterDateRange !== undefined) {
        // 将日期范围转换为YYYY-MM-DD using moment.js
        query.start_date = moment(this.filterDateRange[0]).format('YYYY-MM-DD')
        query.end_date = moment(this.filterDateRange[1]).format('YYYY-MM-DD')
      }
      searchItem(query).then(response => {
        if (response.code === 20000) {
          this.list = response.items
          this.total = response.total
          this.$message.success('获取成功')
        } else {
          this.$message.error('获取失败')
        }
        this.listLoading = false
      })
    },
    convertStatus(status) {
      const statusMap = {
        published: '已发布',
        draft: '草稿',
        deleted: '已删除'
      }
      return statusMap[status]
    },
    openEditDialog(row) {
      // Store the row ID before fetching to ensure we have it
      const rowId = row.id

      // Fetch complete item data from API
      fetchItem(rowId).then(response => {
        if (response.code === 20000) {
          // Wait for DOM update
          this.$nextTick(() => {
            console.log('Dialog visible, preparing to set data...')

            // Wait for TinyMCE to initialize
            setTimeout(() => {
              // Set all dialog data at once AFTER the editor is initialized
              this.editDialogData = {
                id: rowId,
                ...response.data
              }
              this.editDialogVisible = true
              // Use nextTick to ensure the editor is properly reinitialized after the dialog opens
              this.$nextTick(() => {
                // If there's an editor instance with setContent method, use it
                if (this.$refs.editor && typeof this.$refs.editor.setContent === 'function') {
                  this.$refs.editor.setContent(this.editDialogData.content)
                }
              })
            }, 100)
          })
        } else {
          this.$message.error('获取合同详情失败')
          this.listLoading = false
        }
      }).catch(error => {
        console.error('Error fetching item details:', error)
        this.$message.error('获取合同详情时发生错误')
        this.listLoading = false
      })
    },
    saveEditDialog() {
      console.log('Saving with content:', this.editDialogData.content)

      // Get latest content from editor if available
      if (this.$refs.editor && typeof this.$refs.editor.getContent === 'function') {
        const freshContent = this.$refs.editor.getContent()
        console.log('Fresh editor content:', freshContent)
        this.editDialogData.content = freshContent
      }

      // Logic to save the edited data
      this.listLoading = true

      // Call the API to update the item
      updateItem(this.editDialogData).then(response => {
        if (response.code === 20000) {
          this.$message({
            message: '合同更新成功',
            type: 'success',
            duration: 2000
          })

          // Close dialog first - onDialogClose will handle cleanup
          this.editDialogVisible = false

          // Refresh list data after a short delay to ensure dialog is closed
          setTimeout(() => {
            this.getList()
          }, 300)
        } else {
          this.$message.error('更新失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('Error updating item:', error)
        this.$message.error('更新过程中出现错误')
        this.listLoading = false
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
  width: 70%;
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

/* Filter Section Styling */
.filter-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #606266;
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

/* Status Tag Styling */
.status-tag-published {
  background-color: #f0f9eb;
  color: #67c23a;
  border-color: #e1f3d8;
}

.status-tag-draft {
  background-color: #f4f4f5;
  color: #909399;
  border-color: #e9e9eb;
}

.status-tag-deleted {
  background-color: #fef0f0;
  color: #f56c6c;
  border-color: #fde2e2;
}

/* Links */
.link-type {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.link-type:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* Pagination Styling */
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-tag {
  border-radius: 10px;
  text-align: center;
  font-size: 12px;
  border: 1px solid rgba(64, 158, 255, 0.1);
  font-weight: bold;
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

/* Form Input Styling */
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

/* Date Picker Icon Fix */
::v-deep .el-date-editor {
  width: 100%;
}

::v-deep .el-date-editor .el-input__prefix,
::v-deep .el-date-editor .el-input__suffix {
  display: flex;
  align-items: center;
  height: 100%;
}

::v-deep .el-date-editor .el-input__icon {
  line-height: normal;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .el-date-editor.el-input__inner {
  display: flex;
  align-items: center;
}

::v-deep .el-range-separator {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
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
  background: #fafbfd;
}

/* Dialog Content Styling */
.dialog-content {
  width: 100%;
}

.dialog-header {
  margin-bottom: 20px;
}

.dialog-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #344767;
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #344767;
  margin-bottom: 8px;
}

.form-value {
  font-size: 15px;
  color: #333;
  padding: 4px 0;
}

/* TinyMCE in dialog */
::v-deep .tinymce-container {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid #e0e5ec;
}

::v-deep .tinymce-container .tox-tinymce {
  border-radius: 8px;
  overflow: hidden;
}

::v-deep .tinymce-container .tox-toolbar__primary {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e5ec;
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

::v-deep .contract-dialog .el-dialog {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 10px 25px rgba(0, 0, 0, 0.1);
  margin: 0 auto !important;
}

/* Ensure Element UI's dialog wrapper doesn't cause positioning issues */
::v-deep .el-dialog__wrapper {
  overflow: auto !important;
}

::v-deep .el-dialog {
  margin: 0 auto !important;
}

::v-deep .contract-dialog .el-dialog__header {
  background: #f0f5ff;
  border-bottom: 1px solid #d9e5ff;
  padding: 20px 28px;
}

::v-deep .contract-dialog .el-dialog__title {
  color: #2b3b78;
  font-weight: 600;
  font-size: 18px;
  align-items: center;
}

::v-deep .contract-dialog .el-dialog__title::before {
  content: "\e791";
  font-family: element-icons !important;
  margin-right: 10px;
  color: #4776E6;
  font-size: 20px;
}

::v-deep .contract-dialog .el-dialog__body {
  padding: 28px 32px;
}

.contract-dialog .dialog-header {
  margin-bottom: 24px;
}

.contract-dialog .dialog-header h3 {
  font-size: 22px;
  font-weight: 600;
  color: #344767;
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf2f7;
}

.contract-dialog .form-group {
  margin-bottom: 0;
}

.contract-dialog .form-group label {
  font-size: 15px;
  font-weight: 500;
  color: #344767;
  margin-bottom: 10px;
}

/* Upload component styling in dialog */
.contract-dialog ::v-deep .el-upload {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px dashed #d9d9d9;
  transition: all 0.3s;
}

.contract-dialog ::v-deep .el-upload:hover {
  border-color: #4776E6;
}

.contract-dialog ::v-deep .el-input__inner,
.contract-dialog ::v-deep .el-select .el-input__inner {
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 12px 16px;
  height: 46px;
  font-size: 15px;
  transition: all 0.2s;
}

.contract-dialog ::v-deep .el-input__inner:focus,
.contract-dialog ::v-deep .el-select .el-input__inner:focus {
  border-color: #4776E6;
  box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.15);
}

/* Enhanced footer for contract dialog */
::v-deep .contract-dialog .el-dialog__footer {
  border-top: 1px solid #edf2f7;
  padding: 16px 28px;
  background: #fafbfd;
}

::v-deep .contract-dialog .dialog-footer .el-button {
  padding: 10px 24px;
  min-width: 100px;
  font-weight: 500;
  letter-spacing: 0.3px;
  border-radius: 8px;
  transition: all 0.2s;
}

::v-deep .contract-dialog .dialog-footer .el-button--primary {
  background: linear-gradient(135deg, #4776E6 0%, #3843D0 100%);
  box-shadow: 0 4px 10px rgba(56, 67, 208, 0.25);
}

::v-deep .contract-dialog .dialog-footer .el-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(56, 67, 208, 0.35);
}

::v-deep .contract-dialog .dialog-footer .el-button:not(.el-button--primary) {
  background: #f4f6f9;
  border: 1px solid #e0e5ec;
  color: #4e5d78;
}

::v-deep .contract-dialog .dialog-footer .el-button:not(.el-button--primary):hover {
  background: #ebeef5;
  color: #344767;
}
</style>
