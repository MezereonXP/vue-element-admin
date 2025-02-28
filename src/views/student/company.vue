<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <span>实习企业信息管理</span>
      </div>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleCreate">添加企业</el-button>
      <el-table v-loading="loading" :data="tableData" style="width: 100%; margin-top: 20px;" border>
        <el-table-column prop="logo" label="企业logo" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt="企业logo" style="width: auto; height: 40px;">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="企业名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="企业地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone_number" label="联系电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone_number }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="established_date" label="建立日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.established_date ? new Date(scope.row.established_date).toLocaleDateString() : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              plain
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="info"
              icon="el-icon-view"
              size="small"
              plain
              @click="handlePreview(scope.row)"
            >预览</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              plain
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
        <el-form :model="dialogForm" label-width="80px">
          <el-form-item label="企业logo">
            <Upload v-model="dialogForm.logo" />
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input v-model="dialogForm.name" />
          </el-form-item>
          <el-form-item label="企业地址">
            <el-input v-model="dialogForm.address" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="dialogForm.phone_number" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="dialogForm.email" />
          </el-form-item>
          <el-form-item label="企业简介">
            <Tinymce ref="editor" v-model="dialogForm.introduction" :height="400" />
          </el-form-item>
          <el-form-item label="企业网址">
            <el-input v-model="dialogForm.website" />
          </el-form-item>
          <el-form-item label="建立日期">
            <el-date-picker v-model="dialogForm.established_date" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">{{ dialogType === 'create' ? '创建' : '保存' }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog title="简介预览" :visible.sync="previewVisible" width="50%">
        <div
          style="height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;margin-top: -20px;"
          v-html="dialogForm.introduction"
        />
        <el-button type="primary" style="margin-top: 10px;" @click="previewVisible = false">关闭</el-button>
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
.container {
  padding: 20px;
}
</style>
