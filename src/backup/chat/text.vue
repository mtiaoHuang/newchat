<script>
import { actions } from '../../store';

export default {
    vuex: {
        actions: actions
    },
    data () {
        return {
            content: ''
        };
    },
    methods: {
        onKeyup (e) {
            if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                this.sendGroupMessage(this.content);
                this.content = '';
            }
        }
    }
};
</script>

<template>

<div class="text">
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
.text {
    height: 160px;
    background: #ffffff;

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