<template>
  <div id="container">
    <div class="wrap">
      <div class="left-content"></div>
      <div class="right-content">
        <div class="title">忘记密码</div>
        <div class="form">
          <label>
            <input class="phone" type="text" name="phone" placeholder="请输入手机号">
          </label>
          <label>
            <input class="password" type="text" name="password" placeholder="请输入新密码">
          </label>
          <label>
            <input class="password" type="text" name="password" placeholder="请确认输入密码">
          </label>
          <label>
            <input class="catha" type="text" name="catha" placeholder="请输入验证码">
            <span class="send-verify click-pointer">发送验证码</span>
          </label>
          <div class="bottom">
            <p><a class="forget click-pointer" @click="goRegister">注册新账号</a></p>
            <p><a class="goLogin click-pointer" @click="goLogin">已有账号，去登录</a></p>
          </div>
          <div class="button-bar">
            <button class="btn-login click-pointer">修改密码</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  methods:{
    goLogin(){
      this.$router.push({path:'/login'});
    },
    goRegister(){
      this.$router.push({path:'/register'});
    },
  },
  name: 'ForgetPassword'
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
        margin: 42px 0;
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
          .send-verify {
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
}
</style>