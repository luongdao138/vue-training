<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import TableSampleClients from '@/components/TableSampleClients.vue';
import CardBox from '@/components/CardBox.vue';
import SectionTitleWithForm from '@/components/SectionTitleWithForm.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import BaseButton from '@/components/BaseButton.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleWithForm :icon="mdiTableBorder" title="My timesheet" main>
        <!-- <BaseButton target="_blank" label="Add" color="info" rounded-full /> -->
      </SectionTitleWithForm>
      <!-- <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar> -->

      <CardBox class="mb-6" has-table>
        <TableSampleClients checkable />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiTableOff" title="Empty variation" />

      <NotificationBar color="danger" :icon="mdiTableOff">
        <b>Empty table.</b> When there's nothing to show
      </NotificationBar>

      <CardBox>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style lang="scss" scoped></style>
