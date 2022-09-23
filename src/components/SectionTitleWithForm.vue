<script setup>
import { ref, reactive, watch } from "vue";
import { startOfMonth, endOfMonth, useTimeSheet } from "@/stores/timesheet";
import moment from "moment";
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
  { id: 1, label: "This month" },
  { id: 2, label: "Last month" },
  { id: 3, label: "Today" },
  { id: 4, label: "Yesterday" },
];

const timesheet = useTimeSheet();
const selectModal = ref(selectOptions[0]);
const selectedDate = ref([moment(startOfMonth), moment(endOfMonth)]);
// watch([() => timesheet.from, () => timesheet.to], (from, to) => {
//   selectedDate.value = [moment(from), moment(to)];
// });
const format = (date) => {
  return date.map((date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  });
};

const setSelectedDate = (from, to) => {
  selectedDate.value[0] = moment(from);
  selectedDate.value[1] = moment(to);
  timesheet.$patch({
    from: from,
    to: to,
  });
};

watch([() => selectModal.value], () => {
  switch (selectModal.value.id) {
    case 1:
      setSelectedDate(startOfMonth, endOfMonth);
      break;
    case 2: {
      const from = moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      const to = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
      setSelectedDate(from, to);
      break;
    }
    case 3: {
      const from = moment().format("YYYY-MM-DD");
      const to = moment().format("YYYY-MM-DD");
      setSelectedDate(from, to);
      break;
    }
    case 4: {
      const from = moment().subtract(1, "day").format("YYYY-MM-DD");
      const to = moment().subtract(1, "day").format("YYYY-MM-DD");
      setSelectedDate(from, to);
      break;
    }
  }
});

const form = reactive({
  chooseFromList: selectOptions[0],
  from: "",
  to: "",
});

watch([selectedDate], () => {
  selectModal.value = { id: "", label: "" };
  const submitData = format(selectedDate.value);
  timesheet.$patch({ from: submitData[0], to: submitData[1] });
  // return format(selectedDate);
});
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
        <div class="row justify-start">
          <!-- <q-radio
            v-model="formType"
            left-label
            val="fromList"
            class="radio-btn justify-between"
            label="Choose from list:"
          ></q-radio> -->
          <q-select
            v-model="selectModal"
            class="q-mt-sm"
            outlined
            dense
            @reset="reset"
            :options="selectOptions"
            :option-value="id"
            :option-label="label"
            map-options
            emit-value
          >
            <template v-slot:prepend>
              <q-icon name="event"></q-icon>
            </template>
          </q-select>
          <div class="q-mt-sm row q-ml-lg">
            <Datepicker v-model="selectedDate" range :format="format" />
            <!-- <q-btn
              label="Search"
              type="submit"
              color="secondary"
              glossy
              class="q-ml-lg"
            ></q-btn> -->
          </div>
        </div>
        <!-- <div class="row">
          <q-radio
            v-model="formType"
            left-label
            val="startEnd"
            class="radio-btn justify-between"
            label="Choose start, end:"
          ></q-radio>
        </div>
        <div class="row">
          <Datepicker
            v-model="endDate"
            :disabled="!disableSelect()"
            :format="format"
            class="q-ml-sm"
            style="padding-left: 180px"
          />
        </div> -->
        <div class="row justify-center"></div>
      </q-form>
    </section>
  </section>
</template>

<style scoped>
.radio-btn {
  width: 180px;
}
</style>
