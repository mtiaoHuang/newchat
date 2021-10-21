<template>
  <div class="wrap">
    <div class="sidebar">
      <div class="card">
        <header>
          <img class="avatar" width="36" height="36" :src="getMyImg()" alt="" @click="toggleModal">
          <!--<p class="name">{{user.name}}</p>-->
        </header>
        <div class="set-bar">
          <ul>
            <li>
              <button @click="changeSession"  class="session" :class="{'active':currentTab==='session'}">
              </button>
            </li>
            <li>
              <button @click="changeFriend" class="contact" :class="{'active':currentTab==='contact'}">
              </button>
            </li>
            <li>
              <button @click="changeGroup" class="group" :class="{'active':currentTab==='group'}">
              </button>
            </li>
          </ul>
        </div>
        <footer>
          <a href="#" @click="toggleModal"><img width="28px" height="28px" src="../../../dist/images/set.png" alt=""></a>
        </footer>
        <Modal v-if="showModal" v-on:closeme="closeMe"></Modal>
      </div>
      <div class="list">
        <div class="list-top">
          <div class="search-bar">
            <input class="search" type="text" placeholder="搜索" @keyup="onKeyup" v-model="search">
          </div>
          <div class="add" @click="addChatFriend" v-if="listName === 1">
            <img src="../../../dist/images/add.png" width="28px" height="28px" alt="1">
          </div>
          <div class="add" @click="addNewFriend" v-if="listName === 2">
            <img src="../../../dist/images/add.png" width="28px" height="28px" alt="2">
          </div>
          <div class="add" @click="addRoomFriend" v-if="listName === 3">
            <img src="../../../dist/images/add.png" width="28px" height="28px" alt="3">
          </div>
        </div>
        <div class="list-main">
          <vuescroll :ops="ops">
          <ul>
            <li v-if="listName === 2" @click="newFriend" :class="isNewFriend?'active':''">
              <img src="../../../dist/images/newfriends.png" width="36" height="36">
              <div class="ms-list-right list-fixed">
                <div class="list-content-top">
                  <div class="name">新的好友</div>
                </div>
              </div>
            </li>
            <li v-if="listName === 2" @click="blackList" :class="isBlackList?'active':''">
              <img src="../../../dist/images/blacklist.png" width="36" height="36">
              <div class="ms-list-right list-fixed">
                <div class="list-content-top">
                  <div class="name">黑名单</div>
                </div>
              </div>
            </li>
            <hr v-if="listName === 2">
            <li v-for="(item,index) in items" :class="isIndex === index?'active':'' ">
              <div v-if="listName === 1">
                <img class="avatar"  width="36" height="36" alt="群" src="../../../dist/images/groupdefault.png" v-if="item.isRoom ===1" :onerror='imgGroupError'>
                <img class="avatar"  width="36" height="36" alt="个人" :src="item.avatar" v-if="item.isRoom !==1" :onerror='imgError'>
              </div>
              <div v-else>
                <img class="avatar"  width="36" height="36" alt="群" src="../../../dist/images/groupdefault.png" v-if="listName ===3" :onerror='imgGroupError'>
                <img class="avatar"  width="36" height="36" alt="个人" :src="item.avatar" v-if="listName === 2" :onerror='imgError'>
              </div>
              <div class="ms-list-right" :class="{'list-fixed':listName !== 1}" @click="goChat(item,index)">
                <div class="list-content-top" >
                  <div class="name">{{item.toNickname}}{{item.toNickName}}</div>
                  <div class="time" v-if="listName === 1">{{item.timeSend*1000 | dateFormat}}</div>
                </div>
                <div class="list-content-bottom" v-if="listName === 1">
                  <div class="msg">
                    <div class="last-msg" v-if="listName === 1">
                      <span v-if="item.type === 9">[文件]</span>
                      <span v-else-if="item.type === 2">[图片]</span>
                      <span v-else>{{item.content}}</span>
                    </div>
                    <div class="last-msg" v-if="listName === 2">
                      <span>{{item.type}}</span>
                    </div>
                    <div class="badge" v-if="listName === 1"><div class="bon">{{ item.msgNum }}</div></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          </vuescroll>
        </div>
      </div>
    </div>
    <chat ref="upDateCom" v-bind:listName="listName"></chat>
    <select-room-people v-if="selectRoomPeopleCom" v-on:closeAddRoomPeople="closeAddRoomPeople"></select-room-people>
    <select-friend v-if="selectFriendCom" v-on:closeAddFriend="closeAddFriend" v-on:refreshChat="refreshChat"></select-friend>
    <search-modal v-if="selectSearchCom" v-on:closeSearch="closeSearch" ></search-modal>
  </div>
<!--    <chat :goToChat="chatItems" ref="upDateCom"></chat>-->
</template>
<script>
import store,{ actions } from '../../store';
import Chat from '../../components/chat/Chat'
import Modal from '../../components/chat/modal';
import apiServer from '../../api/apiServer.js';
import apiRequest from "../../api/apiRequest";
import moment from 'moment';
import vuescroll from "vuescroll";
import searchModal from "./searchModal";
import { mapState } from 'vuex'
import SelectRoomPeople from "./selectRoomPeople";
import SelectFriend from "./selectFriend";
let msgNumList=[];
export default {
  vuex: {
    actions: actions,
    getters: {
      filterKey: ({ filterKey }) => filterKey,
    },
  },
  components: {SelectFriend, SelectRoomPeople, Chat,Modal,vuescroll,searchModal},
  computed:{
    LClist() {
      return store.state.lastChatList.filter(item => {
        return item.toNickname.match(this.search)
      })
    },
    FRlist() {
      return store.state.friendsMap.filter(item => {
        return item.toNickname.match(this.search)
      })
    },
    RMlist() {
      return store.state.myRooms.filter(item => {
        return item.toNickname.match(this.search)
      })
    },
  },

  watch:{
    chatListRoom:function(){
      console.log('watch')
      let that = this;
      that.$nextTick(() =>{
        //console.log('数据合并','LastChatList',store.state.lastChatList,'friendsMap',store.state.friendsMap,'RoomList',store.state.myRooms)
        let userId='';
        let isRoom=''
        let clData = store.state.lastChatList
        let roomData = store.state.myRooms
        let friMpa = store.state.friendsMap
        for(let i=0;i<clData.length;i++){
          userId = clData[i].jid;
          isRoom = clData[i].isRoom;
          clData[i].avatar = apiServer.sysConfig.avatarBase+(parseInt(userId) % 10000) + "/" + userId + ".jpg";
            if (isRoom === 1) {
                if (!store.state.myRooms[userId]) {
                  clData[i].toNickname = "null"
                } else {
                  clData[i].toNickname = store.state.myRooms[userId].name
                  roomData[userId].toNickname = store.state.myRooms[userId].name

                }
            } else if (isRoom === 0) {
                 if(!store.state.friendsMap[userId]){
                   clData[i].toNickname = "null"
                 } else {
                   clData[i].toNickname = store.state.friendsMap[userId].toNickname
                   //friMpa[userId].toNickname = store.state.friendsMap[userId].toNickname
                 }

            } else {
              clData[i].toNickname = 'unKnow'
            }
        }
        store.commit("setNewLastChatMsg",clData);
        store.commit("setNewRoomList",roomData);
        window.sessionStorage.setItem("newLastChatList",JSON.stringify(clData))
        //console.log('setNewRoomList',friMpa)
        //console.log('newLastChatList',store.state.newLastChatList)
        that.items = store.state.lastChatList
        //that.items = JSON.parse(sessionStorage.getItem('lastChatList'))
        console.log('新的最后聊天列表',that.items)
        that.$forceUpdate()
        if(that.items.length < 2){
          //that.$router.go(0);
        }

      })
    },

  },
  updated() {

  },
  mounted() {
    console.log('mounted')
  },
  created() {
    console.log('created')
    this.newLastChat()
    console.log(this.ops)
  },
  data(){
    return{
      showModal:false,
      userId:'',
      items:[],
      msgNum:"",
      isBlackList:false,
      isNewFriend:false,
      isIndex:0,
      newFriendMsgNum:"2",
      myCompanyMsgNum:"3",
      myPhoneMsgNum:"4",
      publicMsgNum:"5",
      roomMsgNum:"6",
      blackMsgNum:"7",
      deviceMsgNum:"8",
      labelMsgNum:"9",
      listName:1,
      currentTab:'session',
      imgError:'this.src="' + require('../../../dist/images/download.png') + '"',
      imgGroupError:'this.src="' + require('../../../dist/images/groupdefault.png') + '"',
      chatListRoom:[],
      selectRoomPeopleCom:false,
      selectFriendCom:false,
      selectSearchCom:false,
      search:'',
      searchData: '',
      itemsFilter:'',
      ops: {
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background:'#b2b2b2',
        }
      },
    }
  },
  //props:['listName'],
  methods: {
    changeSession(){
      let that = this
      that.listName = 1
      that.items = this.$store.state.lastChatList;
      that.currentTab = 'session'
      console.log('LastChat',that.items)
    },
    changeFriend(){
      let that = this
      that.items = this.$store.state.friendsMap;
      that.listName = 2
      that.currentTab = 'contact'
      console.log('friend',that.items)
    },
    changeGroup(){
      let that = this
      that.items = this.$store.state.myRooms;
      that.listName = 3
      that.currentTab = 'group'
      console.log('group',that.items)
    },

    goChat(item,index){
      this.isIndex = index
      if(this.listName === 2){
        item.jid = item.toUserId
        item.isRoom = 0
        console.log("toUserId",item.toUserId);
       }
      if (this.listName === 3){
        item.isRoom = 1
      }
      this.$store.commit("setOpenUserId",item.jid);
      this.$store.commit("setOpenUserName",item.toNickname);
      this.$store.commit("setOpenIsRoom",item.isRoom);
      this.$store.commit("setToUser",item);
      this.$store.commit("setMsgList",[]);
      console.log("goChat",item);
      // this.$emit('com-change')
      this.$refs.upDateCom.refreshCom()
    },
    getMyImg:function(){
      return apiServer.getAvatarUrl(window.sessionStorage.getItem("userId"));
    },


    onKeyup () {
        this.items = this.LClist
      }
    },


    newLastChat(){
       let that = this;
      //好友列表
      apiRequest.getMyFriends(function(){
        that.chatListFriend = that.$store.state.friendsMap;
      })
       //群组列表
       apiRequest.getMyRooms(function(){
         that.chatListRoom = that.$store.state.rooms;
       })
      //聊天列表
      apiRequest.getLastChatList(function(data){
         for(let i=0;i<data.length;i++){
           data[i].timeSend = data[i].timeSend/1000+""
         }
         that.LastChatList = data.reverse();
         that.items = data
         if(!apiServer.isNull(window.sessionStorage.getItem("friendsMsgNum"))){
           msgNumList = JSON.parse(window.sessionStorage.getItem("friendsMsgNum"));
         }
         console.log('msgList'+msgNumList);
         // this.msgNum = window.sessionStorage.getItem("sysMsgNum");
         console.log("未读消息用户列表 "+msgNumList);
         if(!apiServer.isNull(msgNumList)){
           for(let i=0;i<msgNumList.length;i++){
             console.log(msgNumList[i]+" 消息数量"+window.sessionStorage.getItem("msgNum"+msgNumList[i]));
             that.userMsgNum = window.sessionStorage.getItem("msgNum"+msgNumList[i]);
             // $("#"+msgNumList[i]).append("<badge text=''></badge>");
             console.log(that.items.length)
             for(let n=0;n<that.items.length;n++){
               if(that.items[n].jid===msgNumList[i]){
                 // 遍历未读消息的消息数量 并将数量角标显示出来
                 that.items[n].msgNum = that.userMsgNum;
                 that.items[n].isMsgNum = true;
               }
               console.log("最新一条消息userId "+window.sessionStorage.getItem("newMsgUserId"))
               // 如果最新一条消息在消息列表已经存在
               if(that.items[n].jid===window.sessionStorage.getItem("newMsgUserId")){
                 if(that.$store.state.newMsgList.length>0){
                   that.items[n].content = that.$store.state.newMsgList[that.$store.state.newMsgList.length-1].content[0].data;
                   that.items.unshift(that.items[n]);
                   that.items.splice(n+1, 1);
                   console.log(that.items);
                 }
               }
             }
           }
         }
       })
     },
    toggleModal: function () {
      this.showModal = !this.showModal;
    },
    closeMe: function () {
      this.showModal = !this.showModal;
    },
    blackList(){
      let that = this
      that.isBlackList = true
      that.isNewFriend = false
      that.isIndex = null
      apiRequest.getBlackList(null,null,function(data){
        that.items = data;
        console.log('黑名单',data)
      })
      store.commit('setIsBlack',1)
    },
    newFriend(){
      let that = this
      that.isBlackList = false
      that.isNewFriend = true
      that.isIndex = null
      apiRequest.getNewFriendsList(null,null,function(data){
        console.log(data,45456355)
        // console.log(data);
        if(!apiServer.isNull(that.NewMessage)){
          let list=JSON.parse(that.NewMessage);
          let set=[];
          console.log(data,44444)
          for(let i=0;i<list.length;i++){
            // if(!apiServer.isNull(list[i+1])){
            // 	if(list[i].fromUserId==list[i+1].fromUserId){
            // 		continue;
            // 	}
            // }
            list[i].avatar = apiServer.getAvatarUrl(list[i].fromUserId);
            list[i].toNickname = list[i].fromUserName;
            list[i].toUserId = list[i].fromUserId;
            set.push(list[i]);
          }
          let newList = set.concat(data);
          let allList=[];
          console.log("newList.length")
          console.log(1,newList)
          for(let j=0;j<newList.length;j++){
            if(newList[j].type===511){
              continue;
            }
            newList[j].timeSend = newList[j].timeSend || newList[j].modifyTime
            let flag = true;
            for(let i=0;i<allList.length;i++){
              if(newList[j].toUserId*1 === allList[i].toUserId*1){
                if(newList[j].timeSend > allList[i].timeSend){
                  allList[i] = newList[j]
                  console.log(allList[i],1)
                }
                flag = false

              }
            }
            if(flag){
              allList.push(newList[j]);
            }
          }
          console.log(2,allList);
          that.items = allList;
          // window.sessionStorage.setItem("newFriendMsgList",[]);
        }else{
          let lastList=[];
          for(let n=0;n<data.length;n++){
            if(!apiServer.isNull(data[n+1])){
              if(data[n].toUserId===data[n+1].toUserId){
                continue
              }
            }
            lastList.push(data[n]);
          }
          that.items =lastList;
        }
        let newFriendsList=JSON.parse(window.sessionStorage.getItem("newFriendsList"));
        for(let i = 0;i<newFriendsList;i++){
          for(let j=0;j<that.items.length;j++){
            if(newFriendsList[i].userId === that.items[j].userId){
              that.items[j].direction = newFriendsList[i].direction
              return
            }
          }
        }
        window.sessionStorage.setItem("sysMsgNum",window.sessionStorage.getItem("sysMsgNum")-window.sessionStorage.getItem("peoMsgNum"));
        window.sessionStorage.setItem("peoMsgNum",0);
      })
    },

    addRoomFriend(){
      this.selectRoomPeopleCom = true
    },
    addNewFriend(){
      this.selectSearchCom = true
    },
    addChatFriend(){
      this.selectFriendCom = true
    },
    closeAddFriend(){
      this.selectFriendCom = !this.selectFriendCom
    },
    closeAddRoomPeople(){
      this.selectRoomPeopleCom = !this.selectRoomPeopleCom
    },
    closeSearch(){
      this.selectSearchCom = !this.selectSearchCom
    },
    refreshChat(){
      this.$refs.upDateCom.refreshCom()
    },
  },
  filters:{
    dateFormat(val){
      return moment(val).startOf('day').fromNow();
    },

  }

};
</script>
<style scoped lang="less">
.card {
  padding: 12px;
  /*border-bottom: solid 1px #24272C;*/
  float: left;
  width: 60px;
  background: #E2E4E7;
  height: 100%;
  position: relative;
  footer {
    margin-top: 10px;
  }

  .avatar, .name {
    vertical-align: middle;
  }
  .avatar {
    border-radius: 50%;
    margin-top: 40px;
  }
  .name {
    display: inline-block;
    margin: 0 0 0 15px;
    font-size: 16px;
  }

}
.sidebar {
  border-right: 1px solid #ddd;
}
.set-bar{
  ul{
    margin-top: 48px;
    li{
      padding: 4px;
      margin-bottom: 16px;
      button{
        border: none;
        background: none;
        padding: 0;
        width: 28px;
        height: 28px;
        cursor: pointer;
        &.session{
          background: url("../../../dist/images/news_unselected.png") no-repeat;
          background-size: 28px 28px;
        }
        &.session.active{
          background: url("../../../dist/images/news.png") no-repeat;
          background-size: 28px 28px;
        }
        &.contact{
          background: url("../../../dist/images/list_unselected.png") no-repeat;
          background-size: 28px 28px;
        }
        &.contact.active{
          background: url("../../../dist/images/list.png") no-repeat;
          background-size: 28px 28px;
        }
        &.group{
          background: url("../../../dist/images/creategroup_unselected.png") no-repeat;
          background-size: 28px 28px;
        }
        &.group.active{
          background: url("../../../dist/images/creategroup.png") no-repeat;
          background-size: 28px 28px;
        }
      }
    }
  }
}
footer{
  position: absolute;
  bottom: 0;
  width: 36px;
  text-align: center;
  img{
    margin-bottom: 40px;
  }
}

.list-content-top {
  display: flex;

}
.list {
  float: left;
  width: 262px;
  .list-main{
    ul{
      //overflow-y: auto;
      height: 530px;
      //overflow-x: hidden;
    }
  }
  .ms-list-right {
    width: 100%;
    margin-left: 10px;
    position: relative;
    &.list-fixed{
      display: flex;
      align-items: center;
    }
    p{
      margin: 0;
    }
    .time{
      font-size: 10px;
      color: #969CA2;
      /*position: absolute;
      right: 0;
      top: 0;*/
    }
    .msg{
      font-size: 12px;
      color: #969CA2;
      display: flex;
      .last-msg{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 138px;
        flex: 1;
      }


    }
    .bon{
      background: #EF4E4E;
      text-align: center;
      border-radius: 20px;
      color: #fff;
      line-height: 1;
      padding: 2px 4px;
      zoom: .8;
    }
  }
  .list-top{
    display: flex;
    border-bottom: 1px solid #ddd;
    height: 70px;
    .add{
      margin: 28px auto 14px 8px;
    }
  }
  .search {
    padding-left: 26px;
    width: 198px;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    border: solid 1px #AEB7C1;
    border-radius: 50px;
    outline: none;
    margin: 28px 0 14px 15px;
    background: url("../../../dist/images/search.png") no-repeat 5px;
    background-size: 18px 18px;
  }
  li {
    padding: 12px 15px;
    cursor: pointer;
    transition: background-color .1s;
    display: flex;

    &:hover {
      background-color: #E8E8E8;
    }
    &.active {
      background-color: #E8E8E8;
    }
  }
  .avatar, .name {
    vertical-align: middle;
  }
  .avatar {
    border-radius: 50%;
  }
  .name {
    flex: 1;
    font-weight: bold;
    color: #2C2F43;
  }
}
</style>