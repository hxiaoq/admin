<template>
  <div class="app-container">
    <!-- <small>认证中心-角色管理页面</small> -->
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
        label="角色编码"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="角色名称"
        align="left"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="角色类型"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.typeName }}</span>
          <!-- <el-tooltip effect="light" :visible-arrow="false" :content="row.type" placement="bottom-start">
            <span>{{ row.type }}</span>
          </el-tooltip> -->
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="描述"
        align="left"
        width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="所属应用"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.clientName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="创建时间"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.createTimeStr }}</span>
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
              key="角色设置"
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="handelClick('角色设置', row)"
            >角色设置</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="client-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="角色名称" prop="name">
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入角色名称"
              />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">

          <el-col :span="20">
            <el-form-item label="角色编码" prop="code">
              <el-input
                v-model="ruleForm.code"
                placeholder="请输入角色编码"
              />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">

          <el-col :span="20">
            <el-form-item label="所属应用" prop="clientId">
              <el-select
                v-model="ruleForm.clientId"
                clearable
                multiple
                collapse-tags
                placeholder="请选择所属应用"
              >
                <el-option
                  v-for="item in clientList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">

          <el-col :span="20">
            <el-form-item label="角色类型" prop="type">
              <el-select
                v-model="ruleForm.type"
                placeholder="请输入角色类型"
              >
                <el-option
                  v-for="item in roleTypeList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">

          <el-col :span="20">
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="ruleForm.description"
                type="textarea"
                placeholder="请输入描述"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSave"> 确认 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="角色设置"
      :visible.sync="dialogApply"
      class="treeTab"
    >
      <el-tabs
        v-model="activeName"
        type="border-card"
      >
        <el-tab-pane
          label="菜单"
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
          label="权限"
          name="role"
        >
          <el-tree
            ref="permissionTree"
            :data="permissionTree"
            show-checkbox
            :check-strictly="true"
            node-key="id"
            :props="defaultProps"
          />
        </el-tab-pane>
        <el-tab-pane
          label="成员"
          name="service"
        >
          <el-tree
            ref="userTree"
            :data="userTree"
            show-checkbox
            :check-strictly="false"
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
import roleApi from '@/api/right/role'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      access_token: getToken(),
      dialogTitle: '新增角色',
      keyName: '',
      userValue: '',
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
      dialogApply: false,
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      ruleForm: {
        clientId: null,
        createTimeStr: null,
        code: null,
        name: null,
        type: null,
        id: null,
        updateTime: null,
        description: null
      },
      roleTypeList: [],
      clientList: [],
      rules: {
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择角色类型', trigger: 'blur' }
        ],
        refreshTokenValidity: [
          { required: true, message: '请输入refresh token有效期', trigger: 'blur' }
        ]

      },
      activeName: 'menu',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      menuTree: [],
      menuIds: [],
      permissionTree: [],
      permissionIds: [],
      userTree: [],
      userIds: [],
      currentId: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
  },
  mounted() {
    const tableHeight = Cookies.get('appContainerHeight') - 86
    const pageSize = parseInt((tableHeight - 40) / 37)
    this.pageSize = pageSize
    this.loadTable()
    this.getClientSelect()
    this.getRoleType()
    this.getMenuTree()
    this.getServiceTree()
    this.getRoleTree()
  },
  methods: {
    async loadTable(pageSize, page, type = 'keyName') {
      if (!type) {
        type = 'keyName'
      }
      await roleApi.findRoles({ limit: this.pageSize, page: this.page, [type]: this.keyName }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    async getClientSelect() {
      await roleApi.getClientSelect({ access_token: this.access_token }).then((response) => {
        const { data } = response
        this.clientList = data
      }).catch(error => error)
    },
    async getRoleType() {
      await roleApi.getRoleType({ access_token: this.access_token }).then((response) => {
        const { data } = response
        this.roleTypeList = data
      }).catch(error => error)
    },

    async getMenuTree() {
      await roleApi.getSysMenuTree().then(response => {
        const { data } = response
        this.menuTree = data
      }).catch(error => error)
    },
    async getRoleTree() {
      await roleApi.getSysRoleTree().then(response => {
        const { data } = response
        this.permissionTree = data
      }).catch(error => error)
    },
    async getServiceTree() {
      await roleApi.getSysServiceTree().then(response => {
        const { data } = response
        this.userTree = data
      }).catch(error => error)
    },
    async findByRoleId() {
      await roleApi.findByRoleId({ roleId: this.currentId }).then(response => {
        const { data } = response
        this.menuIds = data.menuIds
        this.permissionIds = data.permissionIds
        this.userIds = data.userIds
        this.$refs.menuTree.setCheckedKeys(this.menuIds)
        this.$refs.permissionTree.setCheckedKeys(this.permissionIds)
        this.$refs.userTree.setCheckedKeys(this.userIds)
      }).catch(error => error)
    },

    treeSaveClick() {
      this.permissionIds = this.$refs.permissionTree.getCheckedKeys()
      this.menuIds = this.$refs.menuTree.getCheckedKeys()
      this.userIds = this.$refs.userTree.getCheckedKeys()
      roleApi.setAllToRole({ roleId: this.currentId, menuIds: this.menuIds, userIds: this.userIds, permissionIds: this.permissionIds }).then((response) => {
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
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCurrentChange(page) {
      this.page = page
      this.listLoading = true
      roleApi.findRoles({ limit: this.pageSize, page }).then((response) => {
        const { data } = response
        this.list = data.data
        this.total = data.count
        this.listLoading = false
      }).catch(error => error)
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.clientId = this.ruleForm.clientId.join(',')
          roleApi.saveOrUpdate({ ...this.ruleForm }).then((response) => {
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
      this.dialogTitle = '新增角色'
      this.dialogFormVisible = true
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = null
      }
    },
    handelClick(item, row) {
      if (item === '修改') {
        this.dialogTitle = '修改角色'
        this.dialogFormVisible = true
        this.ruleForm = { ...row }
        console.log(this.ruleForm.clientId)
        if (this.ruleForm.clientId) {
          this.ruleForm.clientId = this.ruleForm.clientId.split(',')
        }
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            roleApi.deleteRole({ id: row.id }).then((response) => {
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
      } else if (item === '角色设置') {
        this.dialogApply = true
        // this.$router.push({ path: '/auth/client/add' })
        this.currentId = row.id
        this.findByRoleId()
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
