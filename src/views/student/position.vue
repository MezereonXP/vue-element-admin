<template>
  <div class="app-container">
    <el-card class="main-card">
      <div slot="header" class="card-header">
        <div class="header-left">
          <span class="page-title">实习岗位管理</span>
          <span class="page-subtitle">Internship Position Management</span>
        </div>
        <div class="header-right">
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="action-button"
            @click="showAddPositionDialog"
          >新增岗位</el-button>
          <el-button type="info" class="action-button refresh-button" @click="refresh">
            <i :class="['el-icon-refresh', { 'is-refreshing': isRefreshing }]" /> 刷新
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading..."
          border
          fit
          highlight-current-row
          class="data-table"
          :header-cell-style="{ background: '#f8f9fa', color: '#344767', fontWeight: '600' }"
          :cell-style="{ padding: '12px 8px' }"
        >
          <el-table-column prop="id" label="编号" width="70" align="center" />
          <el-table-column prop="title" label="岗位名称" min-width="120" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click="viewPosition(scope.row)">{{ scope.row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="company_name" label="实习企业" min-width="120" align="center" />
          <el-table-column prop="location" label="岗位地点" max-width="120" align="center" />
          <el-table-column prop="salary_description" label="岗位薪资" max-width="100" align="center" />
          <!-- <el-table-column prop="created_at" label="发布时间" :formatter="formatDate" sortable align="center" /> -->
          <el-table-column
            prop="updated_at"
            label="更新时间"
            :formatter="formatDate"
            sortable
            align="center"
            min-width="100"
            max-width="100"
          />
          <el-table-column label="操作" align="center" min-width="180">
            <template slot-scope="scope">
              <el-button
                v-if="checkEditPermission()"
                type="primary"
                plain
                size="small"
                icon="el-icon-edit"
                @click="editPosition(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="checkDeletePermission()"
                type="danger"
                plain
                size="small"
                icon="el-icon-delete"
                @click="deletePosition(scope.row)"
              >删除</el-button>
              <el-button
                v-if="checkViewPermission()"
                type="info"
                plain
                size="small"
                icon="el-icon-view"
                @click="viewPosition(scope.row)"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
      />

      <el-dialog title="新增岗位" :visible.sync="dialogVisible" width="50%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="岗位名称">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="实习企业">
            <el-input v-model="form.company_name" />
          </el-form-item>
          <el-form-item label="岗位地点">
            <el-input v-model="form.location" />
          </el-form-item>
          <el-form-item label="岗位薪资">
            <el-input v-model="form.salary_description" />
          </el-form-item>
          <el-form-item label="岗位职责">
            <Tinymce ref="editor" v-model="form.description" :height="400" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addPosition">确定</el-button>
        </div>
      </el-dialog>

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

      <el-dialog title="编辑岗位" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="岗位名称">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="实习企业">
            <el-input v-model="form.company_name" />
          </el-form-item>
          <el-form-item label="岗位地点">
            <el-input v-model="form.location" />
          </el-form-item>
          <el-form-item label="岗位薪资">
            <el-input v-model="form.salary_description" />
          </el-form-item>
          <el-form-item label="岗位职责">
            <Tinymce ref="editor" v-model="form.description" :height="400" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updatePosition">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { fetchList, createJob, updateJob, deleteJob } from '@/api/job'
import Tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  components: {
    Tinymce
  },
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
      this.isRefreshing = true
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
        if (response.code === 20000) {
          this.$message.success('刷新成功')
        }
      }).finally(() => {
        setTimeout(() => {
          this.isRefreshing = false
        }, 500)
      })
    },
    showAddPositionDialog() {
      this.dialogVisible = true
    },
    addPosition() {
      this.dialogVisible = false
      createJob(this.form).then(response => {
        this.$message.success('新增岗位成功')
        this.getList()
      })
    },
    refresh() {
      this.getList()
    },
    checkEditPermission() {
      return this.roles.includes('admin')
    },
    checkDeletePermission() {
      return this.roles.includes('admin')
    },
    checkViewPermission() {
      return true
    },
    editPosition(row) {
      this.editDialogVisible = true
      this.form = row
    },
    deletePosition(row) {
      this.$confirm('确定删除该岗位吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteJob(row.id).then(response => {
          this.$message.success('删除岗位成功')
          this.getList()
        }).catch(() => {
          this.$message.error('删除岗位失败')
        })
      })
    },
    viewPosition(row) {
      this.viewDialogVisible = true
      this.form = row
    },
    updatePosition() {
      this.editDialogVisible = false
      updateJob(this.form).then(response => {
        this.$message.success('更新岗位成功')
        this.getList()
      }).catch(() => {
        this.$message.error('更新岗位失败')
      })
    },
    formatDate(row, column) {
      return moment(row[column.property]).utc().format('YYYY-MM-DD HH:mm')
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

/* El-link styling */
.el-link {
  font-weight: 500;
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
}

.detail-item:last-child {
  border-bottom: none;
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
