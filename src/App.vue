<script>
import { actions } from './store';
import Main from './components/mainpage';
// import Card from './components/chat/card';
// import List from './components/chat/list';
// import Text from './components/chat/text';
// import Message from './components/chat/message';
// import Content from './components/chat/content.vue';
// import Contact from './components/chat/contact';
// import Login from "./components/regpanel/mylogin.vue";
import LoginPanel from "./components/regpanel/loginpanel";

export default {
    components: {LoginPanel, Main,},

    vuex: {
        actions: actions
    },

    data(){
      return{

      }
    },
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  },
  name:'App'
}

</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less" scoped>
#app {
   /* margin: 20px auto;
    width: 829px;
    height: 600px;
    overflow: hidden;
    border-radius: 3px;*/
    position: relative;
}
</style>
