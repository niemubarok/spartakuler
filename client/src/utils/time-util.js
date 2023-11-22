import { useTransaksiStore } from "src/stores/transaksi-store";

const transaksiStore = useTransaksiStore();
export const zeroPad = (n) => {
  return (n < 10 ? "0" : "") + n;
};

export const dayName = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jum'at",
  "Sabtu",
];

export const getDayName = (date) => {
  const initDate = new Date(date);
  const day = initDate.getDay();

  return day == 0 ? dayName[0] : dayName[day];
};

export const getTime = () => {
  const currentDate = new Date();
  const today = currentDate.getDay();
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const day = getDayName(currentDate);
  const hours = zeroPad(currentDate.getHours());
  const minutes = zeroPad(currentDate.getMinutes());
  const seconds = zeroPad(currentDate.getSeconds());
  return {
    today,
    day,
    date,
    hours,
    minutes,
    seconds,
    fullDate: date + "/" + (month + 1) + "/" + year,
    time: hours + ":" + minutes + ":" + seconds,
  };
};

export const setTime = (h, m, s) => {
  const currentDate = new Date();
  currentDate.setHours(h, m, s);

  return {
    hours: zeroPad(currentDate.getHours()),
    minutes: zeroPad(currentDate.getMinutes()),
  };
};

export const compareTime = (time1, time2, comparison) => {
  const [hour1, minute1, second1] = time1.split(":");
  const [hour2, minute2, second2] = time2.split(":");

  const date1 = new Date(2022, 0, 1, +hour1, +minute1, +second1).getTime();
  const date2 = new Date(2022, 0, 1, +hour2, +minute2, +second2).getTime();

  if (comparison == "equal") {
    return date1 == date2;
  } else if (comparison == "lt") {
    return date1 < date2;
  } else if (comparison == "gt") {
    return date1 > date2;
  }
};

export const timeToMillisecond = (t) => {
  if (t) {
    return (
      Number(t.split(":")[0]) * 3600000 +
      Number(t.split(":")[1]) * 60000 +
      Number(t.split(":")[2]) * 1000
    );
  }
};

export const addMinutes = (t, m) => {
  const time = new Date(
    new Date("1970/01/01 " + t).getTime() + m * 60000
  ).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return time;
};

export const isValidTime = (time) => {
  return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/gm.test(time);
};

export const checkSubscriptionExpiration = (subscriptionEndDate) => {
  const currentDate = new Date();
  const endDate = new Date(subscriptionEndDate);

  if (currentDate < endDate) {
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysLeft = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hoursLeft = Math.floor(
      (timeDiff % (1000 * 3600 * 24)) / (1000 * 3600)
    );
    const minutesLeft = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
    transaksiStore.isMemberExpired = false;
    // return `Berakhir pada ${daysLeft} hari, ${hoursLeft} jam, ${minutesLeft} menit, dan ${secondsLeft} detik.`;
    return `Berakhir pada ${daysLeft} hari, ${hoursLeft} jam, ${minutesLeft} menit`;
  } else {
    transaksiStore.isMemberExpired = true;
    return "Langganan sudah berakhir.";
  }
};

export const calculateParkingDuration = (entryTime) => {
  const currentTime = new Date();
  const targetTime = new Date(entryTime);
  const diffInMilliseconds = currentTime - targetTime;

  const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

export const timeRegex24Format =
  /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/gm;
