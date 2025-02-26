<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->
    <el-row :gutter="32">
      <el-col :xs="4" :sm="4" :lg="4">
        <el-card style="height: 100%; color: #000; background-color: #adb5bd; border-radius: 10px; border-color: #343a40; border-width: 2px;">
          <div style="display: flex; justify-content: space-between;">
            <img src="@/assets/student.png" style="width: 50px; height: 50px;">
            <span style="font-size: 22px; font-weight: bold; float: left; margin-right: 16px; margin-top: 14px;">学生数目</span>
            <span style="font-size: 22px; font-weight: bold; float: right; margin-top: 14px; margin-right: 16px;">{{ studentCount }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="4" :sm="4" :lg="4">
        <el-card style="height: 100%; color: #000; background-color: #adb5bd; border-radius: 10px; border-color: #343a40; border-width: 2px;">
          <div style="display: flex; justify-content: space-between;">
            <img src="@/assets/job.png" style="width: 50px; height: 50px;">
            <span style="font-size: 22px; font-weight: bold; float: left; margin-right: 16px; margin-top: 14px;">实习岗位数目</span>
            <span style="font-size: 22px; font-weight: bold; float: right; margin-top: 14px; margin-right: 16px;">{{ internshipCount }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="4" :sm="4" :lg="4">
        <el-card style="height: 100%; color: #000; background-color: #adb5bd; border-radius: 10px; border-color: #343a40; border-width: 2px;">
          <div style="display: flex; justify-content: space-between;">
            <img src="@/assets/contract.png" style="width: 50px; height: 50px;">
            <span style="font-size: 22px; font-weight: bold; float: left; margin-right: 16px; margin-top: 14px;">上传合同数目</span>
            <span style="font-size: 22px; font-weight: bold; float: right; margin-top: 14px; margin-right: 16px;">{{ contractCount }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="32" style="margin-top: 32px;">
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isSchoolOverviewLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">学校概况</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoSchoolOverview">  查看更多>></el-link>
          <br>
          <br>
          <div v-if="isSchoolOverviewEmpty" style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;">
            暂无数据
          </div>
          <div>
            <div v-for="item in schoolOverviewData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoSchoolIntro(item.id)">{{ item.title }}</el-link>
              <br>
              <br>
              <span style="font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;" v-html="clearText(item.text)" />
              <br>
              <span style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"> 最新更新：{{ formatDate(item.updated_at) }}</span>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isLawLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">法律法规文件制度</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoLaw">  查看更多>></el-link>
          <br>
          <br>
          <div v-if="isLawEmpty" style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;">
            暂无数据
          </div>
          <div>
            <div v-for="item in lawData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoLawIntro(item.id)">{{ item.title }}</el-link>
              <br>
              <br>
              <span style="font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;" v-html="clearText(item.text)" />
              <br>
              <span style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"> 最新更新：{{ formatDate(item.updated_at) }}</span>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isApprovalLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">实习审批报备管理</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoApproval">  查看更多>></el-link>
          <br>
          <br>
          <div v-if="isApprovalEmpty" style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;">
            暂无数据
          </div>
          <div>
            <div v-for="item in approvalData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoApprovalIntro(item.id)">{{ item.title }}</el-link>
              <br>
              <br>
              <span style="font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;" v-html="clearText(item.text)" />
              <br>
              <span style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"> 最新更新：{{ formatDate(item.updated_at) }}</span>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isReportLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">企业考察报告</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoReport">  查看更多>></el-link>
          <br>
          <br>
          <div v-if="isReportEmpty" style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;">
            暂无数据
          </div>
          <div>
            <div v-for="item in reportData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoReportIntro(item.id)">{{ item.title }}</el-link>
              <br>
              <br>
              <span style="font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;" v-html="clearText(item.text)" />
              <br>
              <span style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"> 最新更新：{{ formatDate(item.updated_at) }}</span>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 32px;">
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isInternshipLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">实习岗位</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoInternship">  查看更多>></el-link>
          <br>
          <br>
          <div v-if="isInternshipEmpty" style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;">
            暂无数据
          </div>
          <div>
            <div v-for="item in jobData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoJobIntro(item.id)">{{ item.title }}</el-link>
              <span style="margin-top: 10px; font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">{{ item.salary_description }}</span>
              <span style="margin-top: 10px; font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;" v-html="clearText(item.description)" />
              <br>
              <span style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"> 最新更新：{{ formatDate(item.updated_at) }}</span>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

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
import { fetchText } from '@/api/text'
import { fetchList } from '@/api/job'
import { getStatistic } from '@/api/statistic'
import moment from 'moment'
export default {
  name: 'DashboardAdmin',

  data() {
    return {
      schoolOverviewData: [],
      internshipData: [],
      lawData: [],
      approvalData: [],
      reportData: [],
      jobData: [],
      isSchoolOverviewEmpty: false,
      isLawEmpty: false,
      isApprovalEmpty: false,
      isReportEmpty: false,
      isInternshipEmpty: false,
      isSchoolOverviewLoading: false,
      isLawLoading: false,
      isApprovalLoading: false,
      isReportLoading: false,
      isInternshipLoading: false,
      viewDialogVisible: false,
      form: {},
      studentCount: 0,
      internshipCount: 0,
      contractCount: 0
    }
  },
  created() {
    this.getSchoolOverviewData()
    this.getLawData()
    this.getReportData()
    this.getApprovalData()
    this.getInternshipData()
    this.getStatistic()
  },
  methods: {
    getSchoolOverviewData() {
      this.isSchoolOverviewLoading = true
      fetchText(1, 5, 1).then(response => {
        this.schoolOverviewData = response.texts
        if (this.schoolOverviewData.length > 2) {
          this.schoolOverviewData = this.schoolOverviewData.slice(0, 2)
        }
        this.isSchoolOverviewEmpty = (this.schoolOverviewData.length === 0)
        this.isSchoolOverviewLoading = false
      })
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    gotoSchoolOverview() {
      this.$router.push('/intro')
    },
    gotoSchoolIntro(id) {
      this.$router.push(`/intro/detail/${id}`)
    },
    getLawData() {
      this.isLawLoading = true
      fetchText(1, 5, 2).then(response => {
        this.lawData = response.texts
        if (this.lawData.length > 2) {
          this.lawData = this.lawData.slice(0, 2)
        }
        this.isLawEmpty = (this.lawData.length === 0)
        this.isLawLoading = false
      })
    },
    gotoLaw() {
      this.$router.push('/law')
    },
    gotoLawIntro(id) {
      this.$router.push(`/law/detail/${id}`)
    },
    clearText(text) {
      text = text.replace(/<[^>]*>?/g, '')
      text = text.replace(/&nbsp;/g, '')
      text = text.replace(/&lt;/g, '<')
      text = text.replace(/&gt;/g, '>')
      text = text.replace(/&quot;/g, '"')
      text = text.replace(/&apos;/g, "'")
      text = text.replace(/&amp;/g, '&')
      text = text.replace(/<br>/g, '')
      text = text.replace(/<p>/g, '')
      text = text.replace(/<\/p>/g, '')
      text = text.replace(/\n/g, '')
      text = text.replace(/<br \/>/g, '')
      text = text.replace(/<a href="[^"]*">/g, '')
      text = text.replace(/<\/a>/g, '')
      return text
    },
    getApprovalData() {
      this.isApprovalLoading = true
      fetchText(1, 5, 4).then(response => {
        this.approvalData = response.texts
        if (this.approvalData.length > 2) {
          this.approvalData = this.approvalData.slice(0, 2)
        }
        this.isApprovalEmpty = (this.approvalData.length === 0)
        this.isApprovalLoading = false
      })
    },
    getReportData() {
      this.isReportLoading = true
      fetchText(1, 5, 5).then(response => {
        this.reportData = response.texts
        if (this.reportData.length > 2) {
          this.reportData = this.reportData.slice(0, 2)
        }
        this.isReportEmpty = (this.reportData.length === 0)
        this.isReportLoading = false
      })
    },
    gotoApproval() {
      this.$router.push('/approval')
    },
    gotoApprovalIntro(id) {
      this.$router.push(`/approval/detail/${id}`)
    },
    gotoReport() {
      this.$router.push('/report')
    },
    gotoReportIntro(id) {
      this.$router.push(`/report/detail/${id}`)
    },
    getInternshipData() {
      this.isInternshipLoading = true
      const query = {
        page: 1,
        limit: 5
      }
      fetchList(query).then(response => {
        this.jobData = response.jobs
        this.isInternshipEmpty = (this.jobData.length === 0)
        this.isInternshipLoading = false
      })
    },
    gotoInternship() {
      this.$router.push('/position')
    },
    gotoJobIntro(id) {
      this.viewDialogVisible = true
      this.form = this.jobData.find(item => item.id === id)
    },
    getStatistic() {
      getStatistic().then(response => {
        this.studentCount = response.data.user_count
        this.internshipCount = response.data.job_count
        this.contractCount = response.data.item_count
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  .el-list-item {
    border-bottom: 1px solid #e6e6e6;
    padding: 10px 0;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

}
</style>
