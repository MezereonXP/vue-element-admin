<template>
  <div class="container">
    <h1>考勤打卡</h1>
    <div v-if="!isAdmin" class="attendance-container">
      <div class="check-in-info">
        <!-- <div v-if="isAdmin" style="font-size: 20px; font-weight: bold; color: #409EFF;">您是管理员无需打卡</div> -->
        <div>
          <!-- <el-button v-if="isToday(selectedDate)" type="primary" :disabled="isMarkedDate(selectedDate)" @click="checkIn">{{ isMarkedDate(selectedDate) ? '已打卡' : '打卡' }}</el-button>

          <el-alert v-if="message" :title="message" :type="message.includes('成功') ? 'success' : 'error'" show-icon /> -->
          <el-tag v-if="isMarkedDate(new Date())" type="success" style="font-size: 16px; margin-top: 10px;">
            今日已打卡</el-tag>
          <el-tag v-else type="danger" style="font-size: 16px; margin-top: 10px;"> 今日未打卡</el-tag>
          <!-- Add more check-in statistics here -->
          <br>
          <el-tag type="success" style="font-size: 16px; margin-top: 10px;">当月打卡次数: {{ getAttendanceCount() }}</el-tag>
        </div>
        <!-- <el-button type="primary" @click="checkIn" :disabled="isMarkedDate(selectedDate)">{{ isMarkedDate(selectedDate) ? '已打卡' : '打卡' }}</el-button> -->
      </div>
      <div class="calendar">
        <el-calendar v-model="selectedDate">
          <template #dateCell="{ date, data }">
            <div>
              {{ data.day | keepDay }}
              <!-- {{ isMarkedDate(date) ? '已打卡' : '' }} -->
              <el-tag v-if="isMarkedDate(date)" type="success">已打卡</el-tag>

            </div>
          </template>
        </el-calendar>
      </div>
    </div>
    <div v-else>
      <!-- <el-alert title="您是管理员无需打卡" type="info" show-icon /> -->
      <el-input v-model="phoneNumber" placeholder="请输入学生手机号" style="width: 200px; margin-right: 10px;" />
      <el-button type="primary" plain icon="el-icon-check" @click="checkIn">打卡</el-button>

      <!-- 最近打卡记录 -->
      <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">最近打卡记录</p>
      <el-table :data="recentAttendanceList" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="phone_number" label="学生手机号" />
        <el-table-column prop="user_name" label="学生姓名" />
        <el-table-column prop="check_in_time" label="打卡时间" :formatter="formatDate" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row)">撤销打卡</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="limit"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        style="margin-top: 20px;"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkIn, getAttendance, getRecentAttendance, deleteRecentAttendance } from '@/api/user'
import moment from 'moment'

export default {
  components: {
  },

  filters: {
    convertDate(date) {
      return new Date(date).toLocaleDateString()
    },
    keepDay(date) {
      return date.split('-')[2]
    }
  },
  data() {
    return {
      user: null, // This should be set to the current user object
      message: '',
      selectedDate: new Date(), // Default to today's date
      attendanceList: [],
      recentAttendanceList: [],
      listLoading: false,
      isAdmin: false,
      phoneNumber: '',
      page: 1,
      limit: 10,
      total: 0
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  created() {
    this.isAdmin = this.roles.includes('admin')
    this.getAttendance()
    if (this.isAdmin) {
      this.getRecentAttendanceList()
    }
  },
  methods: {
    checkIn() {
      checkIn(this.phoneNumber).then(response => {
        this.message = '打卡成功!'
        this.getRecentAttendanceList()
      }).catch(error => {
        console.error('Error during check-in:', error)
        this.message = '打卡失败.请重试.'
      })
    },
    getAttendance() {
      this.listLoading = true
      const query = {
        month: this.selectedDate.getMonth() + 1,
        year: this.selectedDate.getFullYear()
      }
      getAttendance(query).then(response => {
        this.attendanceList = response.data
        this.listLoading = false
      }).catch(error => {
        console.error('Error fetching attendance:', error)
        this.listLoading = false
      })
    },
    isMarkedDate(date) {
      return this.attendanceList.some(record => {
        const recordDate = moment(record.check_in_time).utc().format('YYYY-MM-DD')
        return recordDate === moment(date).utc().format('YYYY-MM-DD')
      })
    },
    isToday(date) {
      return date.toDateString() === new Date().toDateString()
    },
    getAttendanceCount() {
      const set = new Set()
      for (const record of this.attendanceList) {
        set.add(new Date(record.check_in_time).toDateString())
      }
      return set.size
    },
    getRecentAttendanceList() {
      this.listLoading = true
      const query = {
        page: this.page,
        limit: this.limit
      }
      getRecentAttendance(query).then(response => {
        this.recentAttendanceList = response.data
        this.total = response.total
        this.page = response.page
        this.limit = response.limit
        this.listLoading = false
      }).catch(error => {
        console.error('Error fetching recent attendance:', error)
        this.listLoading = false
      })
    },
    handlePageChange(page) {
      this.page = page
      this.getRecentAttendanceList()
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRecentAttendance(row.id).then(response => {
          this.getRecentAttendanceList()
          this.$notify.success('删除成功')
        }).catch(error => {
          console.log(error)
          this.$notify.error('删除失败')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    formatDate(row, column) {
      return moment(row.check_in_time).utc().format('YYYY-MM-DD HH:mm:ss')
    },
    handleSizeChange(size) {
      this.limit = size
      this.getRecentAttendanceList()
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}

/* Add some basic styling */
.attendance-container {
  display: flex;
  align-items: left;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.check-in-info {
  width: 10%;
}

.calendar {
  flex: 1;
}

.el-calendar {
  height: auto;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
}

p {
  margin-top: 10px;
}

/* New styles for the scrollable card list */
.attendance-card-list {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 20px;
}

.attendance-card {
  margin-bottom: 10px;
}

/* Style for marked dates */
.marked-date {
  background-color: #f0f9eb;
  border-radius: 50%;
  display: inline-block;
  width: 100%;
  height: 100%;
}
</style>
