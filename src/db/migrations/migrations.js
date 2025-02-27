import m0000 from "./0000_free_reaper.sql";
import m0001 from "./0001_seed-habits.sql";
import m0002 from "./0002_legal_apocalypse.sql";
import m0003 from "./0003_update-habits.sql";
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
