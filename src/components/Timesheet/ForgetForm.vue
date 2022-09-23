<script setup>
import { computed, inject, ref, watch, watchEffect } from "vue";
import TimePicker from "../TimePicker.vue";
import Checkbox from "../Checkbox.vue";
import TimeSheetItem from "./TimeSheetItem.vue";
import TextArea from "../TextArea.vue";
import { convertDate, compareTwoTime, changeTime } from "@/utils/datetime";
import { storeToRefs } from "pinia";
import { useAuth } from "@/stores/auth";
import { MAX_REQUEST } from "@/constants/timesheet";

defineProps({
  selectedDate: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["disableSubmitBtn", "enableSubmitBtn"]);

// Lấy thông tin timesheet detail từ component cha
const timesheetDetail = inject("timesheetDetail");

const authStore = useAuth();
const { user } = storeToRefs(authStore);
const detailData = computed(() => timesheetDetail.value?.data);
// const detailData = computed(() => ({
//   checkin: "2022-09-05 08:36:34",
//   checkout: "2022-09-05 08:35:34",
// }));

const reason = ref("");
const countedError = ref(0);
const checkinTime = ref(convertDate(detailData.value?.checkin, "HH:mm"));
const checkoutTime = ref(convertDate(detailData.value?.checkout, "HH:mm"));
const isCheckinChecked = ref(false);
const isCheckoutChecked = ref(false);
const skipErrorCheckin = ref(false);
const skipErrorCheckout = ref(false);
const error = ref(null);

const formattedCheckinTime = computed(() =>
  convertDate(detailData.value?.checkin, "HH:mm")
);
const formattedCheckoutTime = computed(() =>
  convertDate(detailData.value?.checkout, "HH:mm")
);

watch(
  () => ({ ...detailData.value }),
  (newValue) => {
    checkinTime.value = newValue.checkin;
    checkoutTime.value = newValue.checkout;
  }
);

watch(isCheckinChecked, (newVal) => {
  if (newVal) {
    checkinTime.value = checkinLabel.value;
  } else {
    checkinTime.value = formattedCheckinTime.value;
  }
});

watch(isCheckoutChecked, (newVal) => {
  if (newVal) {
    checkoutTime.value = checkoutLabel.value;
  } else {
    checkoutTime.value = formattedCheckoutTime.value;
  }
});

watch(
  [checkinTime, skipErrorCheckin],
  ([newTime, newChange], [oldTime, oldChange]) => {
    if (newChange === oldChange) {
      if (newTime === formattedCheckinTime.value) {
        if (!newChange) {
          countedError.value--;
        }

        skipErrorCheckin.value = false;
      }
      if (oldTime === formattedCheckinTime.value && !newChange) {
        countedError.value++;
      }
    } else {
      if (newTime !== formattedCheckinTime.value) {
        if (!newChange) {
          countedError.value++;
        } else {
          countedError.value--;
        }
      }
    }
  }
);
watch(
  [checkoutTime, skipErrorCheckout],
  ([newTime, newChange], [oldTime, oldChange]) => {
    if (newChange === oldChange) {
      if (newTime === formattedCheckoutTime.value) {
        if (!newChange) {
          countedError.value--;
        }
        skipErrorCheckout.value = false;
      }
      if (oldTime === formattedCheckoutTime.value && !newChange) {
        countedError.value++;
      }
    } else {
      if (newTime !== formattedCheckoutTime.value) {
        if (!newChange) {
          countedError.value++;
        } else {
          countedError.value--;
        }
      }
    }
  }
);

const checkinLabel = computed(() => {
  return isValidCheckinTime.value
    ? formattedCheckinTime.value
    : user.value.checkin_setting;
});

const checkoutLabel = computed(() => {
  return isValidCheckoutTime.value
    ? formattedCheckoutTime.value
    : user.value.checkout_setting;
});

const isValidCheckinTime = computed(() => {
  return (
    detailData.value?.checkin &&
    compareTwoTime(
      formattedCheckinTime.value,
      changeTime(user.value.checkin_setting, 5),
      "<="
    )
  );
});
const isValidCheckoutTime = computed(() => {
  return (
    detailData.value.checkout &&
    compareTwoTime(
      formattedCheckoutTime.value,
      changeTime(user.value.checkout_setting, -5),
      ">="
    )
  );
});

const isCheckinChange = computed(() => {
  return checkinTime.value !== formattedCheckinTime.value;
});
const isCheckoutChange = computed(() => {
  return checkoutTime.value !== formattedCheckoutTime.value;
});

const isShowErrorRequest = computed(() => {
  return !isValidCheckinTime.value || !isValidCheckoutTime.value;
});

watchEffect(() => {
  // if (!checkinTime.value && !checkoutTime.value) {
  //   emit("disableSubmitBtn");
  //   return;
  // }
  if (isShowErrorRequest.value) {
    if (compareTwoTime(checkinTime.value, checkoutTime.value, ">=")) {
      error.value = "check in must snaller than checkout";
      emit("disableSubmitBtn");
    } else {
      error.value = null;
      emit("enableSubmitBtn");
    }
  } else {
    if (isCheckinChange.value || isCheckoutChange.value) {
      emit("enableSubmitBtn");
    } else {
      emit("disableSubmitBtn");
    }
  }
});
</script>

<template>
  <div v-if="detailData" class="space-y-3 -mb-8">
    <TimeSheetItem label="Register for date">
      <p>{{ convertDate(detailData?.work_date, "dddd, DD/MM/YYYY") }}</p>
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
        <span v-if="Boolean(detailData.checkin)"
          >({{ convertDate(detailData?.checkin, "HH:mm") }})</span
        >
        <span v-if="!Boolean(detailData.checkin)">(N/A)</span>
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
        <span v-if="Boolean(detailData.checkout)"
          >({{ convertDate(detailData?.checkout, "HH:mm") }})</span
        >
        <span v-if="!Boolean(detailData.checkout)">(N/A)</span>
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
      <span
        v-if="Boolean(error) && isShowErrorRequest"
        class="text-red-500 font-medium text-xs"
        >checkin must smaller than checkout</span
      >
      <span v-if="!isShowErrorRequest" class="text-red-500 font-medium text-xs"
        >You must change time checkin or checkout</span
      >
      <p v-if="isShowErrorRequest" class="text-red-500 font-semibold">
        {{ countedError }} error(s) will be counted, You are allowed to get
        {{ MAX_REQUEST - detailData?.forget_request }}/{{ MAX_REQUEST }}
        error(s)
      </p>
    </div>
  </div>
</template>
