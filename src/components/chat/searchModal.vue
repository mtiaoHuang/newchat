<template>
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <button class="btn-muted" @click="backTo" v-if="isUserInfo">返回</button>
        <h4>{{header}}</h4>
        <div class="win-tool">
          <button type="button" class="btn-close" @click="closeSelf">X</button>
        </div>
      </div>
      <div class="modal-body" v-if="isSearch">
        <div class="search-bar">
          <input class="search-panel" v-model="keyWord"/>
          <button type="button" class="btn-submit" @click="search">搜索</button>
        </div>
        <div class="search-list">
          <vuescroll>
            <ul class="searchObj">
              <li v-for="(item,key,index) in items" @click="toUserInfo(item)">
                <div class="content">
                  <img class="avatar" :src="item.avatar" width="36px" height="36px" :onerror='imgError'>
                  <div class="userName">{{item.nickname}}</div>
                </div>
              </li>
            </ul>
          </vuescroll>
        </div>
      </div>
      <div class="modal-body" v-if="isUserInfo">
        <div class="search-user-info">
          <div class="set-friend">
            <img :src="toNewUser.avatar" width="80px" height="80px">
            <div class="friend-name"><strong>{{toNewUser.nickname}}</strong></div>
            <hr>
            <dl>
              <dt>性别</dt>
              <dd>{{toNewUser.sex === 1?'男':'女'}}</dd>
            </dl>
            <dl>
              <dt>生日</dt>
              <dd>{{userInfo.birthday | dateFormat}}</dd>
            </dl>
            <hr>
          </div>
          <div class="button-set">
            <button class="btn-submit" @click="addNewFriend" v-if="addFriend">添加好友</button>
            <button class="btn-submit" @click="addNewFriend" v-if="isFriend">发送消息</button>
          </div>
        </div>
      </div>
<!--      <div class="modal-footer">-->

<!--      </div>-->
    </div>
  </div>
</template>

<script>
import apiServer from "../../api/apiServer";
import apiRequest from "../../api/apiRequest";
import vuescroll from "vuescroll";
import moment from 'moment';
import store from "../../store";
export default {
  components:{vuescroll},
  data(){
    return{
      header:'查找好友',
      keyWord:'',
      isUserInfo:false,
      isSearch:true,
      items:[],
      userInfo:[],
      toNewUser:[],
      addFriend:false,
      isFriend:false,
      imgError:'this.src="' + require('../../../dist/images/download.png') + '"',
    }
  },
  created(){
    let that =this;

  },
  filters:{
    dateFormat(val){
      return moment(val).calendar();
    }
  },
  methods:{
    closeSelf() {
      this.$emit("closeSearch");
    },
    getUserInfo(){
      let that = this
      apiRequest.getUser(store.state.toNewUser.userId,function(result){
        console.log(result);
        that.birthday = apiServer.toDate(result.birthday);
        // that.avatar =  apiServer.getAvatarUrl(store.state.toNewUser.userId);
        that.avatar =  store.state.toNewUser.avatar;
        that.nickName = result.nickname;
        that.sex = result.sex===0?"女":'男';
        that.userInfo = result
        console.log('userinfo',that.userInfo,store.state.toNewUser);
      })
      if(!apiServer.isNull(store.state.friendsMap[store.state.toNewUser.userId])){
        that.isFriend = true;
        that.addFriend = false;
        console.log('是好友')
      }else{
        console.log("不是好友")
        that.addFriend = true;
        that.isFriend = false;
      }
    },
    search:function(){
      let that = this
      console.log("搜索");
      console.log(that.keyWord)
      if(!apiServer.isNull(that.keyWord)){
        apiRequest.nearByUser(that.keyWord,0,20,function(result){
          console.log(result.data);
          that.items = result.data;
          for(let i=0;i<that.items.length;i++){
            that.items[i].avatar = apiServer.getAvatarUrl(that.items[i].userId);
          }
        })
      }

    },
    toUserInfo(item){
      store.commit('setNewUser',item)
      console.log('toNewUser',item)
      this.toNewUser = store.state.toNewUser
      this.isUserInfo = true
      this.isSearch = false
      this.getUserInfo()
    },
    backTo(){
      this.isUserInfo = false
      this.isSearch = true
    },
    addNewFriend:function(){
      let that = this;
      console.log(store.state.toNewUser.userId);
      apiRequest.getUser(store.state.toNewUser.userId,function(result){
        console.log(result)
        if(result.settings.friendsVerify===1){
          // 需要好友验证
          let content = "你好"
          let msg=msgRequest.sendMessage(500,null,null,null,content,result.userId,result.nickname);
          if(!apiServer.isNull(msg)){
            that.Please="打招呼成功，静候回音";
            that.show = true;
          }
        }else{
          console.log("无好友验证");
          //添加到通讯录
          apiRequest.addFriend(result.userId,result.nickname,function(result){
            console.log(result);
            that.addFriend1 = true
            setTimeout(function(){
              that.$router.go(-1)
            },700)
          });
          //存放新朋友信息，更新到消息列表
          let lastChatList = store.state.lastChatList
          let newFriendMsg = apiServer.getOneMsg(result.userId,result.nickname,"我们成为好朋友了，快来聊天吧",508,0)
          lastChatList.unshift(newFriendMsg)
          store.commit('setLastChatMsg',lastChatList)
        }
      })
    },
  },
  name: "searchModal"
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
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  width: 362px;
  height: 530px;
}
.modal-header {
  border-bottom: 1px solid #eee;
  color: #313131;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h4 {
    margin: 5px 10px;
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
  height: 100%;
}
.btn-close, .btn-confirm {
  border-radius: 8px;
  margin-left:16px;
  width:56px;
  border:none;
  cursor: pointer;
}
.btn-muted {
  color: #444444;
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
button.btn-muted {
  background: transparent;
  border: 1px solid #aaa;
  border-radius: 4px;
}
.search-bar {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  .search-panel {
    height: 30px;
    width: 220px;
    border-radius: 4px;
    border: 1px solid #aaa;
  }
  .btn-submit{
    height: 30px;
    width: 80px;
    margin-left: 20px;
  }
}
.search-list{
  height: 385px;
  ul{
    &.searchObj {
      padding: 10px 20px;
    }
    li{
      border-bottom: 1px solid #ddd;
      padding: 10px 5px;
      img{
        border-radius: 50%;
      }
      .content{
        display: flex;
        align-items: center;
        .userName {
          font-weight: bold;
          margin-left: 15px;
        }
      }
    }
  }

}
.search-user-info {
  text-align: center;
  .set-friend {
    padding: 20px;
    .friend-name {
      font-size: 16px;
      padding: 10px;
    }
    hr{
      border-color: #d9d9d9;
      border-top: none;
    }
    dl{
      dt{
        font-weight: bold;
        width: 95px;
        display: inline-block;
      }
      dd{
        text-align: right;
        display: inline-block;
        width: 95px;
        margin: 0;
        color: #969CA2;
      }
    }
  }
}

</style>