<template>
  <div class="container">
    <el-button type="success" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading..." style="width: 100%;margin-top: 20px;">
      <el-table-column prop="id" label="编号" width="50" />
      <el-table-column prop="title" label="岗位名称">
        <template slot-scope="scope">
          <el-link type="primary" @click="viewPosition(scope.row)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="company_name" label="实习企业" />
      <el-table-column prop="location" label="岗位地点" />
      <el-table-column prop="salary_description" label="岗位薪资" />
      <!-- <el-table-column prop="description" label="岗位职责" /> -->
      <el-table-column prop="created_at" label="发布时间" :formatter="formatDate" sortable />
      <el-table-column prop="updated_at" label="更新时间" :formatter="formatDate" sortable />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="checkViewPermission()" type="info" icon="el-icon-view" @click="viewPosition(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      style="margin-top: 20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    />

    <el-dialog
      title="岗位详情"
      :visible.sync="viewDialogVisible"
      width="30%"
    >
      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;" border="1" cellpadding="10" cellspacing="0" border-collapse="collapse">
        <tr>
          <td style="width: 20%; font-weight: bold;">岗位名称：</td>
          <td style="width: 80%;">{{ form.title }}</td>
        </tr>
        <tr>
          <td style="width: 20%; font-weight: bold;">实习企业：</td>
          <td style="width: 80%;">{{ form.company_name }}</td>
        </tr>
        <tr>
          <td style="width: 20%; font-weight: bold;">岗位地点：</td>
          <td style="width: 80%;">{{ form.location }}</td>
        </tr>
        <tr>
          <td style="width: 20%; font-weight: bold;">岗位薪资：</td>
          <td style="width: 80%;">{{ form.salary_description }}</td>
        </tr>
        <tr>
          <td style="width: 20%; font-weight: bold;">岗位职责：</td>
          <td style="width: 80%;" v-html="form.description" />
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/job'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
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
      editDialogVisible: false
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
      this.currentPage = 1
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
      })
    },
    refresh() {
      this.getList()
    },
    checkViewPermission() {
      return true
    },
    viewPosition(row) {
      this.viewDialogVisible = true
      this.form = row
    },
    formatDate(row, column) {
      return moment(row[column.property]).utc().format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.container {
    padding: 20px;
}
</style>
