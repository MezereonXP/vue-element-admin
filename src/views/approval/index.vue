<template>
  <div class="container">
    <h1 style="text-align: center;">实习审批报备管理</h1>
    <el-button v-if="isAdmin" type="primary" icon="el-icon-plus" style="margin-left: 20px;" @click="openEditorForAdd">添加</el-button>

    <el-table :data="tableData" style="margin-top: 20px;width: 60%; margin: 0 auto;">
      <!-- <el-table-column prop="id" label="编号" width="100" /> -->
      <el-table-column prop="title" label="标题" width="1000">
        <template slot-scope="scope">
          <router-link :to="`/approval/detail/${scope.row.id}`" style="color: #000; text-decoration: none;">{{ scope.row.title }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" width="200" :formatter="formatDate" />
      <el-table-column v-if="isAdmin" label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAdmin" type="primary" icon="el-icon-edit" @click="openEditor(scope.row)" />
          <el-button v-if="isAdmin" type="danger" icon="el-icon-delete" @click="deleteContent(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="limit"
      :current-page="page"
      style="margin-top: 20px; width: 100%; text-align: center;"
      @current-change="fetchApprovalData"
      @size-change="handleSizeChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    />

    <el-dialog :visible.sync="addVisible" title="添加">
      <P>标题：</P><el-input v-model="title" placeholder="请输入标题" />
      <br>
      <P>内容：</P><Tinymce ref="editor" v-model="editorContent" :height="400" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="addContent">添加</el-button>
        <el-button @click="addVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="editorVisible" title="编辑">
      <P>标题：</P><el-input v-model="title" placeholder="请输入标题" />
      <br>
      <P>内容：</P><Tinymce ref="editor" v-model="editorContent" :height="400" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveContent">保存</el-button>
        <el-button @click="editorVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addText, fetchText, updateText, deleteTextById } from '@/api/text'
import moment from 'moment'
import Tinymce from '@/components/Tinymce'
import router from '@/router'

export default {
  name: 'Approval',
  components: { Tinymce },
  data() {
    return {
      tableData: [],
      updatedAt: '',
      isAdmin: false,
      loading: false,
      editorVisible: false, // Track modal visibility
      addVisible: false, // Track modal visibility
      editorContent: '', // Content for the TinyMCE editor
      text_type: 4, // Text type for the TinyMCE editor
      page: 1,
      limit: 10,
      total: 0,
      title: '',
      id: 0
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
    this.fetchApprovalData()
    this.checkUserRole()
  },
  methods: {
    async fetchApprovalData() {
      try {
        this.loading = true
        const response = await fetchText(this.page, this.limit, this.text_type)
        this.tableData = response.texts
        this.total = response.total
        this.page = response.page
        this.loading = false
      } catch (error) {
        console.error('Error fetching approval data:', error)
        this.loading = false
      }
    },
    checkUserRole() {
      if (this.roles !== undefined) {
        this.isAdmin = this.roles.includes('admin')
        console.log(this.roles)
      }
    },
    async saveContent() {
      try {
        await updateText({ title: this.title,
          text_type: this.text_type,
          text: this.editorContent }, this.id) // Save the updated content
        this.content = this.editorContent // Update the displayed content
        this.editorVisible = false // Close the modal
        this.$message.success('保存成功')
        this.fetchApprovalData()
      } catch (error) {
        this.$message.error('保存失败')
      }
    },
    async addContent() {
      try {
        await addText({ title: this.title,
          text_type: this.text_type,
          text: this.editorContent }) // Save the updated content
        this.addVisible = false
        this.$message.success('添加成功')
        this.fetchApprovalData()
      } catch (error) {
        this.$message.error('添加失败')
      }
    },
    handleSizeChange(newSize) {
      this.limit = newSize
      this.fetchApprovalData()
    },
    handlePrevClick() {
      this.page--
      this.fetchApprovalData()
    },
    handleNextClick() {
      this.page++
      this.fetchApprovalData()
    },
    deleteContent(id) {
      this.$confirm('确定删除该内容吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTextById(id).then(() => {
          this.$message.success('删除成功')
          this.fetchApprovalData()
        })
      })
    },
    openEditor(row) {
      this.id = row.id
      this.title = row.title
      this.editorContent = row.text
      this.editorVisible = true
    },
    openEditorForAdd() {
      this.addVisible = true
    },
    formatDate(row, column) {
      return moment(row.updated_at).utc().format('YYYY-MM-DD HH:mm:ss')
    },
    getColumnWidth(column) {
      const totalWidth = 1000 // Example total width
      const ratios = {
        title: 0.6 // 60% of the total width
        // Add other columns and their ratios here
      }
      return totalWidth * (ratios[column] || 0.1) // Default to 10% if not specified
    },
    jumpToDetail(id) {
      router.push(`/approval/detail/${id}`)
    }
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
  width: 100%;
}
</style>
