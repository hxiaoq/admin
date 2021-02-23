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
        label="菜单名称"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="菜单路由"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="图标样式"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.css }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="菜单类型"
        width="150"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.typesName }}</span>
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
        label="排序"
        width="100"
        align="left"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        label="操作"
        width="250"
        align="right"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div style="display: flex;justify-content: flex-end;">
            <el-button
              key="添加"
              size="mini"
              icon="el-icon-plus"
              @click="handelClick('添加',row)"
            >添加</el-button>
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
          <el-col :span="11">
            <el-form-item
              label="菜单名称"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入菜单名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="菜单路由"
              prop="url"
            >
              <el-input
                v-model="ruleForm.url"
                placeholder="请输入菜单路由"
              />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="20">

          <el-col :span="11">
            <el-form-item
              label="菜单路径"
              prop="path"
            >
              <el-input
                v-model="ruleForm.path"
                placeholder="请输入菜单路径"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="菜单样式"
              prop="url"
            >
              <el-input
                v-model="ruleForm.css"
                placeholder="请输入菜单样式"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="所属应用"
              prop="clientId"
            >
              <el-select
                v-model="ruleForm.clientId"
                clearable
                multiple
                collapse-tags
                placeholder="请选择所属应用"
              >
                <el-option
                  v-for="item in clientSelectList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="是否隐藏"
              prop="conceal"
            >
              <el-radio
                v-model="ruleForm.conceal"
                :label="1"
              >是</el-radio>
              <el-radio
                v-model="ruleForm.conceal"
                :label="0"
              >否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="菜单类型"
              prop="types"
            >
              <el-select
                v-model="ruleForm.types"
                clearable
                placeholder="请选择菜单类型"
              >
                <el-option
                  v-for="item in menuTypeList"
                  :key="item.enumCode"
                  :label="item.enumName"
                  :value="item.enumCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="显示顺序"
              prop="sort"
            >
              <el-input
                v-model="ruleForm.sort"
                placeholder="请输入显示顺序"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="上级菜单"
              prop="parentId"
              class="parent-tree"
            >
              <treeselect
                v-model="ruleForm.parentId"
                placeholder="请选择上级菜单"
                :multiple="false"
                :options="parentMenuList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="固定展示"
              prop="affix"
            >
              <el-radio
                v-model="ruleForm.affix"
                :label="1"
              >是</el-radio>
              <el-radio
                v-model="ruleForm.affix"
                :label="0"
              >否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="全屏展示"
              prop="fullScreen"
            >
              <el-radio
                v-model="ruleForm.fullScreen"
                :label="1"
              >是</el-radio>
              <el-radio
                v-model="ruleForm.fullScreen"
                :label="0"
              >否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="子菜单位置"
              prop="childLayout"
            >
              <el-radio
                v-model="ruleForm.childLayout"
                :label="1"
              >左侧</el-radio>
              <el-radio
                v-model="ruleForm.childLayout"
                :label="0"
              >头部</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              label="内嵌框架"
              prop="iframeType"
            >
              <el-radio
                v-model="ruleForm.iframeType"
                :label="1"
              >内嵌</el-radio>
              <el-radio
                v-model="ruleForm.iframeType"
                :label="0"
              >外嵌</el-radio>
              <el-radio
                v-model="ruleForm.iframeType"
                :label="null"
              >非嵌入框架</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="嵌入地址"
              prop="iframeUrl"
            >
              <el-input
                v-model="ruleForm.iframeUrl"
                placeholder="请输入显示顺序"
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

  </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Cookies from 'js-cookie'
import menuApi from '@/api/right/menu'
import { Message } from 'element-ui'
export default {
  components: { Treeselect },
  data() {
    return {
      name: '',
      listLoading: true,
      dialogFormVisible: false,
      dialogTitle: '新增服务',
      list: [],

      ruleForm: {
        name: '',
        url: '',
        css: '',
        parentId: '',
        clientName: '',
        clientId: '',
        sort: '',
        types: '',
        conceal: '',
        affix: '',
        childLayout: '',
        fullScreen: '',
        iframeUrl: '',
        iframeType: '',
        path: ''
      },

      menuTypeList: [],
      clientSelectList: [],

      parentMenuList: [],

      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        types: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ],
        conceal: [
          { required: true, message: '请选择是否显示', trigger: 'blur' }
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
    this.getMenuType()
    this.getClientSelect()
    this.getParentMenuTree()
  },
  methods: {

    async getMenuType() { // 菜单类型
      await menuApi.getMenuType().then((response) => {
        const { data } = response
        this.menuTypeList = data
      })
    },
    async getClientSelect() { // 所属应用
      await menuApi.getClientSelect().then((response) => {
        const { data } = response
        this.clientSelectList = data
      })
    },
    async getParentMenuTree() { // 上级菜单
      await menuApi.getParentMenuTree().then((response) => {
        const { data } = response
        this.parentMenuList = data
      })
    },
    async loadTable() {
      await menuApi.getSysMenuTableTree({ name: this.name }).then((response) => {
        const { data } = response
        this.list = data
        this.listLoading = false
      }).catch(error => error)
    },
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.clientId = this.ruleForm.clientId.join(',')
          menuApi.saveOrUpdate({ ...this.ruleForm }).then((response) => {
            Message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            if (response.code === 200) {
              this.listLoading = true
              this.loadTable()
            }
          }).catch(error => error)
          this.dialogFormVisible = false
        } else {
          console.log('验证出错')
          return false
        }
      })
    },
    openNew() {
      this.dialogTitle = '新增服务'
      this.dialogFormVisible = true
      for (const k of Object.keys(this.ruleForm)) {
        this.ruleForm[k] = ''
      }
    },
    handelClick(item, row) {
      if (item === '添加') {
        this.dialogTitle = '修改服务'
        this.dialogFormVisible = true
        this.ruleForm = { ...row }
        this.ruleForm.clientId = this.ruleForm.clientId.split(',')
        this.ruleForm.id = ''
      } else if (item === '修改') {
        this.dialogTitle = '修改服务'
        this.dialogFormVisible = true
        this.ruleForm = { ...row }
        this.ruleForm.clientId = this.ruleForm.clientId.split(',')
      } else if (item === '删除') {
        this.$confirm('确认删除吗？')
          .then(_ => {
            menuApi.deleteMenu({ id: row.id }).then((response) => {
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
.parent-tree {
  .vue-treeselect__control {
    line-height: 32px;
    height: 32px;
  }
}
</style>
