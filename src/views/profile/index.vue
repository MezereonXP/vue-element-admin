<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <!-- <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane> -->
              <el-tab-pane label="个人信息" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
// import Activity from './components/Activity'
// import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Account },
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'email',
      'phone_number',
      'sex',
      'age',
      'address',
      'id',
      'introduction'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      console.log(this.introduction)
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: this.email,
        avatar: this.avatar,
        phone_number: this.phone_number,
        sex: this.sex,
        age: this.age,
        address: this.address,
        id: this.id,
        introduction: this.introduction
      }
    }
  }
}
</script>
