<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="clientName"
        placeholder="请输入关键字"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-button
        class=""
        size="small"
        type="success"
        icon="el-icon-search"
        @click="loadTable()"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        size="small"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="openNew"
      >
        新增
      </el-button>
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
        label="应用标识"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.clientId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="应用名称"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.clientName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="应用秘钥"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.clientSecret }}</span>
          <!-- <el-tooltip effect="light" :visible-arrow="false" :content="row.clientSecret" placement="bottom-start">
            <span>{{ row.clientSecret }}</span>
          </el-tooltip> -->
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="回调地址"
        align="left"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.webServerRedirectUri }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="授权方式"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.authorizedGrantTypesName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="300"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex; justify-content: flex-end">
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
              key="应用设置"
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="handelClick('应用设置', row)"
            >应用设置</el-button>
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
        class="client-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="应用标识"
              prop="clientId"
            >
              <el-input
                v-model="ruleForm.clientId"
                placeholder="请输入应用标识"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="应用名称"
              prop="clientName"
            >
              <el-input
                v-model="ruleForm.clientName"
                placeholder="请输入应用名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="应用密钥"
              prop="clientSecret"
            >
              <el-input
                v-model="ruleForm.clientSecret"
                placeholder="请输入应用秘钥"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="范围"
              prop="scope"
            >
              <el-select
                v-model="ruleForm.scope"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in appScopeList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="授权方式"
              prop="authorizedGrantTypes"
            >
              <el-select
                v-model="ruleForm.authorizedGrantTypes"
                clearable
                multiple
                collapse-tags
                placeholder="请选择授权方式"
              >
                <el-option
                  v-for="item in methodList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="回调地址"
              prop="webServerRedirectUri"
            >
              <el-input
                v-model="ruleForm.webServerRedirectUri"
                placeholder="请输入回调地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="有效期1"
              prop="accessTokenValidity"
            >
              <el-input
                v-model="ruleForm.accessTokenValidity"
                placeholder="请输入access token有效期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="有效期2"
              prop="refreshTokenValidity"
            >
              <el-input
                v-model="ruleForm.refreshTokenValidity"
                placeholder="请输入refresh token有效期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="自动授权"
              prop="autoapprove"
            >
              <el-radio-group v-model="ruleForm.autoapprove">
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
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
      title="应用设置"
      :visible.sync="dialogApply"
      class="treeTab"
    >
      <el-tabs
        v-model="activeName"
        type="border-card"
      >
        <el-tab-pane
          label="菜单设置"
          name="menu"
        >
          <div>
            <el-tree
              ref="menuTree"
              :data="menuTree"
              show-checkbox
              :check-strictly="false"
              node-key="id"
              :props="defaultProps"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="服务管理"
          name="service"
        >
          <el-tree
            ref="serviceTree"
            :data="serviceTree"
            show-checkbox
            :check-strictly="false"
            node-key="id"
            :props="defaultProps"
          />
        </el-tab-pane>
        <el-tab-pane
          label="角色管理"
          name="role"
        >
          <el-tree
            ref="roleTree"
            :data="roleTree"
            show-checkbox
            :check-strictly="true"
            node-key="id"
            :props="defaultProps"
          />
        </el-tab-pane>
      </el-tabs>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogApply = false"> 取消 </el-button>
        <el-button type="primary" @click="treeSaveClick"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import authApi from '@/api/auth'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      access_token: getToken(),
      dialogTitle: '新增应用',
      clientName: '',
      listLoading: true,
      dialogFormVisible: false,
      dialogApply: false,
      btnList: [{ txt: '修改', class: '', icon: 'el-icon-edit' }, { txt: '删除', class: 'danger', icon: 'el-icon-delete' }, { txt: '应用设置', class: 'primary', icon: 'el-icon-share' }],
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      ruleForm: {
        accessTokenValidity: 180000,
        additionalInformation: null,
        authorities: null,
        authorizedGrantTypes: null,
        autoapprove: null,
        clientId: null,
        clientName: null,
        clientSecret: null,
        clientSecretStr: null,
        createTime: null,
        delFlag: null,
        id: null,
        ifLimit: null,
        limitCount: null,
        refreshTokenValidity: 18000,
        resourceIds: null,
        scope: null,
        updateTime: null,
        webServerRedirectUri: null
      },
      appScopeList: [],
      methodList: [],
      rules: {
        clientId: [
          { required: true, message: '请输入应用标识', trigger: 'blur' }
        ],
        clientName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        authorizedGrantTypes: [{ required: true, message: '请选择至少一种授权方式', trigger: 'blur' }]
        // accessTokenValidity: [
        //   { required: true, message: '请输入access token有效期', trigger: 'blur' }
        // ],
        // refreshTokenValidity: [
        //   { required: true, message: '请输入refresh token有效期', trigger: 'blur' }
        // ]

      },
      activeName: 'menu',
      menuTree: [],
      menuIds: [],
      roleTree: [],
      roleIds: [],
      serviceTree: [],
      serviceIds: [],

      defaultProps: {
        children: 'children',
        label: 'label'
      },
      clientId: null
    }
  },
  computed: {
  },
  mounted() {
    const tableHeight = Cookies.get('appContainerHeight') - 96
    const pageSize = parseInt((tableHeight - 40) / 38)
    this.pageSize = pageSize
    this.loadTable()
    this.getMethodList()
    this.getAppScopeList()
    this.getMenuTree()
    this.getServiceTree()
    this.getRoleTree()
  },
  methods: {
    async loadTable(pageSize, page) {
      await authApi.getPageResult({ limit: this.pageSize, page: this.page, clientName: this.clientName }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    async getMethodList() {
      await authApi.getSysOauthGrantType({ access_token: this.access_token }).then(response => {
        const { data } = response
        this.methodList = data
      }).catch(error => error)
    },
    async getAppScopeList() {
      await authApi.getSysOauthScope({ access_token: this.access_token }).then(response => {
        const { data } = response
        this.appScopeList = data
      }).catch(error => error)
    },
    async getMenuTree() {
      await authApi.getSysMenuTree().then(response => {
        const { data } = response
        this.menuTree = data
      }).catch(error => error)
    },
    async getRoleTree() {
      await authApi.getSysRoleTree().then(response => {
        const { data } = response
        this.roleTree = data
      }).catch(error => error)
    },
    async getServiceTree() {
      await authApi.getSysServiceTree().then(response => {
        const { data } = response
        this.serviceTree = data
      }).catch(error => error)
    },
    async getServicesByClientId(clientId) {
      this.clientId = clientId
      await authApi.getServicesByClientId({ clientId }).then(response => {
        const { data } = response

        this.menuIds = data.menuIds
        this.roleIds = data.roleIds
        this.serviceIds = data.serviceIds
        this.setSelectTree()
      }).catch(error => error)
    },
    setSelectTree() {
      this.$refs.menuTree.setCheckedKeys(this.menuIds)
      this.$refs.roleTree.setCheckedKeys(this.roleIds)
      this.$refs.serviceTree.setCheckedKeys(this.serviceIds)
    },
    treeSaveClick() {
      this.roleIds = this.$refs.roleTree.getCheckedKeys()
      this.menuIds = this.$refs.menuTree.getCheckedKeys()
      this.serviceIds = this.$refs.serviceTree.getCheckedKeys()
      authApi.setAllToClient({ clientId: this.clientId, menuIds: this.menuIds, roleIds: this.roleIds, serviceIds: this.serviceIds }).then((response) => {
        Message({
          message: response.msg,
          type: 'success',
          duration: 2 * 1000
        })
        if (response.code === 200) {
          this.listLoading = true
          this.loadTable()
          this.dialogApply = false
        }
      }).catch(error => error)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      authApi.getPageResult({ limit: this.pageSize, page }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.authorizedGrantTypes = this.ruleForm.authorizedGrantTypes.join(',')
          authApi.saveClient({ ...this.ruleForm }).then((response) => {
            Message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            if (response.code === 200) {
              this.listLoading = true
              this.loadTable()
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
      this.dialogTitle = '新增应用'
      this.dialogFormVisible = true
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = null
      }
      this.ruleForm.accessTokenValidity = 180000
      this.ruleForm.refreshTokenValidity = 18000
    },
    handelClick(item, row) {
      if (item === '修改') {
        this.dialogTitle = '修改应用'
        this.dialogFormVisible = true
        this.ruleForm = { ...row }
        this.ruleForm.authorizedGrantTypes = this.ruleForm.authorizedGrantTypes.split(',')
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            authApi.deleteClient({ id: row.id }).then((response) => {
              Message({
                message: response.msg,
                type: 'success',
                duration: 2 * 1000
              })
              if (response.code === 200) {
                this.loadTable()
              }
            }).catch(error => {
              console.log(error, 'eee')
            })
          })
          .catch(_ => {
            console.log(_, '取消删除了')
          })
      } else if (item === '应用设置') {
        this.dialogApply = true
        this.getServicesByClientId(row.id)
        // this.$router.push({ path: '/auth/client/add' })
      }
    }
  }
}
</script>
<style lang="scss">
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
.treeTab {
  .el-tab-pane {
    height: 200px;
    overflow-y: auto;
  }
  .el-dialog__footer {
    padding-top: 0px;
  }
}
</style>
