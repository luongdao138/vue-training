import { getTimeSheet } from '@/services/timesheet';
import { defineStore } from 'pinia';
import moment from 'moment';
export interface TimeSheetData {
  total_work_time: string;
  items: any[];
  from: string;
  to: string;
}
export const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
export const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
export const useTimeSheet = defineStore('timesheet', {
  state(): TimeSheetData {
    return {
      total_work_time: '',
      items: [],
      from: startOfMonth,
      to: endOfMonth,
    };
  },
  actions: {
    async getNewTimeSheet(state: any) {
      try {
        const res = await getTimeSheet({ from: state.from, to: state.to });
        this.total_work_time = res.data.data.total_work_time;
        this.items = res.data.data.items;
        this.from = res.data.data.from;
        this.to = res.data.data.to;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
