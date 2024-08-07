// import * as sqlite3 from "sqlite3";
// import {NexxiotVehicle} from "./nexxiot_main";

// export class NexxiotSaveSqlite {
//    private static db: sqlite3.Database = null!;
//    private static initialized = false;

//    public static async Init(): Promise<void> {
//       if (NexxiotSaveSqlite.initialized) return;
//       NexxiotSaveSqlite.initialized = true;

//       NexxiotSaveSqlite.db = new sqlite3.Database("nexxiot.db");
//       NexxiotSaveSqlite.db.serialize(() => {
//          NexxiotSaveSqlite.db.run(`CREATE TABLE IF NOT EXISTS nexxiot_vehicles (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             nexxiot_id TEXT,
//             nexxiot_data TEXT
//          )`);
//       });
//       console.log("DB initialized");
//    }
//    public static async SaveVehicle(nv: NexxiotVehicle): Promise<void> { 
//       if (!NexxiotSaveSqlite.initialized) 
//          await NexxiotSaveSqlite.Init();
//       NexxiotSaveSqlite.db.run(`INSERT INTO nexxiot_vehicles(nexxiot_id, nexxiot_data) VALUES (?, ?)`, [nv.id, JSON.stringify(nv)]);
//    }
// }