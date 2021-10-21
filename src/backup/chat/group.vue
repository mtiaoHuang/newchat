<script>
import { actions } from '../../store';
export default {
  vuex: {
    actions: actions,
    getters: {

      // 过滤后的群组会话列表
      groups: ({ groups, filterKey }) => {
        let result = groups.filter(group => group.user.name.includes(filterKey));

        return result;
      },
      //lastMsg:({ sessions }) => sessions.message.date,
      // 当前会话index
      currentId: ({ currentGroupId }) => currentGroupId,


    },
  },
  filters: {
    // 将日期过滤为 hour:minutes
    time (date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return date.getHours() + ':' + date.getMinutes();
    }
  },
  methods: {
    onKeyup (e) {
      this.search(e.target.value);
    }
  },
  name: "group"
}
</script>
<template>
  <ul>
    <li v-for="item in groups" :class="{ active: item.gid === currentId }" @click="selectGroupSession(item.gid)">
      <img class="avatar"  width="36" height="36" :alt="item.user.name" :src="item.user.img">
      <div class="ms-list-right">
        <div class="list-content-top">
          <div class="name">{{item.user.name}}</div>
          <div class="time"></div>
        </div>
        <div class="list-content-bottom">
          <div class="msg">
            <div class="last-msg">{{item.gid}}</div>
            <div class="badge"><div class="bon">3</div></div>
          </div>
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