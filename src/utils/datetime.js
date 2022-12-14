import moment from "moment";

export const converTimeToNumber = (time) => {
  if (!time) return [0, 0];
  let [hour, min] = time.split(":");

  hour = Number(hour);
  min = Number(min);

  return [hour, min];
};

export const convertDate = (date, format = "YYYY-MM-DD") => {
  if (!date) return "";
  return moment(date).format(format);
};

export const formatTimeNumber = (value) =>
  `${value < 10 ? `0${value}` : value}`;

export const compareTwoTime = (time1, time2, operation = ">") => {
  const [hour1, min1] = converTimeToNumber(time1);
  const [hour2, min2] = converTimeToNumber(time2);

  switch (operation) {
    case ">":
      return hour1 > hour2 && min1 > min2;

    case "<":
      return hour1 < hour2 && min1 < min2;

    case "<=":
      return hour1 <= hour2 && min1 <= min2;

    case ">=":
      return hour1 >= hour2 && min1 >= min2;

    default:
      return false;
  }
};

export const compareDateVsSetting = (date, setting, operation = ">") => {
  date = new Date(date);
  const timeCompare = moment(date).format("HH:mm");

  return compareTwoTime(timeCompare, setting, operation);
};

export const changeTime = (time, amount = 0) => {
  if (amount === 0) return time;

  const [hour, min] = converTimeToNumber(time);

  if (amount > 0) {
    if (min + amount <= 59) {
      return [formatTimeNumber(hour), formatTimeNumber(min + amount)].join(":");
    } else {
      const new_min = amount - (60 - min);
      return [formatTimeNumber(hour + 1), formatTimeNumber(new_min)].join(":");
    }
  } else {
    if (min + amount >= 0) {
      return [formatTimeNumber(hour), formatTimeNumber(min + amount)].join(":");
    } else {
      const new_min = 60 + min + amount;
      return [formatTimeNumber(hour - 1), formatTimeNumber(new_min)].join(":");
    }
  }
};

export const checkEqualDays = (day1, day2, unit = "day") => {
  day1 = new Date(day1);
  day2 = new Date(day2);
  return moment(day1).isSame(new Date(), unit);
};

export const checkZeroTime = (time) => {
  const [hour, min] = converTimeToNumber(time);

  return hour === 0 && min === 0;
};
