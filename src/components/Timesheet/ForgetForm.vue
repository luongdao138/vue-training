<script setup>
import { computed, inject, ref, watch, watchEffect } from "vue";
import TimePicker from "../TimePicker.vue";
import Checkbox from "../Checkbox.vue";
import TimeSheetItem from "./TimeSheetItem.vue";
import TextArea from "../TextArea.vue";
import { convertDate, compareDateVsSetting } from "@/utils/datetime";
import { storeToRefs } from "pinia";
import { useAuth } from "@/stores/auth";
import { MAX_REQUEST } from "@/constants/timesheet";

// temporary
const right = ref(false);

// Lấy thông tin timesheet detail từ component cha
const timesheetDetail = inject("timesheetDetail");

const authStore = useAuth();
const { user } = storeToRefs(authStore);
const detailData = computed(() => timesheetDetail.value?.data);
const isValidCheckinTime = computed(() => {
  return compareDateVsSetting(
    detailData.value.checkin,
    user.value.checkin_setting,
    "<="
  );
});
const isValidCheckoutTime = computed(() => {
  return compareDateVsSetting(
    detailData.value.checkout,
    user.value.checkout_setting,
    ">="
  );
});

const isCheckinChange = computed(() => {
  return checkinTime.value !== convertDate(detailData.value?.checkin, "HH:mm");
});
const isCheckoutChange = computed(() => {
  return (
    checkoutTime.value !== convertDate(detailData.value?.checkout, "HH:mm")
  );
});

const reason = ref("");
const countedError = ref(0);
const checkinTime = ref(convertDate(detailData.value?.checkin, "HH:mm"));
const checkoutTime = ref(convertDate(detailData.value?.checkout, "HH:mm"));
const isCheckinChecked = ref(false);
const isCheckoutChecked = ref(false);
const skipErrorCheckin = ref(false);
const skipErrorCheckout = ref(false);

watch(
  () => ({ ...detailData.value }),
  (newValue) => {
    checkinTime.value = newValue.checkin;
    checkoutTime.value = newValue.checkout;
  }
);

// const handleChangeTime = (newTime, oldTime, comparedValue) => {
//   console.log({ newTime, oldTime });
//   if (oldTime === convertDate(comparedValue, "HH:mm")) {
//     countedError.value++;
//   }

//   if (newTime === convertDate(comparedValue, "HH:mm")) {
//     countedError.value--;
//   }
// };

// watch(checkinTime, (newTime, oldTime) =>
//   handleChangeTime(newTime, oldTime, detailData.value?.checkin)
// );
// watch(checkoutTime, (newTime, oldTime) =>
//   handleChangeTime(newTime, oldTime, detailData.value?.checkout)
// );

watch(isCheckinChecked, (newVal) => {
  if (newVal) {
    checkinTime.value = checkinLabel.value;
  } else {
    checkinTime.value = convertDate(detailData.value.checkin, "HH:mm");
  }
});

watch(isCheckoutChecked, (newVal) => {
  if (newVal) {
    checkoutTime.value = checkoutLabel.value;
  } else {
    checkoutTime.value = convertDate(detailData.value.checkout, "HH:mm");
  }
});

const checkinLabel = computed(() => {
  return isValidCheckinTime.value
    ? convertDate(detailData.value.checkin, "HH:mm")
    : user.value.checkin_setting;
});

const checkoutLabel = computed(() => {
  return isValidCheckoutTime.value
    ? convertDate(detailData.value.checkout, "HH:mm")
    : user.value.checkout_setting;
});
</script>

<template>
  <div v-if="detailData" class="space-y-3 -mb-8">
    <TimeSheetItem label="Register for date">
      <p>{{ convertDate(detailData?.work_date) }}</p>
    </TimeSheetItem>
    <TimeSheetItem label="Manager">
      <p>{{ detailData?.manager_name }}</p>
    </TimeSheetItem>
    <TimeSheetItem label="Other request">
      <p>N/A</p>
    </TimeSheetItem>
    <TimeSheetItem required label="Checkin">
      <div class="flex items-center">
        <TimePicker v-model="checkinTime" class="flex-1 mr-2" />
        <span class="">({{ convertDate(detailData?.checkin, "HH:mm") }})</span>
        <Checkbox
          v-model="isCheckinChecked"
          :disable="isValidCheckinTime"
          :label="checkinLabel"
          class="ml-4"
          size="xs"
        />
      </div>
    </TimeSheetItem>
    <TimeSheetItem required label="Checkout">
      <div class="flex items-center">
        <TimePicker v-model="checkoutTime" class="flex-1 mr-2" />
        <span class="">({{ convertDate(detailData?.checkout, "HH:mm") }})</span>
        <Checkbox
          v-model="isCheckoutChecked"
          :disable="isValidCheckoutTime"
          :label="checkoutLabel"
          class="ml-4"
          size="xs"
        />
      </div>
    </TimeSheetItem>
    <TimeSheetItem label="Special reason">
      <div class="flex items-center">
        <Checkbox
          v-model="skipErrorCheckin"
          label="Checkin not counted as error"
          size="xs"
          :disable="!isCheckinChange"
        />
        <Checkbox
          v-model="skipErrorCheckout"
          label="Checkout not counted as error"
          class="ml-4"
          size="xs"
          :disable="!isCheckoutChange"
        />
      </div>
    </TimeSheetItem>
    <TimeSheetItem label="Reason" required>
      <TextArea v-model="reason" />
    </TimeSheetItem>
    <div>
      <span class="text-red-500 font-medium text-xs"
        >checkin must smaller than checkout</span
      >
      <p class="text-red-500 font-semibold">
        {{ countedError }} error(s) will be counted, You are allowed to get
        {{ MAX_REQUEST - detailData?.forget_request }}/{{ MAX_REQUEST }}
        error(s)
      </p>
    </div>
  </div>
</template>
