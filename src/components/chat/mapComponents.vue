<template>
  <div class="baidu-map">
    <div class="modal-backdrop">
      <div class="modal">
    <div class="modal-header">
      <div>{{header}}</div>
      <div class="win-tool">
        <button type="button" class="btn-close" @click="closeSelf">X</button>
      </div>
    </div>
    <div class="modal-body">
      <baidu-map :center="center" :zoom="zoom" class="map" @ready="handler" @click="getPoint">
        <bm-marker :position="position" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        </bm-marker>
      </baidu-map>
    </div>
    <div class="modal-bottom">
        <button class="btn-submit" @click="sendAddress">发送</button>
    </div>
  </div>
    </div>
  </div>
</template>

<script>
import {BaiduMap,BmMarker} from 'vue-baidu-map'
import apiServer from '../../api/apiServer.js'
//import WEBIM from '../../api/webim.js'
//import msgRequest from '../../api/msgRequest.js'
import store from '../../store'
let address = "";
const imgApiUrl = "https://api.map.baidu.com/staticimage?width=320&height=240&&zoom=15&markers=";
export default {
  name:'MapComponents',
  created(){
    //console.log(this.$route.query.location_x);
    //console.log(this.$route.query.location_y);
    console.log("进入地图选择")
  },
  data(){
    return {
      header:'所在位置',
      center: {lng: 116.404, lat: 39.915},
      zoom: 15,
      position:{lng: 114.02597366, lat: 22.54605355}
    }
  },
  methods:{
    closeSelf() {
      this.$emit("closeMap");
    },
    handler({BMap, map}) {
      if(!apiServer.isNull(store.state.toUser.location_x)){
        this.center.lat= store.state.toUser.location_x;
        this.center.lng= store.state.toUser.location_y;
        this.position.lat = store.state.toUser.location_x;
        this.position.lng = store.state.toUser.location_y;
      }else{
        this.getLocation();
      }
    },
    getPoint(e){
      console.log(e)
      this.center.lat=e.point.lat;
      this.center.lng=e.point.lng;
      this.position.lat = e.point.lat;
      this.position.lng = e.point.lng;
      let geocoder = new BMap.Geocoder();
      geocoder.getLocation(e.point,rs=>{
        console.log(rs.address)
        address = rs.address;
      })
    },
    getLocation(){
      let that =this;
      let geolocation = new BMap.Geolocation();
      geolocation.enableSDKLocation();
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() === BMAP_STATUS_SUCCESS){
          that.center.lat=r.point.lat;
          that.center.lng=r.point.lng;
          that.position.lat = r.point.lat;
          that.position.lng = r.point.lng;
          console.log("自动定位")
          let geocoder = new BMap.Geocoder();
          geocoder.getLocation(r.point,rs=>{
            console.log(rs.address)
            address = rs.address;
          })
        }
      });
    },
    sendAddress:function(){
      console.log(this.$store.state.openUserId)
      var toUserId = this.$store.state.openUserId;
      var toNickName = this.$store.state.openUserName;
      var content = imgApiUrl+this.position.lng+","+this.position.lat+"&zoom=15";
      console.log(content);
      //var msg=msgRequest.sendAddress(4,address,this.center.lat,this.center.lng,content,toUserId,toNickName);
      //msg.content = WEBIM.decryptMessage(msg)
      store.commit("setMsgListOne",msg);

      // 发送消息后更新消息界面此会话的最新条消息
      let lastList = store.state.lastChatList
      let flag = false
      for(let i = 0;i<lastList.length;i++){
        // console.log(9,lastList[i].from,store.state.openUserId)
        if(lastList[i].jid === store.state.openUserId){
          console.log(9,lastList[i],msg)
          lastList[i].content ='[位置]'
          let last = lastList[i]
          lastList.splice(i,1)
          lastList.unshift(last)
          let flag = true
          // console.log(msg,76)
        }
        if(!flag){
          let newM = msg
          // 待改 将msg转化成lastList中的一项
          lastList.unshift()
        }
      }
      //若消息列表没有该会话，则添加该会话记录
      store.commit("setLastChatMsg",lastList)
      setTimeout(()=>{this.$router.go(-1)},200)
    }
  },
  components:{
    // 百度地图
    BaiduMap,
    BmMarker
  }

}
</script>

<style lang="less" scoped>
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
  .map{
    height: 367px;
  }
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
  padding: 3px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .modal-title{
    text-align: center;
    padding: 16px 0 0;
  }
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
</style>
