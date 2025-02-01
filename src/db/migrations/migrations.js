import m0000 from "./0000_free_reaper.sql";
import m0001 from "./0001_seed-habits.sql";
import journal from "./meta/_journal.json";

export default {
  journal,
  migrations: {
    m0000,
    m0001,
  },
};
