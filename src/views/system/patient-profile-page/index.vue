<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.patientProfilePage']" />
    <PatientProfileList />
  </div>
</template>

<script lang="ts" setup>
  import PatientProfileList from './components/patient-profile-list.vue';
</script>

<script lang="ts">
  export default {
    name: 'PatientProfilePage',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px;
  }
</style>
