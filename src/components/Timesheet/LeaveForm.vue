<script setup>
import { useAuth } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { computed, inject, ref, watch } from "vue";
import TimeSheetItem from "./TimeSheetItem.vue";
import DatePicker from "../DatePicker.vue";
import { convertDate } from "@/utils/datetime";
import Checkbox from "../Checkbox.vue";
import TextArea from "../TextArea.vue";

defineProps({});

const emit = defineEmits(["disableSubmitBtn", "enableSubmitBtn"]);

// Lấy thông tin timesheet detail từ component cha
const timesheetDetail = inject("timesheetDetail");

const authStore = useAuth();
const { user } = storeToRefs(authStore);
const detailData = computed(() => timesheetDetail.value?.data);

const registerForDate = ref(detailData.value?.work_date);
const leaveAllDay = ref(true);
const reason = ref("");

watch(
  () => ({ ...detailData.value }),
  (newValue) => {
    registerForDate.value = newValue.work_date;
  }
);
</script>

<template setup>
  <TimeSheetItem label="Register for date">
    <DatePicker v-model="registerForDate" />
  </TimeSheetItem>
  <TimeSheetItem label="Manager">
    <p>{{ detailData?.manager_name }}</p>
  </TimeSheetItem>
  <TimeSheetItem label="Other request">
    <p>N/A</p>
  </TimeSheetItem>

  <div class="grid grid-cols-2">
    <TimeSheetItem label="Checkin">
      <p>
        {{ convertDate(detailData.checkin, "HH:mm") }}
      </p>
    </TimeSheetItem>
    <TimeSheetItem label="Checkout">
      <p>
        {{ convertDate(detailData.checkout, "HH:mm") }}
      </p>
    </TimeSheetItem>
  </div>

  <div class="grid grid-cols-2">
    <TimeSheetItem label="Work time">
      <p>
        {{ detailData.work_time }}
      </p>
    </TimeSheetItem>
    <TimeSheetItem label="Lack time">
      <p>
        {{ detailData.lack_time }}
      </p>
    </TimeSheetItem>
  </div>

  <TimeSheetItem label="Leave all day">
    <Checkbox v-model="leaveAllDay" />
  </TimeSheetItem>

  <TimeSheetItem label="Range" required>
    <p>Range</p>
  </TimeSheetItem>

  <TimeSheetItem label="Reason" required>
    <TextArea v-model="reason" />
  </TimeSheetItem>

  <div class="italic">
    <p>- Trường hợp nghỉ cả ngày thì chọn "leave all day"</p>
    <p>
      - Trường hợp nghỉ cả sáng cả chiều (không nghỉ cả ngày)
      <br />
      thì cần tạo 2 khoảng thời gian tương ứng không trùng với khoảng thời gian
      nghỉ trưa
    </p>
  </div>

  <div>
    <p>- Leave time: 08:00</p>
    <p class="text-red-600">Time range cannot content lunch time</p>
    <p class="text-amber-500">* Warning leave time 08:00 > lack time</p>
  </div>
</template>
