<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.operationRulePage']" />
    <OperationRuleList />
  </div>
</template>

<script lang="ts" setup>
  import OperationRuleList from './components/operation-rule-list.vue';
</script>

<script lang="ts">
  export default {
    name: 'OperationRulePage',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px;
  }
</style>
