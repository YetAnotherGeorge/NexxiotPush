import { Config } from "./conf";
import * as nexxiot_mysql from "./nexxiot/nexxiot_mysql";
import * as nexxiot_main from "./nexxiot/nexxiot_main";

async function main(): Promise<void> {
   nexxiot_main.NexxiotPositionLoop.Run({
      api_auth_key: Config.Current.nexxiot.api_key,
      interval_ms: 1000 * 60 * 5,
      saveItem: async (nv: nexxiot_main.NexxiotVehicle) => nexxiot_mysql.NexxiotDB.InsertVehicle(nv)
   })
}
main();