<script>
import { actions } from '../../store';

export default {
  vuex: {
    actions: actions,
    getters: {
      user: ({ user }) => user,
      filterKey: ({ filterKey }) => filterKey
    }
  },
  methods: {
    // onKeyup (e) {
    //    this.search(e.target.value);
    //}
  }
};
</script>

<template>
  <div class="toolbar">
    <ul>
      <li>
      <a href="#"><img src="../../../dist/images/expression01.png" alt=""></a>
      </li>
      <li>
        <a href="#"><img src="../../../dist/images/filetransfer.png" alt=""></a>
      </li>
      <li>
        <a href="#"><img src="../../../dist/images/screenshot01.png" alt=""></a>
      </li>
      <li>
        <a href="#"><img src="../../../dist/images/location01.png" alt=""></a>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="less">

</style>