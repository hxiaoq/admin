<template>
  <div class="app-container">
    <!-- <small>认证中心-应用管理页面</small> -->
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="请输入关键字"
        style="width: 200px;margin-right: 10px;"
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
        style="margin-left: 10px;"
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
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
      fit
      highlight-current-row
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        show-overflow-tooltip
        label="序号"
        type="index"

        align="center"
        header-align="center"
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        label="权限名称"

        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="权限标识"

        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="权限类型"

        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="权限描述"
        width="350"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="创建时间"
        width="200"
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
        width="200"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex;justify-content: flex-end;">
            <el-button
              key="修改"
              size="mini"
              icon="el-icon-edit"
              @click="handelClick('修改',row)"
            >修改</el-button>
            <el-button
              key="删除"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handelClick('删除',row)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="service-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item
              label="权限名称"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入权限名称"
              />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">

          <el-col :span="21">
            <el-form-item
              label="权限标识"
              prop="permission"
            >
              <el-input
                v-model="ruleForm.permission"
                placeholder="请输入权限标识"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item
              label="权限类型"
              prop="type"
            >
              <el-select
                v-model="ruleForm.type"
                placeholder="请选择权限类型"
              >
                <el-option
                  v-for="item in permissionTypeList"
                  :key="item.code"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item
              label="上级权限"
              prop="parent"
            >
              <el-select
                v-model="ruleForm.parent"
                placeholder="请选择上级权限"
                clearable
              >
                <el-option
                  v-for="item in higherPermissionList"
                  :key="item.code"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item
              label="权限描述"
              prop="description"
            >
              <el-input
                v-model="ruleForm.description"
                type="textarea"
                placeholder="请输入权限描述"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="应用设置"
      :visible.sync="dialogApply"
    >
      应用设置
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogApply = false">
          取消
        </el-button>
        <el-button type="primary">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import permissionsApi from '@/api/right/permission'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      name: '',
      listLoading: true,
      dialogFormVisible: false,
      dialogTitle: '新增权限',
      dialogApply: false,
      list: [],
      ruleForm: {
        name: '',
        permission: '',
        typeName: '',
        type: '',
        parent: '',
        description: ''
      },
      higherPermissionList: [],
      permissionTypeList: [],

      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择权限类型', trigger: 'blur' }
        ]

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
    this.getPermissionType()
    this.getParentPermissionSelect()
  },
  methods: {
    async getParentPermissionSelect() {
      await permissionsApi.getParentPermissionSelect().then((response) => {
        const { data } = response
        this.higherPermissionList = data
      })
    },
    async getPermissionType() {
      await permissionsApi.getPermissionType().then((response) => {
        const { data } = response
        this.permissionTypeList = data
      })
    },
    async loadTable() {
      await permissionsApi.getPermissionTableTree({ name: this.name }).then((response) => {
        const { data } = response
        this.list = data
        this.listLoading = false
      }).catch(error => error)
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          permissionsApi.saveOrUpdate({ ...this.ruleForm }).then((response) => {
            Message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            if (response.code === 200) {
              this.listLoading = true
              this.loadTable()
              this.getParentPermissionSelect()
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
      this.dialogTitle = '新增权限'
      this.dialogFormVisible = true
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = ''
      }
    },
    handelClick(item, row) {
      if (item === '修改') {
        this.dialogTitle = '修改权限'
        this.dialogFormVisible = true
        this.ruleForm = { ...row }
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            permissionsApi.deletePermissions({ id: row.id }).then((response) => {
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
        // this.$router.push({ permission: '/auth/client/add' })
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
  .cell {
    span {
      word-break: initial;
    }

  }
}

.search-btn {
  background-color: rgba(0, 204, 102, 1);
}
.service-ruleForm {
  .el-select {
    width: 85%;
  }
}
</style>
