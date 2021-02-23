<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-select
        v-model="userValue"
        clearable
        placeholder="请选择对应列"
        class="userSelect"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="keyName"
        placeholder="请输入关键字"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-button
        class=""
        size="small"
        type="success"
        icon="el-icon-search"
        @click="loadTable(pageSize, page,userValue)"
      >
        搜索
      </el-button>
      <el-button
        v-permission="['right:user:add']"
        class="filter-item"
        size="small"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="openNew"
      >
        新增
      </el-button>
      <el-button
        v-permission="['right:user:export']"
        type="warning"
        size="small"
        icon="el-icon-download"
      >导出</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="auth-table"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin: 10px 0"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        header-align="center"
        show-overflow-tooltip
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        label="头像"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-image
            :src="row.headImgUrl"
            class="imgContainer"
            :preview-src-list="[row.headImgUrl]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="用户ID"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="登录账号"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        show-overflow-tooltip
        label="登录密码"
        align="left"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        show-overflow-tooltip
        label="用户名称"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.personName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="手机号码"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="类型"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="状态"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          />
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="操作"
        align="right"
        width="350"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex; justify-content: flex-end">
            <el-button
              key="查看"
              size="mini"
              type="success"
              icon="el-icon-edit"
              @click="handelClick('查看', row)"
            >查看</el-button>
            <el-button
              key="修改"
              size="mini"
              icon="el-icon-edit"
              @click="handelClick('修改', row)"
            >修改</el-button>
            <el-button
              key="删除"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handelClick('删除', row)"
            >删除</el-button>
            <el-button
              key="黑白名单"
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="handelClick('黑白名单', row)"
            >黑白名单</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row
          :gutter="20"
          style="margin:0"
        >
          <el-col :span="12">
            <el-form-item
              label="登录账号"
              prop="username"
            >
              <el-input
                v-model="ruleForm.username"
                placeholder="请输入登录账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="登录密码"
              prop="password"
              autocomplete="off"
            >
              <el-input
                v-model="ruleForm.password"
                type="password"
                placeholder="请输入登录密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="用户名称"
              prop="personName"
            >
              <el-input
                v-model="ruleForm.personName"
                placeholder="请输入用户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group
                v-model="ruleForm.sex"
                placeholder="请选择性别"
              >
                <el-radio
                  label="1"
                >男</el-radio>
                <el-radio
                  label="0"
                >女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="用户类型"
              prop="type"
            >
              <el-select
                v-model="ruleForm.type"
                clearable
                placeholder="请选择用户类型"
              >
                <el-option
                  v-for="item in regionOptions"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否多点"
              prop="isMorePoint"
            >
              <el-radio-group v-model="ruleForm.isMorePoint">
                <el-radio
                  label="1"
                >是</el-radio>
                <el-radio
                  label="0"
                >否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="出生日期"
              prop="birthday"
            >
              <!-- <el-input
                v-model="ruleForm.birthday"
                placeholder="请输入出生日期"
              /> -->
              <el-date-picker
                v-model="ruleForm.birthday"
                type="date"
                placeholder="请输入出生日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="手机号码"
              prop="phone"
            >
              <el-input
                v-model="ruleForm.phone"
                placeholder="请输入手机号码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="电子邮箱"
              prop="eMail"
            >
              <el-input
                v-model="ruleForm.eMail"
                placeholder="请输入电子邮箱"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="座机号码"
              prop="landLine"
            >
              <el-input
                v-model="ruleForm.landLine"
                placeholder="请输入座机号码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="职务"
              prop="post"
            >
              <el-input
                v-model="ruleForm.post"
                placeholder="请输入职务"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="居住地址"
              prop="address"
            >
              <el-input
                v-model="ruleForm.address"
                placeholder="请输入居住地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="上传头像"
              prop="headImgUrl"
            >
              <!-- <el-upload
                class="avatar-uploader"
                :action="url"
                :show-file-list="true"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="ruleForm.headImgUrl"
                  :src="ruleForm.headImgUrl"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload> -->
              <el-upload
                class="avatar-uploader"
                :action="url"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="ruleForm.headImgUrl" :src="ruleForm.headImgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        > 确认 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="黑白名单"
      :visible.sync="dialogApply"
    >
      <div>
        <el-select
          v-model="menuValue"
          placeholder="请选择"
          class="userSelect"
          @change="getWhiteAndBlackLists(currentId,menuValue,blackList)"
        >
          <el-option
            v-for="item in menuValueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="blackList"
          placeholder="请选择"
          class="userSelect"
          @change="getWhiteAndBlackLists(currentId,menuValue,blackList)"
        >
          <el-option
            v-for="item in blackListOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-tree
          ref="userTree"
          class="userTree"
          :data="treeData"
          show-checkbox
          node-key="id"
          :default-checked-keys="treeChecked"
          :props="defaultProps"
        />
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogApply = false"> 取消 </el-button>
        <el-button type="primary" @click="treeSave()"> 确认 </el-button>
      </div>
    </el-dialog>
    <!-- Form 查看-->
    <el-dialog
      title="用户管理"
      :visible.sync="dialogVisible"
    >
      <el-form
        :model="showRow"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row
          :gutter="20"
          style="margin:0"
        >
          <el-col :span="6">
            <div>
              <el-image
                style="width: 150px; height: 150px"
                :src="showRow.headImgUrl"
                fit="fill"
              />
            </div>
          </el-col>
          <el-col :span="18">
            <el-form-item label="用户标识：">
              {{ showRow.name }}
            </el-form-item>
            <el-form-item label="登录账号：">
              {{ showRow.username }}
            </el-form-item>
            <el-form-item label="手机号码：">
              {{ showRow.phone }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：">
              {{ showRow.sexName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期：">
              {{ showRow.birthdayStr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座机号码：">
              {{ showRow.landLine }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否多点：">
              {{ showRow.isMorePoint==1?'是':'否' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型：">
              {{ showRow.typeName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱：">
              {{ showRow.eMail }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属单位：">
              {{ showRow.post }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="居住地址：">
              {{ showRow.address }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              {{ showRow.createTimeStr }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间：">
              {{ showRow.updateTimeStr }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import Cookies from 'js-cookie'
import userApi from '@/api/right/user'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      url: `${process.env.VUE_APP_BASE_API}api-file/files/files/uploadAll`,
      // url: `https://jsonplaceholder.typicode.com/posts/`,
      dialogTitle: '新增用户',
      keyName: '',
      userValue: '',
      regionOptions: [], // 用户类型
      imageUrl: '',
      menuValue: '0',
      blackList: '0',
      menuValueOptions: [{ value: '0', label: '菜单' }, { value: '1', label: '权限' }],
      blackListOptions: [{ value: '0', label: '黑名单' }, { value: '1', label: '白名单' }],
      treeChecked: [],
      options: [{
        value: 'id',
        label: '用户ID'
      }, {
        value: 'username',
        label: '登录账号'
      }, {
        value: 'personName',
        label: '用户名称'
      }, {
        value: 'phone',
        label: '手机号码'
      }, {
        value: 'type',
        label: '性别'
      }, {
        value: 'enabled',
        label: '状态'
      }],
      listLoading: true,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogApply: false,
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      ruleForm: {
        id: '',
        username: '',
        password: '',
        personName: '',
        phone: '',
        landLine: '',
        birthday: '',
        sex: '',
        eMail: '',
        post: '',
        address: '',
        typeName: '',
        isMorePoint: '',
        headImgUrl: '',
        enabled: '',
        createTime: '',
        updateTime: ''
      },
      showRow: {
        id: '',
        username: '',
        password: '',
        personName: '',
        phone: '',
        landLine: '',
        birthdayStr: '',
        sex: '',
        eMail: '',
        post: '',
        address: '',
        typeName: '',
        isMorePoint: '',
        headImgUrl: '',
        enabled: '',
        createTime: '',
        updateTime: ''
      },

      rules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        personName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择一种用户类型', trigger: 'blur' }
        ],
        isMorePoint: [
          { required: true, message: '请设置是否多点', trigger: 'blur' }
        ]
        // phone: [
        //   { required: true, message: '请输入正确的手机格式', trigger: 'blur' }
        // ],
        // eMail: [
        //   { required: true, type: 'email', message: '请输入正确格式的电子邮箱', trigger: 'blur' }
        // ],
        // landLine: [
        //   { required: true, message: '请输入正确格式的座机号码', trigger: 'blur' }
        // ]

      },
      // treeData: [{
      //   id: 1,
      //   label: '一级 1',
      //   children: [{
      //     id: 4,
      //     label: '二级 1-1',
      //     children: [{
      //       id: 9,
      //       label: '三级 1-1-1'
      //     }, {
      //       id: 10,
      //       label: '三级 1-1-2'
      //     }]
      //   }]
      // }, {
      //   id: 2,
      //   label: '一级 2',
      //   children: [{
      //     id: 5,
      //     label: '二级 2-1'
      //   }, {
      //     id: 6,
      //     label: '二级 2-2'
      //   }]
      // }, {
      //   id: 3,
      //   label: '一级 3',
      //   children: [{
      //     id: 7,
      //     label: '二级 3-1'
      //   }, {
      //     id: 8,
      //     label: '二级 3-2'
      //   }]
      // }],
      menuData: [],
      authData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentId: ''
    }
  },
  computed: {
    treeData() {
      if (this.menuValue === '1') {
        return this.authData
      } else {
        return this.menuData
      }
    }
  },
  mounted() {
    const tableHeight = Cookies.get('appContainerHeight') - 96
    const pageSize = parseInt((tableHeight - 40) / 43)
    this.pageSize = pageSize
    this.loadTable(this.pageSize, this.page, this.userValue)
    this.getGroupIdType()
    this.getSysMenuTree()
    this.getPermissionTree()
  },
  methods: {
    async loadTable(pageSize, page, type = 'keyName') {
      if (!type) {
        type = 'keyName'
      }
      await userApi.findUsers({ limit: this.pageSize, page: this.page, [type]: this.keyName }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    async getGroupIdType() {
      await userApi.getGroupIdType().then((response) => {
        const { data } = response
        this.regionOptions = data
      }).catch(error => error)
    },
    async getSysMenuTree() {
      await userApi.getSysMenuTree().then((response) => {
        const { data } = response
        this.menuData = data
      }).catch(error => error)
    },
    async getPermissionTree() {
      await userApi.getPermissionTree().then((response) => {
        const { data } = response
        this.authData = data
      }).catch(error => error)
    },
    async getWhiteAndBlackLists(id, listType = 0, menuType = 0) { // id=16&listType=0&menuType=0
      await userApi.getWhiteAndBlackLists({ id, listType, menuType }).then((response) => {
        const { data } = response
        this.treeChecked = data.menuIds
      }).catch(error => error)
    },
    async setWhiteAndBlackLists(id, menuIds, listType = 0, menuType = 0) { // id=16&listType=0&menuType=0
      await userApi.setWhiteAndBlackLists({ userId: id, listType, menuType, menuIds }).then((response) => {
        Message({
          message: response.msg,
          type: 'success',
          duration: 2 * 1000
        })
      }).catch(error => error)
    },
    getTreeCheckedIds() {
      this.treeChecked = this.$refs.userTree.getCheckedKeys()
    },

    treeSave() {
      this.getTreeCheckedIds()
      this.setWhiteAndBlackLists(this.currentId, this.treeChecked, this.menuValue, this.blackList)
      this.dialogApply = false
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleAvatarSuccess(res, file) {
      console.log('handleAvatarSuccess', res, file)
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.imageUrl = res.data.url
        this.ruleForm.headImgUrl = this.imageUrl
      } else {
        this.$message.error(res.msg)
        this.imageUrl = URL.createObjectURL(file.raw)
        this.ruleForm.headImgUrl = this.imageUrl
      }
    },
    beforeAvatarUpload(file) {
      // console.log('beforeAvatarUpload')
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
      // return isJPG && isLt2M
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      userApi.findUsers({ limit: this.pageSize, page }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          userApi.saveOrUpdate({ ...this.ruleForm }).then((response) => {
            Message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            if (response.code === 200) {
              this.listLoading = true
              this.loadTable(this.pageSize, this.page, this.userValue)
              this.dialogFormVisible = false
            }
          }).catch(error => error)
        } else {
          console.log('验证出错')
          return false
        }
      })
    },
    openNew() {
      this.dialogTitle = '新增用户'
      this.dialogFormVisible = true
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = null
      }
    },
    handelClick(item, row) {
      if (item === '查看') {
        this.dialogVisible = true
        this.showRow = { ...row }
      } else if (item === '修改') {
        this.dialogTitle = '修改用户'
        this.dialogFormVisible = true
        this.ruleForm = { ...row }
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            userApi.delete({ id: row.id }).then((response) => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 2 * 1000
              })
              if (response.code === 200) {
                this.loadTable(this.pageSize, this.page, this.userValue)
              }
            }).catch(error => {
              console.log(error, 'eee')
            })
          })
          .catch(_ => {
            console.log(_, '取消删除了')
          })
      } else if (item === '黑白名单') {
        this.dialogApply = true
        // this.$router.push({ path: '/auth/client/add' })
        this.currentId = row.id
        this.getWhiteAndBlackLists(row.id, this.menuValue, this.blackList)
      }
    }
  }
}
</script>
 <style lang="scss">
.imgContainer {
  width: 25px;
  height: 25px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.userTree {
  margin-top: 20px;
  margin-bottom: 10px;
  height: 200px;
  overflow: auto;
}
.userSelect {
  margin-right: 10px;
  .el-input__icon {
    line-height: 34px;
  }
}
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}

.search-btn {
  background-color: rgba(0, 204, 102, 1);
}
.client-ruleForm {
  .el-select {
    width: 85%;
  }
}
</style>
