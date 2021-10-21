<template>
  <div id="container">
    <div class="wrap">
      <div class="left-content"></div>
      <div class="right-content">
        <div class="title active">登录</div>
        <div class="title click-pointer" @click="goRegister">注册</div>
        <div class="form">
          <label>
            <input  class="telephone" type="text" name="telephone" placeholder="请输入手机号" v-model="telephone">
            <span class="small-option" @click="clearInput(telephone)" v-show="opShow">×</span>
          </label>
          <label>
            <input  class="password" type="password" name="password" placeholder="请输入密码" v-model="password">
            <span class="small-option"  @click="clearInput(password)" v-show="opShow">×</span>
          </label>
          <label>
            <input class="catha" type="text" name="catha" placeholder="请输入验证码">
            <span class="small-option send-verify click-pointer">发送验证码</span>
          </label>
          <div class="bottom">
            <p><a class="forget click-pointer" @click="goPassword">忘记密码</a></p>
            <p><input class="check" type="radio"><span>记住密码</span></p>
          </div>
          <div class="button-bar">
            <button class="btn-login click-pointer" @click="login">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import apiServer from '../../api/apiServer.js'
//import apiUrl,{API} from '../../api/apiUrl.js'
import md5 from 'js-md5';
import axios from "axios";
export default {
  components:{
    // Login,Register,ForgetPassword
  },
  beforeCreate() {
  // window.sessionStorage.clear()

  },
  created() {
    this.token = apiServer.getCookie('access_token')
    this.telephone = apiServer.getCookie('telephone')
    this.password = apiServer.getCookie('password')
    if(this.token === sessionStorage.getItem('access_token')){
      this.$router.push({path:'/index'});
      //window.location.href = '/index'
      console.log('cookieToken',this.token)
      console.log('sessionToken',sessionStorage.getItem('access_token'))
    }else{
      window.sessionStorage.clear()
      console.log('cookieToken',this.token)
      console.log('sessionToken',sessionStorage.getItem('access_token'))
    }
    if(this.telephone && this.password){
      this.opShow = true
    }else{
      this.opShow = false
    }
  },
  methods:{
    login(){
      let that = this;
      console.log(this.telephone);
      console.log(md5(this.password));
      let md5Password = md5(this.password);
      apiServer.postData({
        url:'/user/login',
        data: {
          telephone: md5(that.telephone),
          password: md5(that.password),
        },
      },function(data){
        console.log(data);
        if(data.resultCode===1){
          console.log(data.data);
          // that.userId = data.data.userId;
          that.token = data.data.access_token;
          console.log("uid"+data.data.userId);
          window.sessionStorage.setItem("userId",JSON.stringify(data.data.userId));
          window.sessionStorage.setItem("access_token",data.data.access_token);
          window.sessionStorage.setItem("nickName",data.data.nickname);
          window.sessionStorage.setItem("sex",JSON.stringify(data.data.sex));
          window.sessionStorage.setItem("birthday",JSON.stringify(data.data.birthday));
          window.sessionStorage.setItem("telephone",that.telephone);
          window.sessionStorage.setItem("Usersetting",JSON.stringify(data.data.settings));
          window.sessionStorage.setItem("login",JSON.stringify(data.data.login));
          window.sessionStorage.setItem("password",md5Password);
          apiServer.setCookie("telephone",that.telephone,356)
          apiServer.setCookie("password",that.password,356)
          apiServer.setCookie("access_token",that.token,356)
          // if(data.data.access_token === sessionStorage.getItem('access_token')){
            that.$router.push({path:'/index'});
          // }else{
          //   window.sessionStorage.clear()
          // }
        }else{
          // console.log(data.resultMsg);
          window.sessionStorage.clear()
          that.Please=data.resultMsg||"请求错误";
          that.show=true;
          // that.$router.push({path:'/index'});
        }
      })

    },
    goRegister(){
      this.$router.push({path:'/register'});
    },
    goPassword(){
      this.$router.push({path:'/getpassword'});
    },
    clearInput(item){
      if(item === this.telephone){
        this.telephone= ''
      }else if(item === this.password){
        this.password = ''
      }
    },
    // userLogin(){
    //   this.$store.dispatch('login')
    // }
  },
  data() {
    return {
        telephone:'',
        password:'',
        token:'',
        opShow:false
    }
  },
  name: 'LoginPanel',

}
</script>
<style lang="less" scoped>
.click-pointer{
  cursor: pointer;
}
#container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #e6e6e6;
  .wrap{
    background: #ffffff url("../../../dist/images/bg.png") no-repeat;
    background-size: auto 600px;
    width: 830px;
    height: 600px;
    border-radius: 10px;
    display: flex;
  }
  .left-content {
    width: 50%;
  }
  .right-content{
    width: 50%;
    padding: 20px;
    text-align: center;
    .title {
      display: inline-block;
      width: 142px;
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      margin: 70px 0;
      position: relative;
      &.active{
        color: #00C9B2;
        &:after {
          content: "";
          background: #00c9B2;
          position: absolute;
          width: 60px;
          height: 4px;
          bottom: 0;
          border-radius: 6px;
          left: 50%;
          transform: translate(-50%, 14px);
        }
      }

    }
    .form{
      label {
        position: relative;
        input{
          margin: 12px;
          width: 290px;
          height: 40px;
          border-radius: 32px;
          background: #F6F7FB;
          border: none;
          padding: 9px 20px;
          color: #AEB7C1;
          outline: none;

        }
        .small-option {
          position: absolute;
          right: 36px;
          top: -1px;
          color: #00C9B2;
        }
      }
      .bottom p:nth-child(2) {
        text-align: right;
      }

      .bottom p {
        display: inline-block;
        text-align: left;
        width: 135px;
        margin: 0;
        font-size: 14px;
      }
    }
    .button-bar{
      margin-top: 48px;
      .btn-login {
        font-size: 16px;
        width: 290px;
        height: 40px;
        color: #ffffff;
        border-radius: 48px;
        border: navajowhite;
        background: linear-gradient(
            135deg
            , #00E699 0%, #1CD0BB 100%);
      }
    }


  }
}
</style>