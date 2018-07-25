<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;"></p>
            </el-form>
        </div>
    </div>
</template>

<script>
  import CryptoJS from 'crypto-js'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            getResult(str){
              var key1 = "iqPdPo5efyo3pLBvqFZ0y2lGenzp52Th0XcZaeH03fqizEWKbGJhxXST4s4svaYN";
              var keyHex = CryptoJS.enc.Utf8.parse(key1);
              var encrypted = CryptoJS.DES.encrypt(str, keyHex, {
                iv:CryptoJS.enc.Utf8.parse(key1),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
              });
              return encrypted.ciphertext.toString();
            },
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        //md5加密
                       /* console.log(this.getResult(this.ruleForm.username))*/
                        window.sessionStorage.setItem('ms_user','1019103151179046912');
                      if(window.sessionStorage.getItem('ms_user') != null){
                        const user_id = window.sessionStorage.getItem('ms_user');

                        //获取菜单
                        self.$axios.get('http://172.16.30.43:9999/yt/rest/v1/role/sysall/1019103151179046912', "").then((response)=>{
                            if(response != undefined){
                              const ms_menus_str = JSON.stringify(response);
                              window.sessionStorage.setItem('ms_menus',ms_menus_str);
                              self.$router.push('/'+response[0].url);
                            }
                        }).catch((error) =>{

                        });
                      }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
