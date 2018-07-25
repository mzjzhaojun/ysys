<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
                <el-breadcrumb-item>基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
          <el-button  type="success" icon="add" class="handle-del mr10" @click="addEquipment('ruleForm')">新增</el-button>
            <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                <el-option key="1" label="广东省" value="广东省"></el-option>
                <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange" :height='fullHeight'>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="user.id" label="日期" sortable width="150">
            </el-table-column>
            <el-table-column prop="user.username" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="user.password" label="地址">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small"
                            @click="handleEdit(scope)">编辑</el-button>
                    <el-button size="small" type="danger"
                            @click="handleDelete(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="pageCount">
            </el-pagination>
        </div>
      <!--新增和编辑-->
      <el-dialog
        :title="titleMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :before-close="closeDialog"
      >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="账号" prop="username">
            <el-input v-model="ruleForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="ruleForm.sex" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="okDialog('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                fullHeight: 0,
                pageCount:0,
                addUrl:"",//新增的url
                editUrl:"",//修改的url
                dialogFormVisible:false,
                ruleForm:{
                  username:"",
                  password:"",
                  sex:"",
                  user_img:"",
                  state:"",
                  version:"",
                },
                //新增or编辑弹框标题
                titleMap: {
                  addButton:'新增用户',
                  editButton: "修改用户"
                },
                //判断进入的是新增页面或修改页面的按钮
                dialogStatus: "",
                rules: {//输入框规则
                  username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
                  ],
               }

            }
        },
      created:function () {
          var  slef = this;
          slef.getData(1);
          window.fullHeight = document.documentElement.clientHeight - 350;
          if(window.fullHeight > 500){
            slef.fullHeight = window.fullHeight;
          }else {
            slef.fullHeight = 500;
          }
        },
        mounted: function() {
          const that = this;
          window.onresize = () => {
            return (() => {
              window.fullHeight = document.documentElement.clientHeight - 350;
              if(window.fullHeight > 500){
                that.fullHeight = window.fullHeight;
              }else {
                that.fullHeight = 500;
              }
            })()
          },
          that.pageCount = Number(sessionStorage.getItem('pageCount'))*10;
        },
        methods: {
            handleCurrentChange(val){//分页
                this.cur_page = val;
                this.getData(val);
            },
          getData(pageNo){//获取列表数据
            this.$axios.post('http://172.16.30.43:9999/yt/rest/v1/user/', "",{"Page-Number":pageNo,"Page-Size":10,"OrderBy":"id","Dir":"desc"}).then((response) =>{
              this.tableData = response;
            }).catch(function (error) {

            });
          },
          //新增
          addEquipment(formName) {
            if (this.$refs[formName]!==undefined) {
              this.$refs[formName].resetFields();
            }
            //显示弹框
            this.dialogFormVisible = true;
            //新增弹框标题
            this.dialogStatus = "addButton";
          },
          //Dialog取消事件
          cancelDialog(formName){
            this.$refs[formName].resetFields();
            this.dialogFormVisible = false;
            this.ruleForm={brand_right:0}//重置输入框
          },
          //Dialog确定事件
          okDialog(formName){
             if(this.dialogStatus == 'addButton'){
                 console.log(this.addUrl)
             }else if(this.dialogStatus == 'editButton'){
               this.$refs[formName].validate((valid) => {
                 if (valid) {
                   this.$axios.put(this.editUrl, this.ruleForm).then((response) =>{
                     this.dialogFormVisible = false;
                   }).catch(function (error) {

                   });
                 } else {
                   alert('验证失败')
                   return false;
                 }
               });
               /**/
               console.log(this.editUrl)
             }
          },
          //Dialog关闭事件
          closeDialog(done){
            this.ruleForm={brand_right:0}//重置输入框
            done();
          },
          search(){
                this.is_search = true;
            },
          //编辑按钮事件
            handleEdit(scope) {
              const self = this;
              const links = scope.row.links;
              if(links.length != undefined){
                links.forEach(function(currentValue, index){
                    if(currentValue.rel == 'self'){
                      self.editUrl = currentValue.href;
                    }
                })
              }
              console.log(self.editUrl)
              self.$axios.get(self.editUrl, "").then((response) =>{
                  this.ruleForm = response;
                  this.dialogFormVisible = true;
                  //编辑弹框标题
                self.dialogStatus = "editButton";
              }).catch(function (error) {

              });
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            delAll(){
                      const self = this;
                      const deleteArr  = [];
                     length = self.multipleSelection.length;
                     if(length > 0){
                     for (let i = 0; i < length; i++) {
                       deleteArr.push(self.multipleSelection[i].user.id);
                      }
                      //调用删除接口
                      self.multipleSelection = [];//重置选择器
                    }else{
                      self.$message.error('请优先选择要删除内容');
                    }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>
