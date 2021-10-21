<script>
import { actions } from '../../store';
import Modal from './modal'

export default {
    vuex: {
        actions: actions,
        getters: {
            user: ({ user }) => user,
            filterKey: ({ filterKey }) => filterKey
        }
    },
    data () {
      return {
        showModal:false,
      }
    },
    components: {
      Modal
    },
    methods: {
      // onKeyup (e) {
      //    this.search(e.target.value);
      //}
      //goSession:function (){
      //  this.$emit('currentTab','session')
      //},
      //goContact:function (){
      //  this.$emit('currentTab','Contact')
      //},

      toggleModal: function () {
        this.showModal = !this.showModal;
      },
      closeme: function () {
        this.showModal = !this.showModal;

      }
    }
};
</script>

<template>
<div class="card">
    <header>
        <img class="avatar" width="36" height="36" :alt="user.name" :src="user.img">
        <!--<p class="name">{{user.name}}</p>-->
    </header>
    <div class="set-bar">
      <ul>
        <li>
          <button @click.native="currentTab='session'"><img width="28px" height="28px" src="../../../dist/images/news.png" alt="" ></button>
        </li>
        <li>
          <button @click.native="currentTab='contact'"><img width="28px" height="28px" src="../../../dist/images/list.png" alt=""></button>
        </li>
        <li>
          <a href="#"><img width="28px" height="28px" src="../../../dist/images/creategroup.png" ></a>
        </li>
      </ul>
    </div>
    <footer>
      <a href="#" @click="toggleModal"><img width="28px" height="28px" src="../../../dist/images/set.png"></a>
    </footer>
</div>
  <Modal v-show="showModal" v-on:closeme="closeme"></Modal>
</template>

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
.set-bar{
  ul{
    margin-top: 48px;
    li{
      padding: 4px;
      margin-bottom: 16px;
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
</style>