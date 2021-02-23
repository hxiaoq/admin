<template>
  <div class="password-container">
    <div style="width: 40%">
      <el-card class="box-card">

        <div>
          <el-form ref="passwordForm" label-width="120px" :model="passwordForm" :rules="rules">
            <el-form-item label="旧密码:" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" />
            </el-form-item>
            <el-form-item label="新密码:" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" />
            </el-form-item>
            <el-form-item label="密码确认:" prop="newPasswordSure">
              <el-input v-model="passwordForm.newPasswordSure" type="password" />
            </el-form-item>
          </el-form>
          <!-- <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%"
            :show-header="false"
          >
            <el-table-column
              prop="name"
              align="center"
            >
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column
              prop="value"
              align="center"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" placeholder="请输密码" type="password" />
              </template>
            </el-table-column>

          </el-table> -->
          <div style="text-align: center; margin-top: 15px;">
            <el-button type="primary" @click="submitForm('passwordForm')">保存</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import authApi from '@/api/auth'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passwordForm.newPasswordSure !== '') {
          this.$refs.passwordForm.validateField('newPasswordSure')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      access_token: getToken(),
      passwordForm: {
        'newPassword': '',
        'oldPassword': '',
        'newPasswordSure': ''
      },
      rules: {
        newPassword: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        newPasswordSure: [
          { validator: validatePass2, required: true, trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ]

      }
      // tableData: [{
      //   name: '旧密码',
      //   value: ''
      // }, {
      //   name: '新密码',
      //   value: ''
      // }, {
      //   name: '密码确认',
      //   value: ''
      // }]
    }
  },
  mounted() {
    // 'ssss'
    console.log('%c 🍕 ssss: ', 'font-size:20px;background-color: #465975;color:#fff;', 'ssss')
  },
  methods: {
    async updatePassword() {
      await authApi.updatePassword({ access_token: this.access_token, ...this.passwordForm }).then(response => {
        const { data } = response
        console.log(data)
        Message({
          message: response.msg,
          type: 'success',
          duration: 2 * 1000
        })
      }).catch(error => error)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updatePassword()
        } else {
          console.log('验证失败')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.password-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
