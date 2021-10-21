<script>
import { actions } from '../../store';
import Contact from '../../components/chat/contact';
import Group from '../../components/chat/group';
import Session from '../../components/chat/session';
import Modal from '../../components/chat/modal'

export default {
    components: {Contact, Session,Modal,Group},
    vuex: {
        actions: actions,
        getters: {
            // 过滤后的会话列表
            sessions: ({ sessions, filterKey }) => {
                let result = sessions.filter(session => session.user.name.includes(filterKey));

                return result;
            },
            contacts: ({ contacts, filterKey }) => {
              let result = contacts.filter(contacts => contacts.user.name.includes(filterKey));

              return result;
            },
            user: ({ user }) => user,
            filterKey: ({ filterKey }) => filterKey,
            //lastMsg:({ sessions }) => sessions.message.date,
            // 当前会话index
            currentId: ({ currentSessionId }) => currentSessionId,


        },
    },
    data(){
      return{
        currentTab:'session',
        showModal:false,
      }
    },
  methods: {
    onKeyup (e) {
      this.search(e.target.value);
    },
    toggleModal: function () {
      this.showModal = !this.showModal;
    },
    closeme: function () {
      this.showModal = !this.showModal;

    }
  },

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
          <button @click="currentTab='session'" class="session" :class={active:currentTab==='session'}></button>
        </li>
        <li>
          <button @click="currentTab='contact'" class="contact" :class={active:currentTab==='contact'}></button>
        </li>
        <li>
          <button @click="currentTab='group'" class="group" :class={active:currentTab==='group'}></button>
        </li>
      </ul>
    </div>
    <footer>
      <a href="#" @click="toggleModal"><img width="28px" height="28px" src="../../../dist/images/set.png" alt=""></a>
    </footer>
  </div>
  <div class="list">
      <div class="list-top">
        <div class="search-bar">
            <!--<img class="" src="../../dist/images/search.png">-->
            <input class="search" type="text" placeholder="search user..." @keyup="onKeyup | debounce 150">
        </div>
        <div class="add">
          <img src="../../../dist/images/add.png" width="28px" height="28px">
        </div>
      </div>
      <div class="list-main">
        <component :is="currentTab" keep-alive></component>
      </div>
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
    width: 263px;
  .ms-list-right {
    width: 100%;
    margin-left: 10px;
    position: relative;
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