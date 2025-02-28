<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <span>考勤打卡</span>
      </div>
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
            <el-tag type="success" style="font-size: 16px; margin-top: 10px;">当月打卡次数: {{ getAttendanceCount()
            }}</el-tag>
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
    </el-card>
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
  max-width: 1280px;
  margin: 0 auto;
}

/* Add some basic styling */
.attendance-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
  }
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #303133;
}

.check-in-info {
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;

  @media (min-width: 768px) {
    width: 20%;
    margin-right: 20px;
    margin-bottom: 0;
  }
}

.calendar {
  flex: 1;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.el-calendar {
  height: auto;
  border: none;
  border-radius: 8px;
}

.el-calendar__body {
  padding: 12px;
}

.el-calendar-day {
  height: 40px;
  padding: 4px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  transition: all 0.3s;
}

button:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

p {
  margin-top: 10px;
  color: #606266;
}

/* New styles for the scrollable card list */
.attendance-card-list {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 20px;
  padding-right: 10px;
}

.attendance-card {
  margin-bottom: 10px;
  transition: transform 0.2s;
}

.attendance-card:hover {
  transform: translateY(-2px);
}

/* Style for marked dates */
.marked-date {
  background-color: #f0f9eb;
  border-radius: 50%;
  display: inline-block;
  width: 100%;
  height: 100%;
}

/* Admin section styles */
.el-card {
  border-radius: 8px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12) !important;
}

.el-card__header {
  padding: 18px 20px;
  font-weight: 600;
  color: #303133;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

.el-tag {
  border-radius: 4px;
  padding: 6px 10px;
  margin-right: 8px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.el-input {
  margin-bottom: 15px;
}

.el-pagination {
  text-align: right;
  padding: 20px 0;
}

/* Animation effects */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

/* Enhanced calendar styling */
.el-calendar-table .el-calendar-day {
  height: 60px;
  padding: 8px;
  transition: all 0.2s ease;
}

.el-calendar-table td {
  border: 1px solid #f2f6fc;
}

.el-calendar-table td:hover {
  background-color: #f5f7fa;
}

.el-calendar-table .is-today {
  color: #409EFF;
  font-weight: bold;
  position: relative;
}

.el-calendar-table .is-today::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #409EFF;
}

/* Improved tag styling */
.el-tag {
  font-size: 12px !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  border: none;
  padding: 8px 12px;
  transition: all 0.3s;
}

.el-tag.el-tag--success {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.el-tag.el-tag--danger {
  background-color: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.09);
}

/* Enhanced buttons - refined */
.el-button {
  font-weight: 500;
  letter-spacing: 0.3px;
  padding: 10px 20px;
  transition: all 0.25s ease;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.el-button--primary {
  background-color: #409EFF;
  border-color: #409EFF;
  color: white;
}

.el-button--primary:hover,
.el-button--primary:focus {
  background-color: #66b1ff;
  border-color: #66b1ff;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
}

.el-button--primary.is-plain {
  background-color: #ecf5ff;
  border-color: #b3d8ff;
  color: #409EFF;
}

.el-button--primary.is-plain:hover,
.el-button--primary.is-plain:focus {
  background-color: #409EFF;
  border-color: #409EFF;
  color: white;
}

.el-button--danger {
  background-color: #F56C6C;
  border-color: #F56C6C;
  color: white;
}

.el-button--danger:hover,
.el-button--danger:focus {
  background-color: #f78989;
  border-color: #f78989;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 108, 108, 0.2);
}

.el-button--danger.is-plain {
  background-color: #fef0f0;
  border-color: #fbc4c4;
  color: #F56C6C;
}

.el-button--danger.is-plain:hover,
.el-button--danger.is-plain:focus {
  background-color: #F56C6C;
  border-color: #F56C6C;
  color: white;
}

.el-button--default {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
}

.el-button--default:hover,
.el-button--default:focus {
  background-color: #f6f6f6;
  border-color: #c6e2ff;
  color: #409EFF;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.el-button [class*="el-icon-"]+span {
  margin-left: 6px;
}

/* Add subtle click effect */
.el-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}

/* Disabled state */
.el-button.is-disabled,
.el-button.is-disabled:hover {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Enhanced card styling */
.el-card {
  overflow: visible;
  background: linear-gradient(to bottom, #ffffff, #fcfcfc);
}

.el-card__header {
  background: linear-gradient(to right, #f8f9fa, #f2f6fc);
  border-bottom: 1px solid rgba(235, 238, 245, 0.8);
  padding: 18px 24px;
}

.el-card__header span {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #303133;
  position: relative;
  padding-left: 10px;
}

.el-card__header span::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: #409EFF;
  border-radius: 2px;
}

/* Improved table styling */
.el-table {
  --el-table-border: 1px solid #ebeef5;
  --el-table-header-background: #f5f7fa;
  --el-table-row-hover-background: #f5f7fa;
}

.el-table th {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
  padding: 12px 0;
}

.el-table tr {
  transition: all 0.3s;
}

.el-table tr:hover>td {
  background-color: rgba(64, 158, 255, 0.05) !important;
}

/* Pagination enhancements */
.el-pagination {
  padding: 20px 0;
  text-align: right;
}

.el-pagination button,
.el-pagination .el-pager li {
  background-color: #f5f7fa;
  border-radius: 4px;
  margin: 0 3px;
  transition: all 0.2s;
}

.el-pagination .el-pager li.active,
.el-pagination button:hover,
.el-pagination .el-pager li:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Responsive enhancement */
@media (max-width: 767px) {
  .check-in-info {
    width: 100%;
    margin-bottom: 20px;
    padding: 15px;
  }

  .el-calendar-table .el-calendar-day {
    height: 40px;
    padding: 2px;
  }

  .el-tag {
    padding: 5px 8px;
  }
}

/* Add nice fade and slide animations */
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.attendance-container {
  animation: slideInUp 0.5s ease-out;
}

.check-in-info {
  animation: fadeIn 0.5s ease-out 0.1s both;
}

.calendar {
  animation: fadeIn 0.5s ease-out 0.2s both;
}

/* Focus style improvements */
.el-input__inner:focus {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* Additional section headers */
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  color: #303133;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #409EFF, #53a8ff);
  border-radius: 3px;
}
</style>
