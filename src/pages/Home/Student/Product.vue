<template>
  <div class="wrap">
   
    <!-- 搜索框 -->
    <div class="search">
      <template>
        <el-select v-model="value"
                   @change="searchResultChange"
                   clearable
                   filterable
                   remote
                   reserve-keyword
                   placeholder="请输学员姓名 "
                   :remote-method="searchInput">
          <el-option v-for="item in searchResult"
                     :key="item.value"
                     :value="item.name">
          </el-option>
        </el-select>
      </template>

      <el-button icon="el-icon-search"
                 @click="search"></el-button>
      <el-button type="success">添加信息</el-button>
    </div>
    <!-- 选择器 -->
    <template class="selset">
      <el-form ref="classForm"
               :model="classForm">
        <el-form-item label="选择班级">
          <el-select @change="selectClasses"
                     @click.native="getAllClasses"
                     v-model="classForm.selectedClass"
                     placeholder="请选择班级">
            <el-option label="全部"
                       value="all">
            </el-option>
            <el-option :label="item"
                       :value="item"
                       :key="index"
                       v-for="(item,index) in classes"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <!-- 表格 -->
    <el-table :data="studentList"
              border
              style="width: 100%">
      <el-table-column prop="avatarUrl"
                       width="100"
                       label="头像">
        <template slot-scope="scope">
          <img width="80px"
               :src="scope.row.avatarUrl"
               alt="">
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="姓名">
      </el-table-column>
      <el-table-column prop="degree"
                       label="学历">
      </el-table-column>
      <el-table-column prop="class"
                       label="班级">
      </el-table-column>
      <el-table-column prop="productUrl"
                       label="项目地址">
      </el-table-column>
      <el-table-column prop=""
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     @click="showEidtorDialog(scope.row)"
                     circle></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog添加框 -->
    <el-dialog title="增加学员项目"
               :visible.sync="dialogVisible">
      <el-form :model="stuForm"
               :rules="stuRules"
               ref="addStuRuleForm">
        <el-form-item label="头像">
          <el-upload class="upload-demo"
                     :limit="1"
                     action="http://106.12.79.128:1901/students/uploadStuAvatar"
                     name="avatar"
                     :on-success="uploadStuAvatar"
                     list-type="picture">
            <el-button size="small"
                       type="primary">点击上传</el-button>
          </el-upload>
          <el-input v-show="false"
                    v-model="stuForm.avatarUrl"
                    placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="姓名"
                      prop="name">
          <el-input v-model="stuForm.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目地址"
                      prop="productUrl">
          <el-input v-model="stuForm.productUrl"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级"
                      prop="class">
          <el-input v-model="stuForm.class"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄"
                      prop="age">
          <el-input v-model="stuForm.age"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市"
                      prop="city">
          <el-input v-model="stuForm.city"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学历"
                      prop="degree">
          <el-input v-model="stuForm.degree"
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="stuForm.description"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmClick('addStuRuleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getStulist } from "@/api"
  export default {
    data() {
      return {
        dialogVisible: false,//用于定义dialog是否显示
        classForm: {
          selectedClass: "",
          class: "H51901",
        },
        value: "",
        classes: [],
        searchResult: [],
        studentList: [], //表格数据
        stuForm: {
          name: "",
          productUrl: "",
          avatarUrl: "",
          class: '',
          age: "",
          city: "",
          degree: "",
          description: ""
        },
        stuRules: {
          name: [
            { required: true, message: '请输入名字', trigger: 'blur' },
          ],
          class: [
            { required: true, message: '请输入班级', trigger: 'blur' },
          ],
          degree: [
            { required: true, message: '请输入学历', trigger: 'blur' },
          ],
          city: [
            { required: true, message: '请输入城市', trigger: 'blur' },
          ],
          productUrl: [
            { required: true, message: '请输入项目地址', trigger: 'blur' },
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'blur' },
          ]
        },
      }
    },
    mounted() {
      this.upDateList()
    },
    methods: {
      upDateList() {//专门用于更新表格中的数据
        getStulist()
          .then(res => {
            if (res.data.state) {
              this.studentList = res.data.data
            } else {
              alert("数据获取出错")
            }
          })
          .catch(err => {
            alert("网络出错")
          })
      },
      searchResultChange() { },
      getAllClasses() { },
      searchInput() { },
      selectClasses() { },
      search() { },
      showAvatar() { },
      uploadStuAvatar() { },//图片上传成功触发的事件
      confirmClick(formName) {//点击dialog确定触发的事件
        console.log(formName);
      },
      showEidtorDialog(row) {
        this.dialogVisible = true;//显示dialog框
        console.log(row)
        //让数据回显 通过row._id向后台发送请求 然后或得到最新的数据 替换this.stuForm
        this.stuForm = { ...row }
      }
    }
  }
</script>
 <style>
  /* 面包屑样式 */
  .bread .el-breadcrumb {
    padding: 10px;
    border-bottom: 1px solid #e4e4e4;
  }
  /* 搜索样式 */
  .search .el-input__inner {
    min-width: 300px !important;
  }
  /* 选择器样式 */
  .search .el-select {
    margin-top: 30px;
  }
  .el-form .el-form-item {
    margin: 22px 0;
  }
  /* 分页器样式 */
  .pagination .el-pagination {
    margin: 20px 40%;
  }
  /* 表格样式 */
  .el-table__row td .cell {
    height: 40px;
  }
</style>