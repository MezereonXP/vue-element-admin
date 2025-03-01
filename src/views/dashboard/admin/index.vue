<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->
    <el-row :gutter="32">
      <el-col :xs="4" :sm="4" :lg="4">
        <el-card class="stat-card">
          <div style="display: flex; justify-content: space-between; position: relative;">
            <div>
              <div style="font-size: 14px; font-weight: 500; margin-bottom: 10px;">学生数目</div>
              <div style="font-size: 28px; font-weight: bold;">{{ studentCount }}</div>
            </div>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="white" opacity="0.9">
              <path
                d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
              />
            </svg>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="4" :sm="4" :lg="4">
        <el-card class="stat-card">
          <div style="display: flex; justify-content: space-between; position: relative;">
            <div>
              <div style="font-size: 14px; font-weight: 500; margin-bottom: 10px;">实习岗位数目</div>
              <div style="font-size: 28px; font-weight: bold;">{{ internshipCount }}</div>
            </div>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="white" opacity="0.9">
              <path
                d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z"
              />
            </svg>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="4" :sm="4" :lg="4">
        <el-card class="stat-card">
          <div style="display: flex; justify-content: space-between; position: relative;">
            <div>
              <div style="font-size: 14px; font-weight: 500; margin-bottom: 10px;">上传合同数目</div>
              <div style="font-size: 28px; font-weight: bold;">{{ contractCount }}</div>
            </div>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="white" opacity="0.9">
              <path
                d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"
              />
            </svg>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="32" style="margin-top: 32px;">
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isSchoolOverviewLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">学校概况</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoSchoolOverview"> 查看更多>></el-link>
          <br>
          <br>
          <div
            v-if="isSchoolOverviewEmpty"
            style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;"
          >
            暂无数据
          </div>
          <div>
            <div v-for="item in schoolOverviewData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoSchoolIntro(item.id)">{{
                item.title }}</el-link>
              <br>
              <br>
              <span
                style="font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
                v-html="clearText(item.text)"
              />
              <br>
              <div style="overflow: hidden; margin-bottom: 8px;">
                <span
                  style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"
                >
                  最新更新：{{ formatDate(item.updated_at) }}
                </span>
              </div>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isLawLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">法律法规文件制度</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoLaw"> 查看更多>></el-link>
          <br>
          <br>
          <div v-if="isLawEmpty" style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;">
            暂无数据
          </div>
          <div>
            <div v-for="item in lawData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoLawIntro(item.id)">{{
                item.title }}</el-link>
              <br>
              <br>
              <span
                style="font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
                v-html="clearText(item.text)"
              />
              <br>
              <div style="overflow: hidden; margin-bottom: 8px;">
                <span
                  style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"
                >
                  最新更新：{{ formatDate(item.updated_at) }}
                </span>
              </div>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isApprovalLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">实习审批报备管理</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoApproval"> 查看更多>></el-link>
          <br>
          <br>
          <div v-if="isApprovalEmpty" style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;">
            暂无数据
          </div>
          <div>
            <div v-for="item in approvalData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoApprovalIntro(item.id)">{{
                item.title }}</el-link>
              <br>
              <br>
              <span
                style="font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
                v-html="clearText(item.text)"
              />
              <br>
              <div style="overflow: hidden; margin-bottom: 8px;">
                <span
                  style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"
                >
                  最新更新：{{ formatDate(item.updated_at) }}
                </span>
              </div>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="5" :sm="5" :lg="5">
        <el-card v-loading="isReportLoading" style="height: 100%;">
          <span style="font-size: 16px; font-weight: bold; display: inline-block;">企业考察报告</span>
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoReport"> 查看更多>></el-link>
          <br>
          <br>
          <div v-if="isReportEmpty" style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;">
            暂无数据
          </div>
          <div>
            <div v-for="item in reportData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoReportIntro(item.id)">{{
                item.title }}</el-link>
              <br>
              <br>
              <span
                style="font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
                v-html="clearText(item.text)"
              />
              <br>
              <div style="overflow: hidden; margin-bottom: 8px;">
                <span
                  style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"
                >
                  最新更新：{{ formatDate(item.updated_at) }}
                </span>
              </div>
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
          <el-link type="info" style="font-size: 12px; float: right;" @click="gotoInternship"> 查看更多>></el-link>
          <br>
          <br>
          <div
            v-if="isInternshipEmpty"
            style="text-align: center; vertical-align: middle; font-size: 16px; color: #999;"
          >
            暂无数据
          </div>
          <div>
            <div v-for="item in jobData" :key="item.id">
              <el-link type="primary" style="font-size: 16px; font-weight: bold;" @click="gotoJobIntro(item.id)">{{
                item.title }}</el-link>
              <span
                style="margin-top: 10px; font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
              >{{
                item.salary_description }}</span>
              <span
                style="margin-top: 10px; font-size: 12px; color: #999; white-space: pre-line; max-height: 100px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
                v-html="clearText(item.description)"
              />
              <br>
              <div style="overflow: hidden; margin-bottom: 8px;">
                <span
                  style="float: right; font-size: 12px; color: #999; text-align: right; margin-right: 20px; margin-top: 3px;"
                >
                  最新更新：{{ formatDate(item.updated_at) }}
                </span>
              </div>
              <el-divider />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="岗位详情" :visible.sync="viewDialogVisible" width="30%">
      <table
        style="width: 100%; border: 1px solid #000; border-collapse: collapse;"
        border="1"
        cellpadding="10"
        cellspacing="0"
        border-collapse="collapse"
      >
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
    // Only load critical stats immediately
    this.getStatistic()

    // Use setTimeout to delay non-critical data loading
    this.$nextTick(() => {
      setTimeout(() => {
        this.getSchoolOverviewData()

        // Stagger API calls to avoid overwhelming the browser
        setTimeout(() => { this.getLawData() }, 100)
        setTimeout(() => { this.getReportData() }, 200)
        setTimeout(() => { this.getApprovalData() }, 300)
        setTimeout(() => { this.getInternshipData() }, 400)
      }, 200)
    })
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
  background-color: #f5f7fa;
  background-image:
    radial-gradient(#e0e5ec 1px, transparent 1px),
    radial-gradient(#e0e5ec 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
  position: relative;
  min-height: calc(100vh - 100px);

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .el-row {
    margin-bottom: 28px;
    position: relative;
    z-index: 1;
  }

  .el-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    overflow: hidden;
    border: none;
    position: relative;
    background-color: rgba(255, 255, 255, 0.95);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(64, 158, 255, 0.1);
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      will-change: transform, box-shadow;

      &::before {
        opacity: 1;
      }
    }

    .el-card__body {
      padding: 24px;
    }

    span[style*="font-weight: bold"] {
      position: relative;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-size: 17px;
      color: #2c3e50;
      letter-spacing: 0.3px;
      display: inline-block;
      font-weight: 600 !important;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 30px;
        height: 3px;
        background: #409EFF;
        border-radius: 2px;
        transition: width 0.15s ease-out;
      }
    }

    &:hover span[style*="font-weight: bold"]::after {
      width: 50px;
    }
  }

  .el-link {
    transition: color 0.15s ease, transform 0.15s ease;
    font-weight: 500;

    &:hover {
      text-decoration: none;
    }

    &[type="primary"] {
      position: relative;
      display: inline-block;
      margin-bottom: 10px;
      font-weight: 600;
      color: #2c3e50;

      &:hover {
        color: #409EFF;
        transform: translateX(2px);
      }

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 1px;
        bottom: -2px;
        left: 0;
        background-color: #409EFF;
        transition: width 0.15s ease-out;
      }

      &:hover::after {
        width: 100%;
      }
    }

    &[type="info"] {
      border-radius: 20px;
      padding: 4px 12px;
      background-color: rgba(64, 158, 255, 0.05);
      font-size: 12px;
      color: #606266;
      border: 1px solid rgba(64, 158, 255, 0.1);

      &:hover {
        background-color: rgba(64, 158, 255, 0.1);
        color: #409EFF;
        transform: translateX(2px);
      }
    }
  }

  .el-divider {
    margin: 16px 0;
    opacity: 0.4;
  }

  [v-for] {
    background-color: #fff;
    border-radius: 8px;
    padding: 18px;
    margin-bottom: 16px;
    transition: transform 0.15s ease, border-left-color 0.15s ease;
    border-left: 3px solid transparent;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
    will-change: transform;
    transform: translateZ(0);

    &:hover {
      background-color: #ffffff;
      border-left-color: #409EFF;
      transform: translateX(2px);
    }

    &:last-child {
      margin-bottom: 0;
    }

    span[style*="float: right"] {
      background-color: rgba(0, 0, 0, 0.02);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      color: #909399;
      letter-spacing: 0.2px;
      border: 1px solid rgba(0, 0, 0, 0.03);
    }
  }

  .el-dialog {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    .el-dialog__header {
      background: #f9fafc;
      padding: 15px 20px;
    }

    .el-dialog__body {
      padding: 30px;
    }

    .el-dialog__footer {
      border-top: 1px solid #ebeef5;
      padding: 15px 20px;
    }

    .dialog-footer {
      .el-button {
        border-radius: 20px;
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  }

  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .stat-card {
    height: 100%;
    color: #fff;
    border-radius: 12px;
    border: none;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      z-index: 0;
    }

    &:nth-child(1) {
      background: #444444;
      border: 1px solid rgba(100, 100, 100, 0.2);
    }

    &:nth-child(2) {
      background: #3d3d3d;
      border: 1px solid rgba(100, 100, 100, 0.2);
    }

    &:nth-child(3) {
      background: #464646;
      border: 1px solid rgba(100, 100, 100, 0.2);
    }

    .el-card__body {
      padding: 24px;
      position: relative;
      z-index: 1;
    }

    svg {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.2;
      transition: transform 0.2s ease;
      z-index: 1;
      width: 55px;
      height: 55px;
    }

    &:hover {
      transform: translateY(-1px);
      will-change: transform;

      svg {
        transform: translateY(-50%) scale(1.05);
        will-change: transform;
      }
    }

    div[style*="font-size: 14px"] {
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
      font-size: 13px !important;
      opacity: 0.9;
      position: relative;
      padding-left: 12px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
        opacity: 0.7;
      }
    }

    div[style*="font-size: 28px"] {
      font-size: 32px !important;
      letter-spacing: -0.5px;
      margin-top: 8px;
      font-weight: 700 !important;
    }
  }

  .el-link[type="info"] {
    position: relative;
    overflow: hidden;

    &::before {
      content: '→';
      position: absolute;
      right: -20px;
      opacity: 0;
      transition: all 0.15s ease;
    }

    &:hover::before {
      right: 8px;
      opacity: 1;
    }

    &:hover {
      padding-right: 20px;
    }
  }
}
</style>
