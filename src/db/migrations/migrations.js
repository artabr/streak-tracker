import m0000 from "./0000_icy_sebastian_shaw.sql";
import m0001 from "./0001_user-settings.sql";
import m0002 from "./0002_habits.sql";
import m0003 from "./0003_calendar-marks.sql";
import journal from "./meta/_journal.json";

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
  },
};
