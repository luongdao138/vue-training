<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue';
import { useMainStore } from '@/stores/main';
import { getTimeSheet } from '@/services/timesheet';
import { mdiEye, mdiTrashCan } from '@mdi/js';
import CardBoxModal from '@/components/CardBoxModal.vue';
import TableCheckboxCell from '@/components/TableCheckboxCell.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import BaseButton from '@/components/BaseButton.vue';
import moment from 'moment';
import { startOfMonth, endOfMonth, useTimeSheet } from '@/stores/timesheet';
defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();

const timesheet = useTimeSheet();
const items = computed(() => mainStore.clients);
const state = reactive({
  items: [],
});
async function fetchData(from, to) {
  const data = await getTimeSheet({ from: from, to: to });
  state.items = data.data.items;
}
onMounted(() => {
  fetchData(startOfMonth, endOfMonth);
});

watch([() => timesheet.from, () => timesheet.to], ([from, to]) => {
  fetchData(from, to);
});

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);

const checkedRows = ref([]);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === client.id
    );
  }
};
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

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />
        <th>Date</th>
        <th>Checkin</th>
        <th>Checkout</th>
        <th>Late</th>
        <th>Early</th>
        <th>In office</th>
        <th>OT</th>
        <th>Work time</th>
        <th>Lack</th>
        <th>Admin note</th>
        <th>Action</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in state.items" :key="client.id">
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="border-b-0 lg:w-6 before:hidden"></td>
        <td data-label="work_date">
          {{ client.work_date }}
        </td>
        <td data-label="checkin">
          {{ moment(client.checkin).format('HH:MM') }}
        </td>
        <td data-label="checkout">
          {{ moment(client.checkout).format('HH:MM') }}
        </td>
        <td data-label="late_time" class="">
          {{ client.late_time }}
        </td>
        <td data-label="early_time" class="whitespace-nowrap">
          {{ client.early_time }}
        </td>
        <td data-label="in_office_time" class="whitespace-nowrap">
          {{ client.in_office_time }}
        </td>
        <td data-label="over_time" class="whitespace-nowrap">
          {{ client.over_time }}
        </td>
        <td data-label="work_time" class="whitespace-nowrap">
          {{ client.work_time }}
        </td>
        <td data-label="lack_time" class="whitespace-nowrap">
          {{ client.lack_time }}
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
