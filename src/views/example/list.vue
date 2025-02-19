<template>
  <div class="app-container">

    <!-- 使用各类信息过滤 -->
    <el-row v-if="isAdmin" :gutter="20">
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
        <el-button type="primary" @click="applyFilters">应用过滤器</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%; margin-top: 20px;">
      <el-table-column align="center" label="编号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="上传者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
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
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-button type="danger" size="small" icon="el-icon-delete-solid" style="margin-left: 10px;" @click="deleteRow(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, deleteItem, searchItem } from '@/api/item'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import moment from 'moment'

export default {
  name: 'ArticleList',
  components: { Pagination },
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
      filterDateRange: ''
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
      if (this.filterDateRange !== '') {
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
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
