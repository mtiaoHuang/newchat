<template>
<div class="select-people">
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title" v-show="isSelect">请选择您要加入群组的好友</div>
        <div class="modal-title" v-show="isAddRoom">请输入群组名称和群组描述</div>
      </div>
      <div class="modal-body" v-show="isSelect">
        <vuescroll>
          <ul class="selectObj">
            <li v-for="(item,key,index) in items" @click="selectItem(key,index)">
              <div :class="{active:selectList.includes(key)}" class="checkbox" ></div>
              <div class="content">
                <img class="avatar" :src="item.avatar" width="36px" height="36px" :onerror='imgError'>
                <div class="selectName">{{item.toNickname}}</div>
                <!--              <div class="">{{index}},{{key}}</div>-->
              </div>
            </li>
          </ul>
        </vuescroll>
      </div>
      <div class="modal-body" v-show="isAddRoom">
        <div class="add-room-form">
          <div class="list">
            <div class="title">群组名称</div><input class="room-name" v-model="roomName" required />
          </div>
          <div class="list">
            <div class="title">群组说明</div><input class="room-desc" v-model="roomDesc" required />
          </div>
          <div class="list">
            <div class="title">创建者</div><div class="creator">{{ createUserName }}</div>
          </div>
        </div>
      </div>
      <div class="modal-bottom" v-show="isSelect">
        <button type="button" class="btn-confirm" @click="selectConfirm">确定</button>
        <button type="button" class="btn-close" @click="closeSelf">取消</button>
      </div>
      <div class="modal-bottom" v-show="isAddRoom">
        <button type="button" class="btn-confirm" @click="addRoom">创建群组</button>
        <button type="button" class="btn-close" @click="closeSelf">取消</button>
      </div>
      <div class="notice-box" v-show="noticeBox">
        {{noticeContent}}
      </div>
    </div>

  </div>
</div>
</template>

<script>
import apiServer from "../../api/apiServer";
import apiRequest from "../../api/apiRequest";
import vuescroll from "vuescroll";
import store from "../../store";
export default {
  name: "selectRoomPeople",
  components:{vuescroll},
  updated() {
    let that = this
    if(this.noticeBox === true){
      setTimeout(function(){
        that.noticeBox = false
        console.log('关闭提示')
      },2000);
    }
  },
  data(){
    return{
      isSelect:true,
      isAddRoom:false,
      roomName:'',
      roomDesc:'',
      noticeBox:false,
      noticeContent:'',
      createUserName:window.sessionStorage.getItem("nickName"),
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {}
      },
      items:[],
      imgError:'this.src="' + require('../../../dist/images/download.png') + '"',
      imgGroupError:'this.src="' + require('../../../dist/images/groupdefault.png') + '"',
      selectList:[]
    }
  },
  created() {
    this.items = this.$store.state.friendsMap;
  },
  methods:{
    closeSelf() {
      this.$emit("closeAddRoomPeople");
    },
    selectConfirm(){
      this.isSelect = false
      this.isAddRoom = true
    },
    selectItem(item,index){
      if(this.selectList.includes(item)){
        //includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
        //filter()返回值是true还是false决定保留还是丢弃该元素：生成新的数组
        this.selectList=this.selectList.filter(function (ele){return ele !== item;});
        //filter()为假时删除
      }else{
        this.selectList.push(item);
      }
      this.newSelectList = JSON.stringify(this.selectList)
      console.log('已选id',this.newSelectList)
    },
    addRoom:function(){
      this.noticeBox = true
      if(!this.roomName){
        this.noticeContent = "请输入群名称"
      }else if(!this.roomDesc){
        this.noticeContent = "请输入群说明"
      }else{
        let groupId = apiServer.randomUUID();
        let membersText = this.newSelectList;
        console.log(membersText,"0000")
        let params = {
          jid : groupId,
          name : this.roomName,
          desc : this.roomDesc,
          isLook:1,
          text : membersText
        };
        let that =this;
        apiRequest.createRoom(params,function(result){
          if(result.resultCode===1){
            console.log(222,result);
            let list=[];
            list.push(result.data);
            result.data.isRoom = 1
            store.commit("setRoomList",list);
            result.toNickName = name;
            store.commit("setOpenUserId",result.data.jid);
            store.commit("setOpenUserName",result.data.name);
            store.commit("setOpenIsRoom",1);
            store.commit("setMsgList",[]);
            //that.$router.go(-2);
            console.log('创建群组成功')
            that.$router.go(0);
            that.closeSelf()
          }
        })
      }
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
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  width: 380px;
  height: 456px;
  position: relative;
}
.modal-body{
  //padding: 15px 15px 0;
}
.notice-box {
  position: absolute;
  top: 0;
  left: 50%;
  box-shadow: 1px 2px 10px #888888;
  background: #d73a49;
  border-radius: 4px;
  padding: 10px;
  color: #ffffff;
  transform: translate(-50%, 10px);
  z-index: 999999;
  font-size: 12px;
}
.modal-bottom {
  display: flex;
  text-align: center;
  padding: 13px;
  justify-content: center;
  background: #eee;
  border-radius: 0 0 10px 10px;
  bottom: 0;
  position: absolute;
  width: 100%;
}
.modal-header{
  .modal-title{
    text-align: center;
    padding: 16px 0 0;
  }
}

.selectObj{
  height: 350px;
  padding: 15px;
  .checkbox {
    width: 14px;
    height: 14px;
    border: 2px solid #00c9b2;
    background: #ffffff;
    &.active{
      background: #00c9b2;
    }
  }
  li{
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    padding: 10px 5px;
  }
  li:last-child{
    border-bottom: 1px solid transparent;
  }
  .content{
    display: flex;
    align-items: center;
    padding-left: 8px;
  }
  .avatar{
    border-radius: 50%;
  }
  .selectName{
    padding-left: 10px;
    font-weight: bold;
  }
}
.add-room-form {
  width: 260px;
  margin: 16px auto;
  .list{
    display: flex;
    align-items: center;
    height: 40px;
    input{
      border: 1px solid #bbb;
      height: 32px;
      border-radius: 4px;
      padding: 4px 8px;
    }
    .title{
      width: 68px;
    }
  }

}
.btn-close, .btn-confirm {
  border-radius: 4px;
  margin: 0 16px;
  width:68px;
  height: 26px;
  border:none;
  cursor: pointer;
  color: #fff;
  font-size: 12px
}
.btn-close {
  background-color:#EF4E4E;
}
.btn-confirm {
  background-color: #00C9B2;
}
</style>