<script>
import { actions } from '../../store';
export default {
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
      //lastMsg:({ sessions }) => sessions.message.date,
      // 当前会话index
      currentId: ({ currentSessionId }) => currentSessionId,


    },
  },
  methods: {
    onKeyup (e) {
      this.search(e.target.value);
    }
  },
  name: "contact"
}
</script>
<template>
  <ul class="contact-tool">
    <li>
      <img width="36px" height="36px" src="../../../dist/images/newfriends.png">
      <div class="ms-list-right"><div class="name">新的好友</div></div>
    </li>
    <li>
      <img width="36px" height="36px" src="../../../dist/images/blacklist.png">
      <div class="ms-list-right"><div class="name">黑名单</div></div>
    </li>
  </ul>
  <ul>

      <li v-for="item in contacts" :class="{ active: item.id === currentId }" @click="selectSession(item.id)">
        <img class="avatar"  width="36" height="36" :alt="item.user.name" :src="item.user.img">
        <div class="ms-list-right">
          <div class="contact-content-top">
            <div class="name">{{item.user.name}}{{item.id}}</div>
          </div>
        </div>
      </li>
  </ul>
    <!--</ul>
  </div>-->
</template>

<style scoped lang="less">
.contact-tool{
  border-bottom: 5px solid #d9d9d9;
  li{
    img{

    }
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
    line-height: 36px;
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