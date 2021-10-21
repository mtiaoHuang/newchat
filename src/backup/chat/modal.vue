<template>

  <div class="modal-backdrop">
    <div class="modal" :style="mainStyles">
      <div class="modal-header">
        <h4>设置</h4>
        <div class="win-tool">
          <button type="button" class="btn-close" @click="closeSelf">X</button>
        </div>
      </div>
      <div class="modal-body">
        <div class="setting-box">
          <div class="setting-title">
            <ul>
            <li @click="cur=0" :class="{active:cur===0}">账号设置</li>
            <li @click="cur=1" :class="{active:cur===1}">私隐设置</li>
            <li @click="cur=2" :class="{active:cur===2}">修改密码</li>
            </ul>
          </div>
          <div class="setting-content">
              <div class="account-set" v-show="cur===0">
                <div class="container">
                  <p class="avatar">
                    <img :src="user.img" width="100px" height="100px">
                  </p>
                  <p class="name">
                    {{user.name}}
                  </p>
                  <p class="phone">
                    手机号：13000012345
                  </p>
                  <button class="btn-red">退出登录</button>
                </div>
              </div>
            <div class="privacy-set list-set" v-show="cur==1">
                <div class="sub-title">
                  私隐
                </div>
                  <ul>
                    <li><input type="checkbox"><span>允许加好友</span></li>
                    <li><input type="checkbox"><span>需要好友验证</span></li>
                    <li><input type="checkbox"><span>消息加密传输</span></li>
                  </ul>

            </div>
            <div class="password-set list-set" v-show="cur===2">
              <div class="sub-title">
                密码
              </div>
              <ul>
                <li><input type="text" placeholder="请输入旧密码"></li>
                <li><input type="text" placeholder="请输入新密码"></li>
                <li><input type="text" placeholder="请确认新密码"></li>
                <li><button class="btn-submit">修改密码</button></li>
              </ul>

            </div>
          </div>
        </div>
      </div>
      <!--<div class="modal-footer">

        <button type="button" class="btn-confirm" @click="confirm">确认</button>
      </div>-->
    </div>
  </div>
</template>

<script>

import {actions} from "../../store";

export default {
  vuex: {
    actions: actions,
    getters: {
      user: ({ user }) => user,
      filterKey: ({ filterKey }) => filterKey
    }
  },
  name: 'Modal',
  props: {},
  data() {
    return {
      cur:0,
    }
  },
  methods: {
    closeSelf() {
     this.$emit("closeme");
    }
  }
}
</script>

<style scoped lang="less">
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal {
  background-color: #fff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x:auto;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  width: 538px;
  height: 456px;
}
.modal-header {
  border-bottom: 1px solid #eee;
  color: #313131;
  justify-content: space-between;
  padding: 15px;
  display: flex;
  h4 {
    margin: 10px;
  }
}
.modal-footer {
  border-top: 1px solid #eee;
  justify-content: flex-end;
  padding: 15px;
  display: flex;
}
.modal-body {
  position: relative;
  padding: 20px 10px;
  height: 100%;
}
.btn-close, .btn-confirm {
  border-radius: 8px;
  margin-left:16px;
  width:56px;
  height: 36px;
  border:none;
  cursor: pointer;
}
.btn-close {
  color: #313131;
  background-color:transparent;
}
.btn-confirm {
  color: #fff;
  background-color: #2d8cf0;
}
button.btn-red {
  background: #FF5C5C;
  border: none;
  color: #ffffff;
  padding: 2px 4px;
  width: 126px;
  border-radius: 4px;
  line-height: 26px;
  margin-top: 26px;
}
button.btn-submit {
  background: #00C9B2;
  border: none;
  color: #ffffff;
  padding: 4px;
  width: 168px;
  border-radius: 4px;
}
.setting-box {
  display: flex;
  height: 100%;
  .setting-title {
    padding: 10px;
    border-right: 1px solid #ddd;
    width: 160px;
    text-align: center;
    cursor: pointer;
    li{
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 8px;
      &.active{
        color: #00C9B2;
        position: relative;
        &:after {
          content: "";
          width: 5px;
          height: 100%;
          background: #00c9b2;
          position: absolute;
          right: -10px;
        }
      }
    }
  }
  .setting-content{
    text-align: center;
    width: 100%;
    p{
      &.name{
        font-weight: bold;
      }
    }
    .list-set{
      width: 300px;
      display: flex;
      .sub-title {
        width: 90px;
        margin-top: 5px;
        font-weight: 600;
      }
      ul{
        li{
          text-align: left;
          line-height: 2.5;
        }

      }

    }
    .password-set{
      ul{
        margin-left: 20px;
      }
      input{
        width: 168px;
        height: 26px;
        background: #F2F2F2;
        border-radius: 4px;
        border: 1px solid #f2f2f2;
        padding: 3px 16px;
        color:#AEB7C1;
      }
    }
  }
}

</style>