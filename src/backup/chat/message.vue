<script>
import { actions } from '../../store';
export default {
    vuex: {
      actions: actions,
        getters: {
            user: ({ user }) => user,
            session: ({ sessions, currentSessionId }) => sessions.find(session => session.id === currentSessionId),
            contacts: ({ contacts, currentSessionId }) => contacts.find(contact => contact.id === currentSessionId),
            groups: ({ groups, currentGroupId }) => groups.find(group => group.gid === currentGroupId),
        }
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
    directives: {
        // 发送消息后滚动到底部
        'scroll-bottom' () {
            this.vm.$nextTick(() => {
                this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight;
            });
        }
    },
    data(){
      return{
        showSetting:false,
        msgWin:'group',
        content: ''
      }
    },
    methods: {
      showSet() {
        this.showSetting=!this.showSetting;
      },
      onKeyup (e) {
        if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
          this.sendMessage(this.content);
          this.content = '';
        }
      }
    }
};
</script>

<template>
<div class="message-header">
  <div class="name">
    {{session.user.name}}
  </div>
  <div class="message-set" @click="showSet">
    <img width="20px" src="../../../dist/images/more.png">
  </div>
  <div :class=[showSetting?'active':''] class="setting-box">
    <div class="setting-contain">
      <div class="header">
        <ul>
          <li class="add">
            <img src="../../../dist/images/add.png" width="28px" height="28px">
            <div class="name">添加</div>
          </li>
          <li class="avatar">
            <img :src="session.user.img" width="28px" height="28px">
            <div class="name">{{session.user.name}}</div>
          </li>
        </ul>
      </div>
      <hr>
      <dl>
        <dt>备注</dt>
        <dd>{{session.user.name}}</dd>
      </dl>
      <dl>
        <dt>通讯录</dt>
        <dd>{{contacts.user.number}}</dd>
      </dl>
      <hr>
      <dl>
        <dt>消息免打扰</dt>
        <dd><input type="radio"></dd>
      </dl>
      <hr>
      <div class="button-set">
        <button class="btn-sub">加入黑名单</button>
        <button class="btn-red">删除好友</button>
      </div>
    </div>
  </div>
</div>
<div class="message" v-scroll-bottom="session.messages">
  <ul>
    <li v-for="item in session.messages">
      <p class="time">
        <span>{{ item.date | time }}</span>
      </p>
      <div class="main" :class="{ self: item.self }">
        <img class="avatar" width="36" height="36" :src="item.self ? user.img : session.user.img" />
        <div class="text">{{ item.content }}<div ><div class="text-tip">已读</div></div></div>
      </div>
    </li>
  </ul>

</div>
  <div class="send">
    <div class="toolbar">
      <ul>
        <li>
          <a href="#"><img width="24px" height="24px" src="../../../dist/images/expression01.png"></a>
        </li>
        <li>
          <a href="#"><img width="24px" height="24px" src="../../../dist/images/filetransfer.png"></a>
        </li>
        <li>
          <a href="#"><img width="24px" height="24px" src="../../../dist/images/screenshot01.png"></a>
        </li>
        <li>
          <a href="#"><img width="24px" height="24px" src="../../../dist/images/location01.png"></a>
        </li>
      </ul>
    </div>
    <textarea placeholder="" v-model="content" @keyup="onKeyup"></textarea>
    <div class="button">
      <button>发送(S)</button>
    </div>

  </div>
</template>

<style lang="less" scoped>

.message-header{
  height: 70px;
  padding: 20px;
  border-bottom: 1px solid #ddd;
  background: #f7f7f7;

  .message-set {
    float: right;
    padding: 2px;
    cursor: pointer;
  }
  .setting-box {
    position: absolute;
    right: 0;
    top: 70px;
    z-index: 99;
    background: #ffffff;
    width: 234px;
    padding: 18px;
    height: 530px;
    box-shadow: 1px 0 6px rgba(0, 0, 0, 0.16);
    transform: translate(200%, 0);
    transition: transform .3s;
    &.active{
      transform: translate(0, 0);
    }
    hr{
      border-color: #d9d9d9;
      border-top: none;
    }
    .header{
      display: flex;
      margin-bottom: 24px;
      ul{
        display: flex;
        li{
          margin: 5px;
          padding: 0 5px;
          img{
            display: block;
            margin: 0 auto;
            border-radius: 50%;
          }
          .name{
            text-align: center;
            font-weight: 500;
            font-size: 12px;
            width: 100%;
          }
        }
      }
    }
    dl{
      dt{
        font-weight: bold;
        width: 95px;
        display: inline-block;
      }
      dd{
        text-align: right;
        display: inline-block;
        width: 95px;
        margin: 0;
        color: #969CA2;
      }
    }
    .button-set{
      text-align: center;
      margin-top: 24px;
      button{
        border: none;
        color: #ffffff;
        border-radius: 4px;
        padding: 4px 19px;
        width: 108px;
        margin: 6px 0;
      }
      .btn-sub {
        background: #00C9B2;
      }
      .btn-red{
        background: #EF4E4E;
      }
    }
  }
  .name{
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;
    float: left;
  }
}

.message {
    padding: 10px 15px;
    overflow-y: scroll;
    background: #f7f7f7;
    height: 370px;
    li {
        margin-bottom: 15px;
    }
    .time {
        margin: 7px 0;
        text-align: center;

        > span {
            display: inline-block;
            padding: 0 18px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #dcdcdc;
        }
    }
    .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    .text {
        display: inline-block;
        position: relative;
        padding: 10px;
        max-width: ~'calc(100% - 88px)';
        min-height: 30px;
        line-height: 1.4;
        font-size: 14px;
        text-align: left;
        word-break: break-all;
        background-color: #ffffff;
        border-radius: 4px;

        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fafafa;
        }

    }

    .self {
        text-align: right;
      .text-tip {
        position: absolute;
        left: -36px;
        top: 0;
        background: #00c9b2;
        border-radius: 4px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        text-align: center;
        padding: 0 4px;
      }
        .avatar {
            float: right;
            margin: 0 0 0 10px;
        }
        .text {
            background-color: #00C9B2;
            color: #FFFFFF;
            &:before {
                right: inherit;
                left: 100%;
                border-right-color: transparent;
                border-left-color: #00C9B2;
            }
        }
    }
}
.send {
  height: 160px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  textarea {
    padding: 10px;
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
  }
}
.toolbar{
  background: #ffffff;
  border-top: 1px solid #ddd;
  ul{
    margin-left: 8px;
    margin-top: 5px;
    display: flex;
    li{
      padding: 5px 8px 0 8px;
      img{

      }
    }
  }
}
.button {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  padding: 5px 18px 18px;
  button{
    font-size: 12px;
    background: #ffffff;
    border-radius: 4px;
    padding: 2px 12px;
    color: #2C2F43;
    text-align: center;
    height: 22px;
    line-height: 18px;
    border: 1px solid #969CA2;
  }
}
</style>