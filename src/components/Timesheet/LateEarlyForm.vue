<script setup>
import { computed, inject, ref } from "vue";
import TimeSheetItem from "./TimeSheetItem.vue";
import TextArea from "../TextArea.vue";
import DatePicker from "../DatePicker.vue";
import { convertDate, checkZeroTime } from "@/utils/datetime";
import moment from "moment";
import { useQuery } from "@/hooks/useQuery";

const reason = ref("");
const compensationDate = ref(null);

const timesheetDetail = inject("timesheetDetail");

const detailData = computed(() => timesheetDetail.value?.data);

// Chỉ những ngày từ ngày được chọn trở về sau (ko tính ngày hôm nay mới được active)
const datePickerOption = (date) => {
  // Những ngày đc active phải cùng năm vả cùng tháng với ngày được chọn
  const startDate = convertDate(detailData.value.work_date, "YYYY/MM/DD");
  const endDate = convertDate(moment().subtract(1, "day"), "YYYY/MM/DD");
  return date >= startDate && endDate >= date;
};

const detailUrl = computed(() => {
  console.log({ compensationDate });
  return `/timesheet/detail?date=${convertDate(compensationDate.value)}`;
});

const {
  data: compensationDateData,
  isLoading: isLoadingCompesationDate,
  isError: isErrorCompensationDate,
  isSuccess: isSuccessCompensationDate,
} = useQuery(
  detailUrl,
  {},
  {
    enabled: compensationDate,
    onSuccess: () => {
      console.log("get compensation date detail success");
    },
  }
);
</script>

<template>
  <div v-if="Boolean(detailData)" class="space-y-3 -mb-8">
    <TimeSheetItem label="Register for date">
      <p>{{ convertDate(detailData.work_date, "dddd, DD/MM/YYYY") }}</p>
    </TimeSheetItem>
    <TimeSheetItem label="Manager">
      <p>{{ detailData.manager_name }}</p>
    </TimeSheetItem>
    <TimeSheetItem label="Other request">
      <p>N/A</p>
    </TimeSheetItem>
    <div class="grid grid-cols-2">
      <TimeSheetItem label="Checkin">
        <p>{{ convertDate(detailData.checkin, "HH:mm") }}</p>
      </TimeSheetItem>
      <TimeSheetItem label="Checkout">
        <p>{{ convertDate(detailData.checkout, "HH:mm") }}</p>
      </TimeSheetItem>
    </div>
    <div class="grid grid-cols-2">
      <TimeSheetItem label="Late time">
        <p v-if="!checkZeroTime(detailData.late_time)" class="text-red-600">
          {{ detailData.late_time }}
        </p>
      </TimeSheetItem>
      <TimeSheetItem label="Early time">
        <p v-if="!checkZeroTime(detailData.early_time)" class="text-red-600">
          {{ detailData.early_time }}
        </p>
      </TimeSheetItem>
    </div>
    <TimeSheetItem label="Compensation date" required>
      <DatePicker v-model="compensationDate" :options="datePickerOption" />
      <div
        v-if="isSuccessCompensationDate"
        class="mt-2 flex items-center space-x-3"
      >
        <div>
          <span>Overtime: </span>
          <span class="text-red-600">{{
            compensationDateData?.data.over_time
          }}</span>
        </div>
        <div>|</div>
        <div>
          <span>Time requested: </span>
          <span class="text-red-600">{{
            compensationDateData?.data.requested_time
          }}</span>
        </div>
      </div>
      <div v-if="isLoadingCompesationDate" class="mt-2">Waiting...</div>
      <div v-if="isErrorCompensationDate" class="mt-2">Error...</div>
    </TimeSheetItem>
    <TimeSheetItem label="Reason" required>
      <TextArea v-model="reason" />
    </TimeSheetItem>
  </div>
</template>

<style scoped>
.active {
  color: rgb(239 68 68);
}
</style>
