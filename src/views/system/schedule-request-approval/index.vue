<template>
  <div class="container">
    <Breadcrumb
      :items="['menu.system', 'menu.system.scheduleRequestApproval']"
    />
    <ApprovalList />
  </div>
</template>

<script lang="ts" setup>
  import ApprovalList from './components/approval-list.vue';
</script>

<script lang="ts">
  export default {
    name: 'ScheduleRequestApprovalPage',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px;
  }
</style>
