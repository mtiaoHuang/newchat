<template>
  <div id="container">
    <div class="wrap">
<!--      <forget-password></forget-password>-->
    </div>
  </div>
</template>
<script>
// import Login from '../../components/regpanel/mylogin.vue'
// import Register from "../../components/regpanel/Register";
// import ForgetPassword from "../../components/regpanel/ForgetPassword";
export default {
  components:{
    // Login,Register,ForgetPassword
  },
  name: 'LoginPanel'
}
</script>
<style lang="less" scoped>
#container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #e6e6e6;
  .wrap{
    background: #ffffff url("../../../dist/images/bg.png") no-repeat;
    background-size: auto 600px;
    width: 830px;
    height: 600px;
    border-radius: 10px;
    display: flex;
  }
}
</style>