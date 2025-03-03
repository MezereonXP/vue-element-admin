<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in statCards"
        :key="index"
        :xs="24"
        :sm="8"
        :md="8"
        :lg="8"
        :xl="8"
        class="stat-card-col"
      >
        <el-card class="stat-card" :class="`stat-card-${index}`">
          <div class="stat-card-content">
            <div class="stat-info">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value }}</div>
            </div>
            <div class="stat-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="white" opacity="0.9">
                <path :d="item.icon" />
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="dashboard-content">
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="content-col">
        <el-card class="content-card">
          <div class="card-header">
            <span class="card-title">学校概况</span>
            <el-link :underline="false" type="info" class="view-more" @click="gotoSchoolOverview">查看更多</el-link>
          </div>
          <div v-if="isSchoolOverviewLoading" class="skeleton-container">
            <div v-for="i in 2" :key="'school-skeleton-' + i" class="skeleton-item">
              <div class="skeleton-title" />
              <div class="skeleton-text" />
              <div class="skeleton-text" />
              <div class="skeleton-date" />
            </div>
          </div>
          <div v-else-if="isSchoolOverviewEmpty" class="empty-data">
            暂无数据
          </div>
          <div v-else class="card-content">
            <div v-for="item in schoolOverviewData" :key="item.id" class="card-item">
              <el-link :underline="false" type="primary" class="item-title" @click="gotoSchoolIntro(item.id)">{{
                item.title }}</el-link>
              <div class="item-content" v-html="clearText(item.text)" />
              <div class="item-footer">
                <span class="update-time">最新更新：{{ formatDate(item.updated_at) }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="content-col">
        <el-card class="content-card">
          <div class="card-header">
            <span class="card-title">法律法规文件制度</span>
            <el-link :underline="false" type="info" class="view-more" @click="gotoLaw">查看更多</el-link>
          </div>
          <div v-if="isLawLoading" class="skeleton-container">
            <div v-for="i in 2" :key="'law-skeleton-' + i" class="skeleton-item">
              <div class="skeleton-title" />
              <div class="skeleton-text" />
              <div class="skeleton-text" />
              <div class="skeleton-date" />
            </div>
          </div>
          <div v-else-if="isLawEmpty" class="empty-data">
            暂无数据
          </div>
          <div v-else class="card-content">
            <div v-for="item in lawData" :key="item.id" class="card-item">
              <el-link :underline="false" type="primary" class="item-title" @click="gotoLawIntro(item.id)">{{
                item.title }}</el-link>
              <div class="item-content" v-html="clearText(item.text)" />
              <div class="item-footer">
                <span class="update-time">最新更新：{{ formatDate(item.updated_at) }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="content-col">
        <el-card class="content-card">
          <div class="card-header">
            <span class="card-title">实习审批报备管理</span>
            <el-link :underline="false" type="info" class="view-more" @click="gotoApproval">查看更多</el-link>
          </div>
          <div v-if="isApprovalLoading" class="skeleton-container">
            <div v-for="i in 2" :key="'approval-skeleton-' + i" class="skeleton-item">
              <div class="skeleton-title" />
              <div class="skeleton-text" />
              <div class="skeleton-text" />
              <div class="skeleton-date" />
            </div>
          </div>
          <div v-else-if="isApprovalEmpty" class="empty-data">
            暂无数据
          </div>
          <div v-else class="card-content">
            <div v-for="item in approvalData" :key="item.id" class="card-item">
              <el-link :underline="false" type="primary" class="item-title" @click="gotoApprovalIntro(item.id)">{{
                item.title }}</el-link>
              <div class="item-content" v-html="clearText(item.text)" />
              <div class="item-footer">
                <span class="update-time">最新更新：{{ formatDate(item.updated_at) }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" class="content-col">
        <el-card class="content-card">
          <div class="card-header">
            <span class="card-title">企业考察报告</span>
            <el-link :underline="false" type="info" class="view-more" @click="gotoReport">查看更多</el-link>
          </div>
          <div v-if="isReportLoading" class="skeleton-container">
            <div v-for="i in 2" :key="'report-skeleton-' + i" class="skeleton-item">
              <div class="skeleton-title" />
              <div class="skeleton-text" />
              <div class="skeleton-text" />
              <div class="skeleton-date" />
            </div>
          </div>
          <div v-else-if="isReportEmpty" class="empty-data">
            暂无数据
          </div>
          <div v-else class="card-content">
            <div v-for="item in reportData" :key="item.id" class="card-item">
              <el-link :underline="false" type="primary" class="item-title" @click="gotoReportIntro(item.id)">{{
                item.title }}</el-link>
              <div class="item-content" v-html="clearText(item.text)" />
              <div class="item-footer">
                <span class="update-time">最新更新：{{ formatDate(item.updated_at) }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="dashboard-content">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="content-col">
        <el-card class="content-card">
          <div class="card-header">
            <span class="card-title">实习岗位</span>
            <el-link :underline="false" type="info" class="view-more" @click="gotoInternship">查看更多</el-link>
          </div>
          <div v-if="isInternshipLoading" class="skeleton-container">
            <div v-for="i in 2" :key="'internship-skeleton-' + i" class="skeleton-item">
              <div class="skeleton-title" />
              <div class="skeleton-text" />
              <div class="skeleton-text" />
              <div class="skeleton-text" />
              <div class="skeleton-date" />
            </div>
          </div>
          <div v-else-if="isInternshipEmpty" class="empty-data">
            暂无数据
          </div>
          <div v-else class="card-content">
            <el-row :gutter="20">
              <el-col v-for="item in jobData" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="job-col">
                <div class="job-item">
                  <el-link :underline="false" type="primary" class="item-title" @click="toggleJobDetails(item.id)">{{
                    item.title }}</el-link>
                  <div class="job-salary">{{ item.salary_description }}</div>
                  <div class="item-content" v-html="clearText(item.description)" />
                  <div class="item-footer">
                    <span class="update-time">最新更新：{{ formatDate(item.updated_at) }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- Job Details Card -->
            <el-collapse-transition>
              <div v-if="selectedJobId !== null" class="job-details-card">
                <div class="job-details-header">
                  <h3>岗位详情</h3>
                  <el-button type="text" icon="el-icon-close" class="close-btn" @click="closeJobDetails" />
                </div>
                <div class="job-details-content">
                  <div class="detail-row">
                    <div class="detail-label">岗位名称：</div>
                    <div class="detail-value">{{ selectedJob.title }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">实习企业：</div>
                    <div class="detail-value">{{ selectedJob.company_name }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">岗位地点：</div>
                    <div class="detail-value">{{ selectedJob.location }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">岗位薪资：</div>
                    <div class="detail-value">{{ selectedJob.salary_description }}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">岗位职责：</div>
                    <div class="detail-value" v-html="selectedJob.description" />
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </el-card>
      </el-col>
    </el-row>

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
      contractCount: 0,
      selectedJobId: null,
      statCards: [
        {
          title: '学生数目',
          value: 0,
          icon: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z'
        },
        {
          title: '实习岗位数目',
          value: 0,
          icon: 'M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z'
        },
        {
          title: '上传合同数目',
          value: 0,
          icon: 'M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z'
        }
      ]
    }
  },
  computed: {
    selectedJob() {
      if (this.selectedJobId === null) return {}
      return this.jobData.find(item => item.id === this.selectedJobId) || {}
    }
  },
  created() {
    // Only load critical stats immediately
    this.getStatistic()

    // Use setTimeout to delay non-critical data loading
    this.$nextTick(() => {
      setTimeout(() => {
        this.getSchoolOverviewData()
        this.isSchoolOverviewLoading = true
        this.isLawLoading = true
        this.isApprovalLoading = true
        this.isReportLoading = true
        this.isInternshipLoading = true

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
      this.toggleJobDetails(id)
    },
    toggleJobDetails(id) {
      if (this.selectedJobId === id) {
        this.selectedJobId = null
      } else {
        this.selectedJobId = id
        this.$nextTick(() => {
          const detailsElement = document.querySelector('.job-details-card')
          if (detailsElement) {
            detailsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        })
      }
    },
    closeJobDetails() {
      this.selectedJobId = null
    },
    getStatistic() {
      getStatistic().then(response => {
        this.studentCount = response.data.user_count
        this.internshipCount = response.data.job_count
        this.contractCount = response.data.item_count

        // Update stat card values
        this.statCards[0].value = this.studentCount
        this.statCards[1].value = this.internshipCount
        this.statCards[2].value = this.contractCount
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
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
    margin-bottom: 20px;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      margin-bottom: 15px;
    }
  }

  .dashboard-content {
    margin-top: 20px;

    @media (max-width: 768px) {
      margin-top: 15px;
    }
  }

  .content-col {
    margin-bottom: 20px;

    @media (max-width: 768px) {
      margin-bottom: 15px;
    }
  }

  // Stat cards
  .stat-card-col {
    margin-bottom: 20px;

    @media (max-width: 768px) {
      margin-bottom: 15px;
    }
  }

  .stat-card {
    height: 100%;
    color: #fff;
    border-radius: 12px;
    border: none;
    overflow: hidden;
    position: relative;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: linear-gradient(120deg, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
      opacity: 0.6;
      z-index: 0;
    }

    &.stat-card-0 {
      background: linear-gradient(135deg, #444444, #3a3a3a);
      border: 1px solid rgba(100, 100, 100, 0.2);
    }

    &.stat-card-1 {
      background: linear-gradient(135deg, #3d3d3d, #333333);
      border: 1px solid rgba(100, 100, 100, 0.2);
    }

    &.stat-card-2 {
      background: linear-gradient(135deg, #464646, #3c3c3c);
      border: 1px solid rgba(100, 100, 100, 0.2);
    }

    .stat-card-content {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 1;
    }

    .stat-info {
      .stat-title {
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.625rem;
        text-transform: uppercase;
        letter-spacing: 0.03125rem;
        opacity: 0.9;
        position: relative;
        padding-left: 0.75rem;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.7;
        }
      }

      .stat-value {
        font-size: 1.75rem;
        font-weight: bold;
        margin-top: 0.5rem;
        transition: transform 0.15s ease;
      }
    }

    .stat-icon {
      opacity: 0.15;
      transition: all 0.3s ease;

      svg {
        width: 3.125rem;
        height: 3.125rem;
      }
    }

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);

      .stat-icon {
        opacity: 0.25;
      }

      .stat-info .stat-value {
        transform: translateX(2px);
      }
    }
  }

  // Content cards
  .content-card {
    height: 100%;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    overflow: hidden;
    border: none;
    position: relative;
    background-color: rgba(255, 255, 255, 0.95);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      .card-title {
        font-size: 1.0625rem;
        font-weight: 600;
        color: #2c3e50;
        position: relative;
        padding-bottom: 0.625rem;
      }

      .view-more {
        border-radius: 1.25rem;
        padding: 0.25rem 0.75rem;
        background-color: rgba(64, 158, 255, 0.05);
        font-size: 0.75rem;
        color: #606266;
        border: 1px solid rgba(64, 158, 255, 0.1);
        position: relative;
        overflow: hidden;
        text-decoration: none !important;

        &:hover {
          background-color: rgba(64, 158, 255, 0.1);
          color: #409EFF;
          text-decoration: none !important;
        }
      }
    }

    .card-content {
      .card-item {
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 1.125rem;
        margin-bottom: 1rem;
        transition: transform 0.15s ease, border-left-color 0.15s ease;
        border-left: 0.1875rem solid transparent;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;

        &:hover {
          border-left-color: #409EFF;
          transform: translateX(0.125rem);
        }

        .item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.625rem;
          display: block;
          position: relative;
          text-decoration: none !important;

          &:hover {
            color: #409EFF;
            text-decoration: none !important;
          }
        }

        .item-content {
          font-size: 0.75rem;
          color: #606266;
          margin-bottom: 0.625rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }

        .item-footer {
          display: flex;
          justify-content: flex-end;

          .update-time {
            font-size: 0.6875rem;
            color: #909399;
            background-color: rgba(0, 0, 0, 0.02);
            padding: 0.25rem 0.625rem;
            border-radius: 1.25rem;
            letter-spacing: 0.0125rem;
            border: 1px solid rgba(0, 0, 0, 0.03);
          }
        }
      }

      // Job listings
      .job-col {
        margin-bottom: 1.25rem;
      }

      .job-item {
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 1.125rem;
        height: 100%;
        transition: all 0.15s ease;
        border-left: 0.1875rem solid transparent;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;

        &:hover {
          border-left-color: #409EFF;
          transform: translateY(-0.125rem);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }

        .job-salary {
          font-size: 0.75rem;
          color: #606266;
          margin: 0.3125rem 0 0.625rem;
          font-weight: 500;
        }

        .item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.625rem;
          display: block;
          position: relative;
          text-decoration: none !important;

          &:hover {
            color: #409EFF;
            text-decoration: none !important;
          }
        }

        .item-content {
          font-size: 0.75rem;
          color: #606266;
          margin-bottom: 0.625rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }

        .item-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: auto;

          .update-time {
            font-size: 0.6875rem;
            color: #909399;
            background-color: rgba(0, 0, 0, 0.02);
            padding: 0.25rem 0.625rem;
            border-radius: 1.25rem;
          }
        }

      }
    }
  }
}

// Empty state
.empty-data {
  text-align: center;
  padding: 2rem 0;
  font-size: 1rem;
  color: #909399;
}

// Skeleton loading
.skeleton-container {
  padding: 0;
}

.skeleton-item {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.125rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.skeleton-title {
  width: 60%;
  height: 1.25rem;
  background: #f2f2f2;
  margin-bottom: 0.9375rem;
  border-radius: 0.25rem;
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

.skeleton-text {
  width: 100%;
  height: 0.625rem;
  background: #f2f2f2;
  margin-bottom: 0.5rem;
  border-radius: 0.125rem;
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

.skeleton-text:last-of-type {
  width: 80%;
}

.skeleton-date {
  width: 7.5rem;
  height: 1.25rem;
  background: #f2f2f2;
  margin-left: auto;
  margin-top: 0.625rem;
  border-radius: 0.625rem;
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

@keyframes skeleton-loading {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.3;
  }

  100% {
    opacity: 0.6;
  }
}

// Job details card
.job-details-card {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-left: 0.25rem solid #409EFF;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background: linear-gradient(90deg, #409EFF, #5cadff);
    opacity: 0.7;
  }

  .job-details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f0f2f5;

    h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .close-btn {
      padding: 0.25rem;
      color: #909399;

      &:hover {
        color: #409EFF;
      }
    }
  }

  .job-details-content {
    .detail-row {
      display: flex;
      margin-bottom: 1rem;

      @media (max-width: 767px) {
        flex-direction: column;
      }

      &:last-child {
        margin-bottom: 0;
      }

      .detail-label {
        width: 25%;
        min-width: 6.25rem;
        font-weight: 600;
        color: #606266;

        @media (max-width: 767px) {
          width: 100%;
          margin-bottom: 0.25rem;
        }
      }

      .detail-value {
        flex: 1;
        color: #303133;
        line-height: 1.5;

        @media (max-width: 767px) {
          width: 100%;
        }
      }
    }
  }
}

// Media queries for responsive layout
@media (max-width: 1199px) {
  .dashboard-editor-container {
    padding: 1rem;

    .el-card__body {
      padding: 1.25rem;
    }
  }
}

@media (max-width: 991px) {
  .dashboard-editor-container {
    .content-card .card-content .card-item {
      padding: 1rem;
    }
  }
}

@media (max-width: 767px) {
  .dashboard-editor-container {
    padding: 0.75rem;

    .el-card__body {
      padding: 1rem;
    }

    .stat-card .stat-info .stat-value {
      font-size: 1.5rem;
    }

    .content-card {
      .card-header {
        flex-direction: column;
        align-items: flex-start;

        .view-more {
          margin-top: 0.5rem;
        }
      }
    }
  }
}

@media (max-width: 575px) {
  .dashboard-editor-container {
    .stat-card {
      margin-bottom: 0.75rem;
    }

    .content-col {
      margin-bottom: 0.75rem;
    }
  }
}
</style>
