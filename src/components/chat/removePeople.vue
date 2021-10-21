<template>
<div class="select-people">
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">

      </div>
      <div class="modal-body">
        <vuescroll>
          <ul class="selectObj">
            <li v-for="(item,key,index) in groupMember" @click="toDelete(item.userId,item.nickname)">
              <div class="content">
                <img class="avatar" :src="item.avatar" width="36px" height="36px" :onerror='imgError'>
                <div class="selectName"><span v-if="item.role === 1" class="muted">[管理员]</span><span class="muted" v-else>[组员]</span>{{item.nickname}}</div>
  <!--              <div class="">{{index}},{{key}}</div>-->
              </div>
            </li>
          </ul>
        </vuescroll>
      </div>
      <div class="modal-bottom">
<!--        <button type="button" class="btn-confirm" >确定</button>-->
        <button type="button" class="btn-close" @click="closeSelf">关闭</button>
      </div>
    </div>
    <div class="confirm-box" v-show="isConfirm">
      <div class="alert">
        <div class="content">
          确定要移除 [{{nickname}}] 吗？
        </div>
        <hr>
        <div class="bottom">
          <button @click="ConfirmDelete">YES</button>
          <button @click="cancelDelete">No</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import apiServer from "../../api/apiServer";
import vuescroll from "vuescroll";
import store from "../../store";
export default {
  name: "removePeople",
  components:{vuescroll },
  props:['groupMember','refreshCom'],
  data(){
    return{
      isConfirm:false,
      isSelect:false,
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {}
      },
      imgError:'this.src="' + require('../../../dist/images/download.png') + '"',
      imgGroupError:'this.src="' + require('../../../dist/images/groupdefault.png') + '"',
    }
  },
  created() {
    //this.items = ;
    //console.log('selectpeople',this.items.toUserId,'members',this.groupMember[2].userId)
    // if(this.items.toUserId) {
    //   for(let i=0;i<this.groupMember.length;i++){
    //     if (this.groupMember[i].userId === this.items[this.groupMember[i].userId].toUserId) {
    //       this.isSelect = true
    //     }else{
    //       this.isSelect = false
    //     }
    //   }
    //
    // }
  },
  methods:{
    closeSelf() {
      this.$emit("closeRemove");
    },
    toDelete(userId,nickname){
      this.isConfirm = true
      this.userId = userId
      this.nickname = nickname
      console.log('nickname',this.groupMember)
    },
    ConfirmDelete(){

      let that = this
      let token = sessionStorage.getItem('access_token');
      apiServer.postData({
        url:'/room/member/delete',
        data:{
          access_token:token,
          roomId:store.state.roomId,
          userId:that.userId
        }
      },function(data){
        console.log('删除成员返回数据',data,'allmember',that.groupMember)
        for(let i = 0;i<that.groupMember.length;i++){
          if(that.groupMember[i].userId === that.userId){
            that.groupMember.splice(i, 1);
          }
        }
        that.isConfirm = false
        that.$router.go(0);
        this.closeSelf()
      })
      this.$forceUpdate();
    },
    cancelDelete(){
      this.isConfirm = false
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
  //padding: 15px 15px 0;;
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

.selectObj{
    height: 350px;
    padding: 15px;
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
    .muted{
      color: #00c9b2;
      font-weight: 500;
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
.confirm-box {
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
  .alert{
    //position: absolute;
    background: #ffffff;
    padding: 10px;
    box-shadow: 2px 2px 10px #999999;
    border-radius: 4px;
  }
}
</style>