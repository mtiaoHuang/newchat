

<script>
export default {
  vuex: {
    getters: {
      user: ({ user }) => user,
      session: ({ sessions, currentSessionId }) => sessions.find(session => session.id === currentSessionId),
      contacts: ({ contacts, currentSessionId }) => contacts.find(contact => contact.id === currentSessionId),

    }
  }
};
</script>
<template>
  <div class="contact-main">
    <div class="avatar"><img width="80" height="80" :src="contacts.user.img" ></div>
    <div class="name"><strong>{{contacts.user.name}}</strong></div>
    <div class="number">号码：{{contacts.user.number}}</div>
    <div class="button-bar">
      <button>加入黑名单</button><button>发送消息</button>
    </div>

  </div>
</template>
<style lang="less" scoped>
.contact-main {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  line-height: 2;
.number {
  color: #9f9f9f;
}
}
</style>