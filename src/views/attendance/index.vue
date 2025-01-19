<template>
  <div class="container">
    <h1>考勤打卡</h1>
    <div v-if="this.name" class="attendance-container">
      <div class="check-in-info">
        <div v-if="this.name" style="font-size: 20px; font-weight: bold; color: #409EFF;">您是管理员无需打卡</div>
        <div v-else>
          <el-button type="primary" :disabled="isMarkedDate(selectedDate)" @click="checkIn">{{ isMarkedDate(selectedDate) ? '已打卡' : '打卡' }}</el-button>
          <el-alert v-if="message" :title="message" :type="message.includes('成功') ? 'success' : 'error'" show-icon />
          <!-- Add more check-in statistics here -->
          <p>当月打卡次数: {{ attendanceList.length }}</p>
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
      <el-alert title="请登录后进行考勤打卡。" type="warning" show-icon />
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkIn, getAttendance } from '@/api/user'
export default {
  components: {
  },
  data() {
    return {
      user: null, // This should be set to the current user object
      message: '',
      selectedDate: new Date(), // Default to today's date
      attendanceList: [],
      listLoading: false
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    this.getAttendance()
  },
  methods: {
    checkIn() {
      checkIn().then(response => {
        this.message = '打卡成功!'
        this.getAttendance()
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
        const recordDate = new Date(record.date)
        return recordDate.toDateString() === date.toDateString()
      })
    }
  },
  filters: {
    convertDate(date) {
      return new Date(date).toLocaleDateString()
    },
    keepDay(date) {
      return date.split('-')[2]
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
