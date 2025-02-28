<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span class="title">学生管理</span>
      </div>
      <el-button type="primary" plain icon="el-icon-plus" @click="openCreateDialog">新增学生</el-button>
      <el-button type="success" plain class="refresh-button" @click="refresh">
        <i :class="['el-icon-refresh', { 'is-refreshing': isRefreshing }]" /> 刷新
      </el-button>
      <el-input v-model="search" placeholder="请输入姓名或者手机号" style="width: 200px; margin-left: 30px;" />
      <el-button
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px;"
        plain
        @click="searchStudent"
      >查找</el-button>

      <el-table
        v-loading="listLoading"
        :data="studentList"
        border
        fit
        highlight-current-row
        show-header
        style="margin-top: 20px;"
      >
        <el-table-column align="center" label="姓名" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="性别" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.sex == 'male' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="民族" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.nationality }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="班级" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.school_class }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="专业" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.major }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.phone_number }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.roles.includes('user')" type="success">学生</el-tag>
            <el-tag v-if="scope.row.roles.includes('admin')" type="info" style="margin-left: 10px;">管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="210">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getStudentList"
      />

      <el-dialog :visible.sync="dialogVisible" title="编辑学生信息" width="20%">
        <div>
          <el-form label-width="80px" size="medium">
            <el-form-item label="姓名">
              <el-input v-model="selectedStudent.username" placeholder="请输入姓名" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="selectedStudent.email" placeholder="请输入邮箱" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="selectedStudent.phone_number" placeholder="请输入手机号" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="selectedStudent.sex" placeholder="请选择性别" style="width: 300px;">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input-number v-model="selectedStudent.age" :min="0" :max="150" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="民族">
              <el-select v-model="selectedStudent.nationality" placeholder="请选择民族" style="width: 300px;">
                <el-option v-for="nation in nations" :key="nation.name" :label="nation.name" :value="nation.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="班级">
              <el-input v-model="selectedStudent.school_class" placeholder="请输入班级" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="selectedStudent.major" placeholder="请输入专业" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="实习企业">
              <el-input v-model="selectedStudent.internship_company" placeholder="请输入实习企业" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="实习岗位">
              <el-input v-model="selectedStudent.internship_position" placeholder="请输入实习岗位" style="width: 300px;" />
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="selectedStudent.roles" placeholder="请选择角色" multiple style="width: 300px;">
                <el-option label="学生" value="user" />
                <el-option label="管理员" value="admin" />
              </el-select>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="password" style="width: 200px;" />
              <el-button type="primary" style="margin-left: 10px;" @click="generatePassword">生成密码</el-button>
            </el-form-item>
          </el-form>

          <!-- Add more fields as necessary -->
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="isEdit" type="primary" @click="saveChanges">更新</el-button>
          <el-button v-if="!isEdit" type="primary" @click="createStudent">创建</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserList, updateProfile, createUser, deleteUser, searchUser } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'StudentList',
  components: { Pagination },
  data() {
    return {
      studentList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogVisible: false,
      selectedStudent: {},
      isEdit: false,
      password: '',
      createDialogVisible: false,
      search: '',
      nations: [{ name: '汉族' }, { name: '回族' }, { name: '藏族' }, { name: '维吾尔族' }],
      isRefreshing: false
    }
  },
  created() {
    this.getStudentList()
  },
  methods: {
    getStudentList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.studentList = res.users
        this.total = res.total
        this.$message.success('获取学生列表成功')
        this.listLoading = false
      })
    },
    openEditDialog(row) {
      this.password = ''
      this.selectedStudent = row
      this.dialogVisible = true
      this.isEdit = true
    },
    saveChanges() {
      if (!this.isEdit) {
        this.createStudent()
      } else {
        const userData = { ...this.selectedStudent }
        // Ask user to confirm the update
        console.log(this.password)
        if (this.password) {
          this.$confirm('确定要更新密码吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            userData.password = this.password
            updateProfile(userData).then(res => {
              if (res.code === 20000) {
                this.dialogVisible = false
                this.$message.success('更新成功')
              } else {
                this.$message.error('更新失败')
              }
            })
          })
        } else {
          updateProfile(userData).then(res => {
            if (res.code === 20000) {
              this.dialogVisible = false
              this.$message.success('更新成功')
            } else {
              this.$message.error('更新失败')
            }
          })
        }
      }
    },
    handleEdit(row) {
      console.log(row)
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(res => {
          if (res.code === 20000) {
            this.$message.success('删除成功')
            this.getStudentList()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    generatePassword() {
      const randomString = Math.random().toString(36).substring(2, 15)
      console.log(randomString)
      this.password = randomString
    },
    openCreateDialog() {
      this.dialogVisible = true
      this.createDialogVisible = true
      this.isEdit = false
      this.selectedStudent = {
        roles: ['user'],
        sex: 'male',
        age: 20,
        nationality: '汉族',
        school_class: '',
        major: '',
        internship_company: '',
        internship_position: ''
      }
    },
    createStudent() {
      const userData = { ...this.selectedStudent }
      // validate all fields
      if (!userData.username || !userData.email || !userData.phone_number || !userData.sex || !userData.age || !userData.roles || !userData.school_class || !userData.major || !userData.internship_company || !userData.internship_position) {
        this.$message.error('请填写所有必填项')
        return
      }
      userData.password = this.password
      createUser(userData).then(res => {
        if (res.code === 20000) {
          this.dialogVisible = false
          this.$message.success('创建成功')
          this.getStudentList()
        }
      })
    },
    searchStudent() {
      if (!this.search) {
        this.$message.error('请输入搜索内容')
        return
      }
      this.listLoading = true
      const query = {
        query: this.search,
        page: 1,
        limit: 20
      }
      searchUser(query).then(res => {
        this.studentList = res.users
        this.total = res.total
        this.listLoading = false
        this.$message.success('搜索成功')
      })
    },
    refresh() {
      this.isRefreshing = true
      this.getStudentList()
      setTimeout(() => {
        this.isRefreshing = false
      }, 500)
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  position: relative;
  padding-left: 12px;
  display: inline-block;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 16px;
    width: 4px;
    background-color: #409EFF;
    border-radius: 2px;
  }
}

.refresh-button {
  margin-left: 20px;

  .el-icon-refresh.is-refreshing {
    -webkit-animation: spin 1s linear infinite;
    -moz-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
