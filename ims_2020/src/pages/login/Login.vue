<template>
  <div class="wrap">
    <div class="loginBox">
      <el-col class="loginBoxLeft">
        <div style="text-align:left;">
          <img src="@/assets/images/logo_winglong.png"/>
          <h3>智慧营销平台</h3>
        </div>
      </el-col>
      <el-col :span="6" class="loginBoxRight">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-form-item
            label=""
            prop="username"
          >
            <el-input
              type="text"
              placeholder="用户名:admin"
              v-model="ruleForm.username"
              prefix-icon="el-icon-user"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label=""
            prop="password"
          >
            <el-input
              type="password"
              placeholder="密码:admin"
              prefix-icon="el-icon-lock"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
              label=""
              class="selectIcon"
            >
            <i class="el-input__icon el-icon-bangzhu" style="position: absolute;z-index: 999;color: #C0C4CC;padding-left: 5px;"></i>
              <el-select v-model="ruleForm.language" style="width: 100%;">
                <el-option
                  v-for="item in cities"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" style="padding-left:30px;">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </div>

  </div>
  
</template>
<script>
import * as Api from '../../api/ManageApi';


export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if(value !== 'admin'){
           callback(new Error('密码错误！'));
        }
        // 判断
        callback();
      }
    };
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else {
        if(value !== 'admin'){
           callback(new Error('用户名错误！'));
        }
        // 判断
        callback();
      }
    };
    return {
      ruleForm: {
        username: '',
        password: '',
        language:'Chinese'
      },
      rules: {
        username: [
          //{ required: true, message: '请输入用户名', trigger: 'blur' }
          { validator: validateUser, trigger: 'blur' }
        ],
        password: [
          // { required: true, message: '请输入密码', trigger: 'blur' }
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      cities: [{
        value: 'Chinese',
        label: '中文'
      }, {
        value: 'Cantonese',
        label: '繁體'
      }, {
        value: 'English',
        label: '英文'
      }]


    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            REQ_HEAD: {
              TransServiceCode: 'SELECT_ID',
              userId:'',
              branchId:'',
              pageNo:1,
            },
            BEQ_BODY:{
              password: this.ruleForm.password,
              username: this.ruleForm.username,
              language: this.ruleForm.language,
            }
          }
          this.$router.push({
            name: 'CustomerSelection' 
          });
          Api.login(params).then((res) => {
            if (res) {
              this.$router.push({
                name: 'CustomerSelection' 
              });
                localStorage.setItem('username', JSON.stringify(this.ruleForm.username))
                console.log("AAAA"+localStorage.getItem('username'))
                console.log("BBBB"+this.ruleForm.username)
                this.$emit('successLogin',this.ruleForm.username)
            } else {
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

  }
}

</script>
<style src='./login.css'></style>