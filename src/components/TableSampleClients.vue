<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue';
import { getTimeSheet } from '@/services/timesheet';
import { mdiEye, mdiTrashCan } from '@mdi/js';
import CardBoxModal from '@/components/CardBoxModal.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseButton from '@/components/BaseButton.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import moment from 'moment';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import { isEmpty } from 'lodash';

import { startOfMonth, endOfMonth, useTimeSheet } from '@/stores/timesheet';
defineProps({
  checkable: Boolean,
});

const timesheet = useTimeSheet();
const state = reactive({
  items: [],
});
async function fetchData(from, to) {
  const data = await getTimeSheet({ from: from, to: to });
  state.items = data.data.items;
  timesheet.$patch({ loading: false });
}
onMounted(() => {
  fetchData(startOfMonth, endOfMonth);
});

watch([() => timesheet.from, () => timesheet.to], ([from, to]) => {
  fetchData(from, to);
});

const getDaysArray = function () {
  var date = moment(timesheet.from).clone();
  var result = [];
  while (date.isSameOrBefore(timesheet.to)) {
    result.push({ work_date: moment(date).format('YYYY-MM-DD') });
    date.add(1, 'days');
  }
  return result;
};

const TimeSheetItems = computed(() => {
  console.log(
    getDaysArray().map((items) => {
      for (let item of state.items) {
        if (items.work_date == item.work_date) {
          items = { ...items, ...item };
        }
      }
      return items;
    }), state.items
  );
  return getDaysArray().map((items) => {
    for (let item of state.items) {
      if (items.work_date == item.work_date) {
        items = { ...items, ...item };
      }
    }
    return items;
  });
  // return [...state.items];
});

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(10);

const currentPage = ref(0);

const numPages = computed(() =>
  Math.ceil(TimeSheetItems.value.length / perPage.value)
);

const itemsPaginated = computed(() =>
  TimeSheetItems.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDangerActive"
    title="Please confirm"
    button="danger"
    has-cancel
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>
  <table>
    <thead>
      <tr>
        <!-- <th> -->
        <th class="text-center border-b-0 lg:w-4">No</th>
        <th class="text-center lg:w-24">Date</th>
        <th class="text-center">Checkin</th>
        <th class="text-center">Checkout</th>
        <th class="text-center">Late</th>
        <th class="text-center">Early</th>
        <th class="text-center">In office</th>
        <th class="text-center">OT</th>
        <th class="text-center">Work time</th>
        <th class="text-center">Lack</th>
        <th class="text-center">Admin note</th>
        <th>Action</th>
        <!-- <th /> -->
      </tr>
    </thead>
    <tbody v-if="timesheet.loading">
      <td colspan="100%" class="justify-center" style="height: 300px">
        <LoadingOverlay style="margin-left: 46%" />
      </td>
    </tbody>
    <!-- <tbody v-else-if="!timesheet.loading & isEmpty(state.items)">
      <td colspan="100%" class="justify-center" style="height: 300px">
        <CardBox>
          <CardBoxComponentEmpty />
        </CardBox>
      </td>
    </tbody> -->
    <tbody v-else>
      <tr
        v-for="(timeSheetItem, index) in itemsPaginated"
        :key="timeSheetItem.id"
      >
        <td class="text-center border-b-0 lg:w-4">{{ index + 1 }}</td>
        <td class="text-center lg:w-24" data-label="work_date">
          {{ timeSheetItem.work_date }}
        </td>
        <td data-label="checkin" class="text-red-3 text-center">
          {{
            !isEmpty(timeSheetItem.checkin)
              ? moment(timeSheetItem.checkin).format('HH:MM')
              : ''
          }}
        </td>
        <td data-label="checkout" class="text-center">
          {{
            !isEmpty(timeSheetItem.checkout)
              ? moment(timeSheetItem.checkout).format('HH:MM')
              : ''
          }}
        </td>
        <td data-label="late_time" class="text-center text-red-3">
          {{ timeSheetItem.late_time }}
        </td>
        <td data-label="early_time" class="text-center whitespace-nowrap">
          {{ timeSheetItem.early_time }}
        </td>
        <td data-label="in_office_time" class="text-center whitespace-nowrap">
          {{ timeSheetItem.in_office_time }}
        </td>
        <td data-label="over_time" class="text-center whitespace-nowrap">
          {{ timeSheetItem.over_time }}
        </td>
        <td data-label="work_time" class="text-center whitespace-nowrap">
          {{ timeSheetItem.work_time }}
        </td>
        <td data-label="lack_time" class="text-center whitespace-nowrap">
          {{ timeSheetItem.lack_time }}
        </td>
        <td></td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="isModalActive = true"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
