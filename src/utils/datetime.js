import moment from "moment";

export const convertDate = (date, format = "YYYY-MM-DD") => {
  if (!date) return "";
  return moment(date).format(format);
};

export const compareDateVsSetting = (date, setting, operation = ">") => {
  let [hourSetting, minSetting] = setting.split(":");
  hourSetting = Number(hourSetting);
  minSetting = Number(minSetting);

  date = new Date(date);

  const hourCompare = new Date(date).getHours();
  const minCompare = new Date(date).getMinutes();

  // console.log({ hourCompare, minCompare, hourSetting, minSetting });

  switch (operation) {
    case ">":
      return hourCompare > hourSetting && minCompare > minSetting;

    case "<":
      return hourCompare < hourSetting && minCompare < minSetting;

    case "<=":
      return hourCompare <= hourSetting && minCompare <= minSetting;

    case ">=":
      return hourCompare >= hourSetting && minCompare >= minSetting;

    default:
      return false;
  }
};
