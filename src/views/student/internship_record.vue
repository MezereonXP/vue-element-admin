<template>
  <div class="internship-record-container">
    <el-button type="primary" icon="el-icon-plus" @click="handleCreate">创建实习记录</el-button>
    <el-input v-model="search" placeholder="请输入手机号/姓名/公司名称/岗位" style="width: 300px; margin-left: 20px;" />
    <el-button type="primary" icon="el-icon-search" style="margin-left: 20px;" @click="handleSearch">搜索</el-button>

    <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="phone_number" label="手机号" />
      <el-table-column prop="salary" label="工资" />
      <el-table-column prop="position" label="岗位" />
      <el-table-column prop="company_name" label="公司名称" />
      <el-table-column prop="location" label="地点" />
      <el-table-column prop="work_hours" label="实习时长" />
      <el-table-column prop="description" label="备注" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      style="margin-top: 20px;"
      @current-change="handleCurrentChange"
    />
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="手机号">
          <el-input v-model="form.phone_number" />
        </el-form-item>
        <el-form-item label="工资">
          <el-input v-model="form.salary" />
        </el-form-item>
        <el-form-item label="岗位">
          <el-input v-model="form.position" />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="form.company_name" />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="实习时长">
          <el-input v-model="form.work_hours" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.start_date" type="datetime" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.end_date" type="datetime" placeholder="选择结束时间" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.description" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
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
      search: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList({
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(response => {
        this.tableData = response.data
        this.total = response.total
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
      console.log(this.search)
      searchInternshipRecord(this.search).then(response => {
        this.tableData = response.data
        this.total = response.total
      })
    }
  }
}
</script>

<style scoped>
.internship-record-container {
    padding: 20px;
}
</style>
