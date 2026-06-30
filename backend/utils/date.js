const { fromZonedTime, toZonedTime } = require("date-fns-tz");

exports.getISTDayRange = () => {
  const timeZone = "Asia/Kolkata";

  const nowIST = toZonedTime(new Date(), timeZone);

  const startIST = new Date(nowIST);
  startIST.setHours(0, 0, 0, 0);

  const endIST = new Date(nowIST);
  endIST.setHours(23, 59, 59, 999);

  return {
    start: fromZonedTime(startIST, timeZone),
    end: fromZonedTime(endIST, timeZone),
  };
};