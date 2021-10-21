<template>
  <div class="chat-window flex-center">
        <list></list>
    </div>
</template>

<script>
import { actions } from '../store.js';
import Card from '../components/chat/card';
import List from '../components/chat/list';
import Chat from'../components/chat/Chat'
import SelectRoomPeople from "../components/chat/selectRoomPeople";
export default {
  components: {Card,List,Chat,SelectRoomPeople},
  vuex: {
    actions: actions
  },
  created () {
    let that=this
    // setTimeout(function(){
    //   that.reload = true
    // },2000);
  },
  props: {},

  methods:{
    closeAddRoomPeople(){
      this.selectRoomPeopleCom = !this.selectRoomPeopleCom
    },

  },
  data(){
     return{
       selectRoomPeopleCom:false,
       listName:1,
     }
  },
  name: "mainpage"
}
</script>

<style lang="less" scoped>
.flex-center{
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-window{
  width: 100vw;
  height: 100vh;
  background: #757f97;
}
.wrap{
  width: 860px;
  height: 600px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
}

  .sidebar, .main {
    height: 100%;
  }
  .sidebar {
    display: flex;
    width: 324px;
    background-color: #f2f2f2;
    border-right: 1px solid #ddd;
  }
  .main-bar {
    position: relative;
    overflow: hidden;
    background-color: #eee;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .text {
    /*position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;*/
    display: flex;
    flex-direction: column;
  }
  .message {
    height: ~'calc(100% - 160px)';
  }

</style>