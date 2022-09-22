import moment from "moment";

export const getCurrentDay = (format = "YYYY-MM-DD") => {
  return moment(new Date()).format(format);
};
