<template>
  <div class="login">
    <el-form :model="loginForm"
             status-icon
             :rules="rules"
             ref="loginForm"
             label-width="100px"
             class="form">

      <el-form-item label="用户名"
                    prop="username">
        <el-input type="text"
                  v-model="loginForm.username"
                  autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码"
                    prop="password">
        <el-input type="password"
                  v-model="loginForm.password"
                  @keydown.native.enter="submitForm('loginForm')"
                  autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('loginForm')">登入</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
  import { login } from "@/api"
  export default {
    data() {
      var validateUsn = (rule, value, callback) => {
        //console.log(rule, "==========")//当前的规则对象
        //console.log(value, "========")//输入的值
        //console.log(callback())//回调函数 里面传参就报错 ,不传参表示通过校验
        var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
        let res = uPattern.test(value)
        if (res) {
          callback()
        } else {
          callback("用户名必须是4到16位(字母，数字，下划线，减号)")
        }
      };

      var validatePass = (rule, value, callback) => {
        //字母+数字+特殊字符
        // let reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/
        // let res = reg.test(value)
        // if (res) {
        //   callback()
        // } else {
        //   callback("密码必须是字母+数字+特殊字符")
        // }
        if (!value) {
          callback("请输入密码")
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { validator: validateUsn, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          //本地rules全部校验通过之后 valid的值就是true 不然是false
          if (valid) {
            //验证通过 开启loading动画
            const loading = this.$loading({
              lock: true,
              text: '正在登入...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            //这个判断表示本地校验通过 可以在此处发请求
            let { username, password } = this.loginForm
            login(username, password)
              .then(res => {
                if (res.data.state) {
                  //登入成功 
                  let { nickname } = res.data.userInfo
                  //5.将nickname存到vuex的state
                  this.$store.commit("SET_NICKNAME", nickname)
                  //1.将token存储在本地
                  localStorage.setItem("qftoken", res.data.token)
                  //2.页面跳转到home
                  this.$router.push("/")
                  //3.将用户信息存在本地
                  localStorage.setItem("nickname", nickname)
                  //4.关闭登入动画
                  loading.close()
                  this.$message({
                    showClose: true,
                    message: '登入成功',
                    type: 'success'
                  });
                } else {
                  loading.close()
                  this.$message({
                    showClose: true,
                    message: '用户名或者密码错误',
                    type: 'error'
                  });
                }
              }).catch(err => {
                loading.close()
                this.$message({
                  showClose: true,
                  message: '网络错误',
                  type: 'warning'
                });
                console.error("time out")
              })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    background: #2f4050;
    position: fixed;
    .form {
      box-sizing: border-box;
      border-radius: 10px;
      width: 500px;
      padding: 50px 100px 15px 20px;
      margin: 200px auto;
      background: #fff;
      text-align: center;
      .login-img {
        position: relative;
        left: 10%;
        width: 120px;
        height: 120px;
        margin-left: -60px;
        margin-top: -60px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 10px solid #fff;
        box-shadow: 0 1px 5px #ccc;
        overflow: hidden;
      }
      .btn {
        width: 100%;
      }
    }
  }
  .lizi {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .el-form-item__content {
    text-align: center;
  }
</style>
