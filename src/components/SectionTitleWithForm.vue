<script setup>
import { ref, reactive, watch } from 'vue';
import { startOfMonth, endOfMonth, useTimeSheet } from '@/stores/timesheet';
import moment from 'moment';
defineProps({
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  main: Boolean,
});
const selectOptions = [
  { id: 1, label: 'This month' },
  { id: 2, label: 'Last month' },
  { id: 3, label: 'Today' },
  { id: 4, label: 'Yesterday' },
];

const timesheet = useTimeSheet();
const selectModal = ref(selectOptions[0]);
const endDate = ref(moment(endOfMonth));
const startDate = ref(moment(startOfMonth));
const formType = ref('fromList');
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};
const onSubmit = () => {
  if (formType.value == 'startEnd') {
    timesheet.$patch({
      from: format(moment(startDate.value).toDate()),
      to: format(moment(endDate.value).toDate()),
    });
  }
};

watch([() => selectModal.value], () => {
  switch (selectModal.value.id) {
    case 1:
      timesheet.$patch({
        from: startOfMonth,
        to: endOfMonth,
      });
      break;
    case 2:
      timesheet.$patch({
        from: moment()
          .subtract(1, 'months')
          .startOf('month')
          .format('YYYY-MM-DD'),
        to: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
      });
      break;
    case 3:
      timesheet.$patch({
        from: moment().format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
      });
      break;
    case 4:
      timesheet.$patch({
        from: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        to: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      });
      break;
  }
});

const form = reactive({
  chooseFromList: selectOptions[0],
  from: '',
  to: '',
});
const disableSelect = () => {
  return formType.value !== 'fromList';
};
</script>

<template>
  <section>
    <section
      :class="{ 'pt-6': !main }"
      class="mb-6 flex items-center justify-between"
    >
      <div class="flex items-center justify-start">
        <!-- <IconRounded
          v-if="icon && main"
          :icon="icon"
          color="light"
          class="mr-3"
          bg
        />
        <BaseIcon v-else-if="icon" :path="icon" class="mr-2" size="20" /> -->
        <h1 :class="main ? 'text-3xl' : 'text-2xl'" class="leading-tight">
          {{ title }}
        </h1>
      </div>
      <slot v-if="hasSlot" />
    </section>
    <section>
      <q-form
        ref="form"
        class="q-gutter-md"
        @submit="onSubmit"
        @reset="onReset"
      >
        <div class="row">
          <q-radio
            v-model="formType"
            left-label
            val="fromList"
            class="radio-btn justify-between"
            label="Choose from list:"
          ></q-radio>
          <q-select
            v-model="selectModal"
            style="min-width: 200px"
            class="q-ml-sm"
            :disable="disableSelect()"
            outlined
            :options="selectOptions"
            :option-value="id"
            :option-label="label"
            map-options
            emit-value
          >
            <!-- <template #prepend>
              <q-icon name="name"></q-icon>
            </template> -->
          </q-select>
        </div>
        <div class="row">
          <q-radio
            v-model="formType"
            left-label
            val="startEnd"
            class="radio-btn justify-between"
            label="Choose start, end:"
          ></q-radio>
          <Datepicker
            v-model="startDate"
            :format="format"
            class="q-ml-sm"
            :disabled="!disableSelect()"
          />
        </div>
        <div class="row">
          <Datepicker
            v-model="endDate"
            :disabled="!disableSelect()"
            :format="format"
            class="q-ml-sm"
            style="padding-left: 180px"
          />
        </div>
        <div class="row justify-center">
          <q-btn
            label="Search"
            type="submit"
            color="primary"
            flat
            class="q-mb-lg"
          ></q-btn>
        </div>
      </q-form>
    </section>
  </section>
</template>

<style scoped>
.radio-btn {
  width: 180px;
}
</style>
