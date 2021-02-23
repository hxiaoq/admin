<template>
  <div>
    <div class="filter-container">
      <el-input
        v-model="inputText"
        style="width: 200px; margin-right: 10px"
        placeholder="请输入关键字"
      ></el-input>
      <el-button
        type="success"
        icon="el-icon-search"
        size="small"
        @click="onSubmit"
        >搜索</el-button
      >
      <el-button
        v-permission="['organize:oper:add']"
        type="primary"
        icon="el-icon-plus"
        size="small"
        style="margin-left: 10px"
        @click="modalShow('new', '')"
        >新增</el-button
      >
    </div>
    <el-table
      class="auth-table"
      :data="tableData"
      style="width: 100%; margin: 10px 0"
      row-key="classifyId"
      border
      :tree-props="{ children: 'childComs', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="序号" width="80" type="index"> </el-table-column>
      <el-table-column
        prop="comName"
        label="运维公司名称"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="nameShortcut"
        label="简称"
        width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="classifyType" label="类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ordinalNumber" label="排序" width="100">
      </el-table-column>
      <el-table-column
        width="350"
        label="操作"
        header-align="left"
        align="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['organize:oper:insert']"
            type="success"
            icon="el-icon-plus"
            size="mini"
            @click="modalShow('add', scope.row)"
            >添加</el-button
          >
          <el-button
            v-permission="['organize:oper:update']"
            icon="el-icon-edit"
            size="mini"
            @click="modalShow('edit', scope.row)"
            >修改</el-button
          >
          <el-button
            v-permission="['organize:oper:del']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="onDel(scope.row)"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="modalShow('set', scope.row)"
            ><svg-icon
              icon-class="zidianxiang"
              class-name="icon"
            />设置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="modalText" :visible.sync="dialogVisible" width="674px">
      <el-form
        v-if="!isSet"
        :model="ruleForm"
        ref="ruleForm"
        label-width="90px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="operaComName">
              <el-input
                v-model="ruleForm.operaComName"
                placeholder="请输入运维公司名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简称" prop="nameShortcut">
              <el-input
                v-model="ruleForm.nameShortcut"
                placeholder="请输入运维公司简称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级" prop="parentId">
              <el-select
                v-model="TopOrgLable"
                placeholder="请选择"
                collapse-tags
                style="width: 217px"
                clearable
              >
                <el-option :value="ruleForm.parentId" style="height: auto">
                  <el-tree
                    :data="orgTopArryTemp"
                    node-key="id"
                    ref="tree"
                    :props="defaultProps"
                    @node-click="handleClcik"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型编码" prop="classifyType">
              <el-input
                v-model="ruleForm.classifyType"
                placeholder="请输入类型编码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="ordinalNumber">
              <el-input
                v-model="ruleForm.ordinalNumber"
                placeholder="请输入显示顺序"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row> </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="配置信息" prop="xmlConfig">
              <el-input type="textarea" v-model="ruleForm.xmlConfig"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="save()">保存</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
      <div v-if="isSet">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
          <el-tab-pane label="机构" name="org">
            <el-tree
              class="treeDiv"
              ref="orgSetTree"
              :data="setOrgTree"
              show-checkbox
              node-key="orgId"
              :props="defaultProps1"
              check-strictly
            >
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="账号" name="user">
            <el-tree
              class="treeDiv"
              ref="userSetTree"
              :data="setUserTree"
              show-checkbox
              node-key="id"
              check-strictly
              :props="defaultProps2"
            >
            </el-tree>
          </el-tab-pane>
        </el-tabs>
        <el-form>
          <el-form-item style="text-align: right; margin-top: 20px">
            <el-button type="primary" size="small" @click="saveSet()"
              >保存</el-button
            >
            <el-button size="small" @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
    

<script>
import oper from "@/api/organize/oper.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      inputText: "",
      dialogVisible: false,
      isSet: false,
      tableData: [],
      modalText: "",
      TopOrgLable: "", //上级机构的中文
      orgTopArryTemp: null, //上级数组
      orgTopArry: null,
      setOrgTree: [], //机构树
      setUserTree: [], //人员树
      defaultProps: {
        children: "childOperaComs",
        label: "operaComName",
        id: "classifyId",
      },
      defaultProps1: {
        children: "childOrgs",
        label: "orgName",
        id: "orgId",
      },
      defaultProps2: {
        children: "childOrgs",
        label: "username",
        id: "id",
      },
      ruleForm: {
        classifyId: "", //修改要（id）
        operaComName: "", //名称
        nameShortcut: "", //简称
        parentId: "", //上级
        classifyType: "", //类型编码
        ordinalNumber: null, //排序
        xmlConfig: "", //配置信息
        updateTime: "", //不需要
        createTime: "", //不需要
      },
      rules: {
        operaComName: [
          { required: true, message: "请输入运维公司名称", trigger: "blur" },
        ],
        classifyType: [
          { required: true, message: "请输入类型编码", trigger: "blur" },
        ],
      },
      activeName: "org", //tab
      tabName: "org",
      defaultKeys: [], //默认选中的树
    };
  },
  mounted() {
    this.getData("", "");
    this.getOrgTopList();
  },
  methods: {
    getData(name, id) {
      // if (this.inputText != "") {
      oper.getOperaComListByName({ comName: name, id: id }).then((response) => {
        this.tableData = response.data;
      });
      // } else {
      //   oper.getTableList({ comName: name, id: id }).then((response) => {
      //     this.tableData = response.data;
      //   });
      // }
    },
    onSubmit() {
      this.getData(this.inputText, "");
    },
    //  懒加载表格树
    // load(tree, treeNode, resolve) {
    //   oper.getTableList({ id: tree.classifyId }).then((response) => {
    //     resolve(response.data);
    //   });
    // },
    modalShow(type, data) {
      this.dialogVisible = true;
      if (type == "set") {
        this.modalText = "设置";
        this.isSet = true;
        this.activeName = "org";
        this.getSetOrgTree(data);
        this.getSetUserTree(data);
        this.ruleForm.classifyId = data.classifyId;
      } else {
        this.TopOrgLable = "";
        this.ruleForm.parentId = ""; //清空下拉树
        this.orgTopArryTemp = this.orgTopArry;
        this.$nextTick(() => {
          this.resetForm("ruleForm");
        });
        this.isSet = false;
        if (type == "new") {
          this.modalText = "新增";
          ``;
          this.ruleForm.classifyId = null;
        } else if (type == "add") {
          this.modalText = "添加";
          this.ruleForm.classifyId = null;
          this.TopOrgLable = data.comName;
          this.ruleForm.parentId = data.classifyId;
        } else if (type == "edit") {
          this.modalText = "修改";
          this.getEditData(data);
        }
      }
    },

    onDel(data) {
      var that = this;
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        oper.del({ comId: data.classifyId }).then((response) => {
        
          if (response.msg == "请先删除下属机构") {
            this.$message.error("请先删除下属机构!");
          } else {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getData(that.inputText, "");
          }
        });
      });
    },
    // 上级列表
    getOrgTopList() {
      oper.getOrgTopList().then((response) => {
        this.orgTopArry = response.data;
      });
    },
    // 下拉树方法
    handleClcik(data) {
      this.ruleForm.parentId = data.classifyId;
      this.TopOrgLable = data.operaComName;
    },
    //编辑获取数据
    getEditData(data) {
      oper.getEditData({ comId: data.classifyId }).then((response) => {
        var tempData = response.data;
        this.TopOrgLable = tempData.parentName;
        this.ruleForm.parentId = tempData.parentId;
        this.ruleForm = { ...response.data };
      });
    },
    // 保存表单
    save() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$confirm("是否确认提交?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            oper.save(this.ruleForm).then((response) => {
              this.$message({
                type: "success",
                message: "保存成功!",
              });
              this.dialogVisible = false;
              this.getData(this.inputText, "");
            });
          });
        } else {
          return false;
        }
      });
    },

    //取消保存
    cancel() {
      //this.resetForm("ruleForm");
      this.dialogVisible = false;
    },
    //  tab切换
    tabClick(tab, event) {
      this.tabName = tab.name;
    },

    // 获取机构树（设置）
    getSetOrgTree(data) {
      oper.getSetOrgTree({ comId: data.classifyId }).then((response) => {
        this.setOrgTree = response.data;
        let defaultKeysArry = this.setSelectEdTree(
          this.setOrgTree,
          "orgId",
          "childOrgs",
          "selectEd"
        );
        this.$refs.orgSetTree.setCheckedKeys(defaultKeysArry);
      });
    },
    // 获取人员树（设置）
    getSetUserTree(data) {
      oper.getSetUserTree({ comId: data.classifyId }).then((response) => {
        this.setUserTree = response.data;
        let defaultKeysArry = this.setSelectEdTree(
          this.setOrgTree,
          "orgId",
          null,
          "userIdIn"
        );
        this.$refs.userSetTree.setCheckedKeys(defaultKeysArry);
      });
    },

    // 保存人员和账号
    saveSet() {
      this.$confirm("是否确认提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.tabName == "org") {
          var params = {
            classifyId: this.ruleForm.classifyId,
            orgIds: this.$refs.orgSetTree.getCheckedKeys().join(","),
          };
          oper.saveOrg(params).then((response) => {
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            this.dialogVisible = false;
            this.getData(this.inputText, "");
          });
        } else if (this.tabName == "user") {
          var params = {
            classifyId: this.ruleForm.classifyId,
            userIds: this.$refs.userSetTree.getCheckedKeys().join(","),
          };
          oper.saveUser(params).then((response) => {
            console.log(response);
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            this.dialogVisible = false;
            this.getData(this.inputText, "");
          });
        }
      });
    },
    setSelectEdTree(datas, id, children, selectEd) {
      //遍历树  获取id数组
      var defaultKeys = [];
      for (var i in datas) {
        if (datas[i].selectEd >= 0) {
          defaultKeys.push(datas[i].id);
        }
        if (datas[i].children) {
          this.setSelectEdTree(datas[i].children);
        }
      }
      return defaultKeys;
    },

    // 清空表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 30px 40px 30px 20px;
}
.auth-table {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 5px 10px;
  }
}
.icon {
  margin-right: 5px;
}
.treeDiv {
  height: 200px;
  overflow: auto;
}
</style>