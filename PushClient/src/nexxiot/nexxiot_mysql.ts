import * as fs from "fs";
import * as mysql from "mysql2/promise";
import { Config } from "../conf";
import { NexxiotVehicle } from "./nexxiot_main";

export type NexxiotVehicleFlattenedDB = {
   id: string,
   external_id: string,
   display_name: string,
   tags: string,
   legacy_id: string,
   metadata: string,
   create_time: string,
   update_time: string,
   group_ids: string,

   state_connect_time?: string,
   state_location_lat?: number,
   state_location_lon?: number,
   state_location_measure_time?: string,
   state_location_country_code?: string,
   state_location_display_name?: string,
   state_movement_state?: string,
   state_movement_change_time?: string,
   state_movement_measure_time?: string,
}
export function nexxiotVehicleFlatten(v: NexxiotVehicle): NexxiotVehicleFlattenedDB {
   const vf: NexxiotVehicleFlattenedDB = {
      id: v.id,
      external_id: v.external_id,
      display_name: v.display_name,
      tags: JSON.stringify(v.tags),
      legacy_id: v.legacy_id,
      metadata: JSON.stringify(v.metadata),
      create_time: v.create_time,
      update_time: v.update_time,
      group_ids: JSON.stringify(v.group_ids),

      state_connect_time: v.state?.connect_time,
      state_location_lat: v.state?.location?.point?.lat,
      state_location_lon: v.state?.location?.point?.lon,
      state_location_measure_time: v.state?.location?.measure_time,
      state_location_country_code: v.state?.location?.country_code,
      state_location_display_name: v.state?.location?.display_name,
      state_movement_state: v.state?.movement?.state,
      state_movement_change_time: v.state?.movement?.change_time,
      state_movement_measure_time: v.state?.movement?.measure_time,
   };
   return vf;
}

export class NexxiotDB {
   private static initialized: boolean = false;
   private static conn: mysql.Pool = null!;
   
   private static async InitializeConnection() {
      if (NexxiotDB.initialized) return;
      NexxiotDB.conn = mysql.createPool({
         host: Config.Current.nexxiot.db.host,
         port: Config.Current.nexxiot.db.port,
         user: Config.Current.nexxiot.db.user,
         password: Config.Current.nexxiot.db.password,
         database: "nexxiot",
      });
      NexxiotDB.initialized = true;
   }
   public static get Connection(): mysql.Pool {
      if (!NexxiotDB.initialized) 
         NexxiotDB.InitializeConnection();
      return NexxiotDB.conn;
   }
   public static async InsertVehicle(v: NexxiotVehicle) { 
      try {
         const vf = nexxiotVehicleFlatten(v);
         const conn = NexxiotDB.Connection;
         await conn.query("INSERT INTO containers SET ?", vf);
      } catch (ex) {
         console.error("Failed to insert vehicle", ex);
      }
   }
}