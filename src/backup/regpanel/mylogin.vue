<template>
      <div class="left-content"></div>
      <div class="right-content">
        <div class="title active">登录</div>
        <div class="title">注册</div>
        <div class="form">
          <label>
            <input class="phone" type="text" name="phone" placeholder="请输入手机号" v-model="phone">
          </label>
          <label>
            <input class="password" type="text" name="password" placeholder="请输入密码" v-model="password">
          </label>
          <label>
            <input class="catha" type="text" name="catha" placeholder="请输入验证码" v-model="captha">
            <span class="send-verify">发送验证码</span>
          </label>
          <div class="bottom">
            <p><a class="forget">忘记密码</a></p>
            <p><input class="check" type="radio"><span>记住密码</span></p>
          </div>
          <div class="button-bar">
            <button class="btn-login">登录</button>
          </div>
        </div>
      </div>
</template>
<script>
export default {
  name: 'Login'
}
</script>
<style lang="less" scoped>
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
</style>