const LIMA_TIME_ZONE = "America/Lima";

const schedule = Object.freeze({
  weekdays: { start: 7 * 60, end: 20 * 60 },
  saturday: { start: 8 * 60 + 30, end: 13 * 60 },
});

const getLimaClock = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LIMA_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value;
  return {
    weekday: value("weekday"),
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  };
};

const isAccessAllowedAt = (date = new Date()) => {
  const { weekday, minutes } = getLimaClock(date);
  if (["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday)) {
    return minutes >= schedule.weekdays.start && minutes < schedule.weekdays.end;
  }
  if (weekday === "Sat") {
    return minutes >= schedule.saturday.start && minutes < schedule.saturday.end;
  }
  return false;
};

const enforceAccessSchedule = (req, res, next) => {
  if (isAccessAllowedAt()) return next();
  return res.status(403).json({
    ok: false,
    code: "ACCESS_OUTSIDE_SCHEDULE",
    message:
      "El sistema está disponible de lunes a viernes de 07:00 a 20:00 y sábados de 08:30 a 13:00 (hora Lima).",
  });
};

module.exports = { enforceAccessSchedule, getLimaClock, isAccessAllowedAt };
