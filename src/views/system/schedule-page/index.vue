<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.schedulePage']" />
    <div class="layout">
      <div class="layout-left-side">
        <DoctorPanel :selected-doctor="selectedDoctor" />
      </div>
      <div class="layout-right-side">
        <ScheduleCalendar
          :selected-doctor-id="selectedDoctorId"
          :selected-doctor-name="selectedDoctorName"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import DoctorPanel from './components/doctor-panel.vue';
  import ScheduleCalendar from './components/schedule-calendar.vue';

  const selectedDoctorId = ref<number>(0);
  const selectedDoctorName = ref<string>('');

  const selectedDoctor = (doctorId: number, doctorName: string) => {
    selectedDoctorId.value = doctorId;
    selectedDoctorName.value = doctorName;
  };
</script>

<script lang="ts">
  export default {
    name: 'SchedulePage',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 0 20px 20px;
  }

  .layout {
    display: flex;

    &-left-side {
      flex: 1;
      margin: 0 10px;
    }

    &-right-side {
      flex: 2;
      margin: 0 10px;
    }
  }

  @media (max-width: @screen-lg) {
    .layout {
      flex-direction: column;
    }
  }
</style>
