<template>

  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h4>设置</h4>
        <div class="alert" :class="alertShow?'active':''">{{alertNotice}}</div>
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
            <button class="btn-red bottom" @click="logOut()">退出登录</button>
          </div>
          <div class="setting-content" @click="endEdit()">
              <div class="account-set" v-show="cur===0">
                <div class="container">
                  <p class="avatar">
                    <img :src="getMyImg()" width="100px" height="100px">
                  </p>
                  <div class="info-box">
                    <p class="name">
                      姓名：<span v-show="nameHide">{{myNickName}}</span>
                      <input class="name-edit" type="text" v-model="myNickName" v-show="editInput" />
                      <span class="editIcon" @click="editName">{{editFunName}}</span>
                    </p>
                    <p class="sex">
                      性别：
                      <span v-show="sexHide">{{sex}}</span>
                      <span v-show="editRadio">
                        <input type="radio" v-model="sex" value="男"/>男
                        <input type="radio" v-model="sex" value="女" />女
                      </span>
                      <span class="editIcon" @click="editSex">{{editFunSex}}</span></p>
                    <p class="phone">
                      手机号：{{telephone}}<span class="editIcon" style="cursor: not-allowed">锁定</span>
                    </p>
                  </div>
                  <button class="btn-submit" @click="updateInfo">更新资料</button>
                </div>
              </div>
            <div class="privacy-set list-set" v-show="cur===1">
                <div class="sub-title">
                  私隐
                </div>
                  <ul>
                    <li><input type="checkbox" v-model="allowAtt"><span>允许加好友</span></li>
                    <li><input type="checkbox" v-model="friendsVerify"><span>需要好友验证</span></li>
                    <li><input type="checkbox" v-model="isEncrypt"><span>消息加密传输</span></li>
                    <li><button class="btn-submit" @click="saveSetting">保存</button></li>
                  </ul>
            </div>
            <div class="password-set list-set" v-show="cur===2">
              <div class="sub-title">
                密码
              </div>
              <ul>
                <li><input type="text" placeholder="请输入旧密码" v-model="oldPassword"></li>
                <li><input type="text" placeholder="请输入新密码" v-model="newPassword"></li>
                <li><input type="text" placeholder="请确认新密码" v-model="confirmPassword"></li>
                <li><button class="btn-submit" @click="update">修改密码</button></li>
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
import md5 from "js-md5";
import {actions} from "../../store";
import apiServer from "../../api/apiServer";
import apiRequest from "../../api/apiRequest";
export default {
  name: 'Modal',
  props: {},
  data() {
    return {
      cur:0,
      sex:'',
      myNickName:'',
      nickName:'',
      editInput:false,
      editRadio:false,
      nameHide:true,
      sexHide:true,
      editFunName:'编辑',
      editFunSex:'编辑',
      allowAtt:false,
      friendsVerify:false,
      isEncrypt:false,
      oldPassword:'',
      newPassword:'',
      confirmPassword:'',
      alertNotice:'',
      alertShow:false
    }
  },
  computed:{

  },
  updated() {
    let that = this
    if(this.alertShow === true){
      setTimeout(function(){
        that.alertShow = false
        console.log('关闭提示')
      },2000);
    }
  },
  created() {
    //个人信息
    this.myNickName = window.sessionStorage.getItem("nickName");
    this.telephone = window.sessionStorage.getItem("telephone");
    this.sex = window.sessionStorage.getItem("sex")===1?'男':'女'
    //私隐
    let Setting = JSON.parse(window.sessionStorage.getItem("Usersetting"));
    this.allowAtt = Setting.allowAtt === 1
    this.friendsVerify = Setting.friendsVerify === 1
    this.isEncrypt = Setting.isEncrypt === 1
  },
  watch:{

  },
  methods: {
    editName(){
      this.editInput = !this.editInput;
      this.nameHide = !this.nameHide;
      if(this.editInput){
        this.editFunName = '取消'
      }else{
        this.editFunName = '编辑'
        this.myNickName = window.sessionStorage.getItem("nickName")
      }
    },
    editSex(){
      this.editRadio = !this.editRadio;
      this.sexHide = !this.sexHide;
      if(this.editRadio){
        this.editFunSex = '取消'
      }else{
        this.editFunSex = '编辑'
        this.sex = window.sessionStorage.getItem("sex")===1?'男':'女'
      }
    },
    endEdit(){

    },
    closeSelf() {
     this.$emit("closeme");
    },
    logOut(){
      window.sessionStorage.clear();
      this.$router.push({path:'/login'})
      //this.router.next({path:'/'})
      apiServer.setCookie('access_token','',-1)

    },
    getMyImg:function(){
      return apiServer.getAvatarUrl(window.sessionStorage.getItem("userId"));
    },
    //更新个人资料
    updateInfo:function(){
      console.log(this.nickName);
      //console.log(Date.parse(this.birthday)/1000);
      console.log(this.sex);
      let that = this;
      let params={
        //birthday:apiServer.toTimestamp(this.birthday),
        sex:this.sex==="女"?0:1,
        nickname:this.nickName
      }
      apiRequest.updateUser(params,function(result){
        that.show = true;
        if(result.resultCode===1){
          console.log('更新成功')
          //console.log(result.data.birthday);
          //window.sessionStorage.setItem("birthday",JSON.stringify(result.data.birthday));
          window.sessionStorage.setItem("sex",JSON.stringify(result.data.sex));
          window.sessionStorage.setItem("nickName",result.data.nickname);
          that.alertNotice = "更新成功";
          that.alertShow = true
        }else{
          that.alertShow = true
          that.alertNotice = "更新失败";
        }

      })
    },
    //修改私隐
    saveSetting:function(){
      let that=this;
      console.log(that.isEncrypt);
      apiServer.postData({
        url:'/user/settings/update',
        data:{
          allowAtt:that.allowAtt===true?1:0,
          friendsVerify:that.friendsVerify===true?1:0,
          isEncrypt:that.isEncrypt === true?1:0
        }
      },function(data){
        if(data.resultCode===1){
          console.log('请求编辑更新成功');
          that.alertNotice='修改成功';
          that.alertShow = true
          window.sessionStorage.setItem("Usersetting",JSON.stringify(data.data.settings));
        }
      })
    },
    //更新密码
    update:function(){
      if(apiServer.isNull(this.oldPassword)||apiServer.isNull(this.newPassword)||apiServer.isNull(this.confirmPassword)){
        this.alertNotice = "请输入值";
        this.alertShow = true
        return;
      }
      if(this.newPassword.length<6){
        this.alertNotice = "密码长度必须大于6位";
        this.alertShow = true
        return;
      }
      if(this.newPassword!==this.confirmPassword){
        this.alertNotice = "两次输入密码不一致";
        this.alertShow = true
        return;
      }
      if(this.newPassword===this.oldPassword){
        this.alertNotice = "新密码和旧密码不能一致";
        this.alertShow = true
        return;
      }
      let that =this;
      let obj={
        oldPassword:md5(that.oldPassword),
        newPassword:md5(that.newPassword),
        password1:md5(that.confirmPassword)
      }
      apiRequest.updatePassword(obj,function(result){
        // console.log(result);
        if(result.resultCode===1){
          console.log('密码修改成功')
          that.alertNotice="修改成功";
          that.alertShow = true
        }
      });
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
  .alert {
    background: #ff5c5c;
    color: #ffffff;
    border-radius: 4px;
    width: 100px;
    text-align: center;
    padding: 0px 20px;
    height: 30px;
    transform: translate(0,-100px);
    transition: transform 0.3s;
    font-size: 12px;
    line-height: 30px;
    box-shadow: 0px 5px 6px 0px #b4b4b4;
    &.active{
      transform: translate(0,0);
    }
  }
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
  padding: 4px 4px;
  width: 91px;
  border-radius: 4px;
  line-height: 16px;
  margin-top: 24px;
  position: absolute;
  bottom: 58px;
  left: 16px;
  font-size: 12px;
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
    position: relative;
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
    .info-box {
      text-align: left;
      width: 210px;
      margin: 0 auto;
      .editIcon {
        float: right;
        cursor: pointer;
      }
      .name-edit {
        width: 126px;
        border-radius: 4px;
        border: 1px solid #9d9d9d;
        padding: 6px;
      }
      p{
        height: 30px;
        line-height: 30px;
      }
    }
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