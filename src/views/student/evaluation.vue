<template>
  <div class="container">
    <h1>实习评价管理</h1>
    <el-input v-model="search_keyword" placeholder="请输入姓名或者手机号" style="width: 200px; margin-top: 20px;" />
    <el-button type="primary" icon="el-icon-search" style="margin-left: 20px;" @click="searchEvaluation">搜索</el-button>
    <el-button type="success" icon="el-icon-refresh" @click="getEvaluation">刷新</el-button>
    <el-table v-loading="listLoading" :data="userList" style="width: 80%; margin-top: 20px;" border fit highlight-current-row>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="班级">
        <template slot-scope="scope">
          <span>{{ scope.row.school_class }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实习企业">
        <template slot-scope="scope">
          <span>{{ scope.row.internship_company }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实习岗位">
        <template slot-scope="scope">
          <span>{{ scope.row.internship_position }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="填写状态">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.internship_evaluation === null ? 'red' : 'green' }">{{ scope.row.internship_evaluation === null ? '未填写' : '已填写' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" :disabled="scope.row.internship_evaluation === null" @click="handleCheck(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="dialogVisible" title="查看评价">
      <div v-html="evaluationContent" />
      <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
    </el-dialog>
  </div>

</template>

<script>
import { getUserList, searchUser } from '@/api/user'
export default {
  name: 'Evaluation',
  data() {
    return {
      dialogVisible: false,
      userList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      evaluationContent: '',
      search_keyword: '',
      listLoading: false
    }
  },
  mounted() {
    this.getEvaluation()
  },
  methods: {
    handleCheck(row) {
      this.evaluationContent = row.internship_evaluation
      this.dialogVisible = true
    },
    getEvaluation() {
      this.listLoading = true
      getUserList().then(res => {
        this.userList = this.filterAdmin(res.users)
        this.total = res.total
        this.listLoading = false
        if (res.code === 20000) {
          this.$message.success('获取数据成功')
        } else {
          this.$message.error('获取数据失败')
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getEvaluation()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getEvaluation()
    },
    filterAdmin(users) {
      return users.filter(user => user.roles.includes('user'))
    },
    searchEvaluation() {
      if (!this.search_keyword) {
        this.$message.error('请输入搜索内容')
        return
      }
      this.listLoading = true
      const query = {
        page: this.currentPage,
        limit: this.pageSize,
        query: this.search_keyword
      }
      searchUser(query).then(res => {
        this.userList = this.filterAdmin(res.users)
        this.total = res.total
        this.listLoading = false
        if (res.code === 20000) {
          this.$message.success('搜索成功')
        } else {
          this.$message.error('搜索失败')
        }
      })
    }
  }
}

</script>

<style scoped>
.container {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 20px;
    padding: 20px;
}

</style>
