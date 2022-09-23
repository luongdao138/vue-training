<script setup>
import { ref } from "vue";
import TimeSheetItem from "./TimeSheetItem.vue";
import TextArea from "../TextArea.vue";
import DatePicker from "../DatePicker.vue";

const reason = ref("");
const compensationDate = ref("23-09-2022");
</script>

<template>
  <div class="space-y-3 -mb-8">
    <TimeSheetItem label="Register for date">
      <p>2022-09-08</p>
    </TimeSheetItem>
    <TimeSheetItem label="Manager">
      <p>Nguyễn Đức Sơn</p>
    </TimeSheetItem>
    <TimeSheetItem label="Other request">
      <p>N/A</p>
    </TimeSheetItem>
    <div class="grid grid-cols-2">
      <TimeSheetItem label="Checkin">
        <p>08:55</p>
      </TimeSheetItem>
      <TimeSheetItem label="Checkout">
        <p>18:08</p>
      </TimeSheetItem>
    </div>
    <div class="grid grid-cols-2">
      <TimeSheetItem label="Late time">
        <p>00:25</p>
      </TimeSheetItem>
      <TimeSheetItem label="Early time">
        <p>00:25</p>
      </TimeSheetItem>
    </div>
    <TimeSheetItem label="Compensation date" required>
      <DatePicker v-model="compensationDate" />
      <div class="mt-2 flex items-center space-x-3">
        <div>
          <span>Overtime: </span>
          <span>00:05</span>
        </div>
        <div>|</div>
        <div>
          <span>Time requested: </span>
          <span>00:00</span>
        </div>
      </div>
    </TimeSheetItem>
    <TimeSheetItem label="Reason" required>
      <TextArea v-model="reason" />
    </TimeSheetItem>
  </div>
</template>
