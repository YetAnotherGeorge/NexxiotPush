import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as axios from "axios";
import * as qs from "querystring";

export class NexxiotTokenStart {
   public readonly token_type: "Bearer";
   public readonly id_token: string;
   public readonly access_token: string;
   public readonly timestamp_expiration: number;
   public readonly timestamp_received: number; // Unix timestamp (ms)

   public constructor(data: Record<string, any>) {
      if (typeof data !== "object") throw new Error(`Invalid data: ${data}`);
      
      if (data["token_type"] !== "Bearer") throw new Error(`Invalid token type: ${data["token_type"]}`);
      this.token_type = data["token_type"];

      if (typeof data["id_token"] !== "string") throw new Error(`Invalid id token: ${data["id_token"]}`);
      this.id_token = data["id_token"];

      if (typeof data["access_token"] !== "string") throw new Error(`Invalid access token: ${data["access_token"]}`);
      this.access_token = data["access_token"];

      // data["expires_in"] is in second
      if (typeof data["expires_in"] !== "number") throw new Error(`Invalid expires in: ${data["expires_in"]}`); 
      this.timestamp_received = Date.now();
      this.timestamp_expiration = this.timestamp_received + (data["expires_in"] - 100) * 1000;
   }
}
export type NexxiotVehicle = {
   id: string,
   external_id: string,
   display_name: string,
   tags: Record<string, any>,
   legacy_id: string,
   metadata: Record<string, any>,
   create_time: string, // ISO 8601
   update_time: string, // ISO 8601
   group_ids: Array<any>,
   state: undefined | {
      connect_time: string, // ISO 8601
      location: {
         point: { lat: number, lon: number },
         measure_time: string, // ISO 8601
         country_code: string | undefined,
         display_name: string | undefined
      },
      movement: {
         state: "Standing" | "Moving",
         change_time: string, // ISO 8601
         measure_time: string // ISO 8601
      }
   }
};

export function ParseNexxiotVehicle(data: any): NexxiotVehicle | never { 
   try {
      // $
      if (typeof data != "object") throw new Error(`Invalid data: ${data}`);
      // $.id
      if (typeof data["id"] != "string") throw new Error(`Invalid id: ${data["id"]}`);
      // $.external_id
      if (typeof data["external_id"] != "string") throw new Error(`Invalid external id: ${data["external_id"]}`);
      // $.display_name
      if (typeof data["display_name"] != "string") throw new Error(`Invalid display name: ${data["display_name"]}`);
      // $.tags
      if (typeof data["tags"] != "object") throw new Error(`Invalid tags: ${data["tags"]}`);
      // $.legacy_id
      if (typeof data["legacy_id"] != "string") throw new Error(`Invalid legacy id: ${data["legacy_id"]}`);
      // $.metadata
      if (typeof data["metadata"] != "object") throw new Error(`Invalid metadata: ${data["metadata"]}`);
      // $.create_time
      if (typeof data["create_time"] != "string") throw new Error(`Invalid create time: ${data["create_time"]}`);
      // $.update_time
      if (typeof data["update_time"] != "string") throw new Error(`Invalid update time: ${data["update_time"]}`);
      // $.group_ids
      if (!Array.isArray(data["group_ids"])) throw new Error(`Invalid group ids: ${data["group_ids"]}`);

      // $.state
      if (typeof data["state"] != "undefined") {
         if (typeof data["state"] != "object") 
            throw new Error(`Invalid state: ${data["state"]}`);
         
         // $.state.connect_time
         if (typeof data["state"]["connect_time"] != "string") 
            throw new Error(`Invalid connect time: ${data["state"]["connect_time"]}`);
         // $.state.location
         if (typeof data["state"]["location"] != "object")
            throw new Error(`Invalid location: ${data["state"]["location"]}`);
         // $.state.location.point
         if (typeof data["state"]["location"]["point"] != "object") 
            throw new Error(`Invalid point: ${data["state"]["location"]["point"]}`);
         // $.data.state.location.point.lat
         if (typeof data["state"]["location"]["point"]["lat"] != "number") 
            throw new Error(`Invalid lat: ${data["state"]["location"]["point"]["lat"]}`);
         // $.data.state.location.point.lon
         if (typeof data["state"]["location"]["point"]["lon"] != "number") 
            throw new Error(`Invalid lon: ${data["state"]["location"]["point"]["lon"]}`);
         // $.state.location.measure_time
         if (typeof data["state"]["location"]["measure_time"] != "string") 
            throw new Error(`Invalid measure time: ${data["state"]["location"]["measure_time"]}`);
         // $.state.location.country_code
         if (typeof data["state"]["location"]["country_code"] != "string" && typeof data["state"]["location"]["country_code"] != "undefined") 
            throw new Error(`Invalid country code: ${data["state"]["location"]["country_code"]}`);
         // $.state.location.display_name
         if (typeof data["state"]["location"]["display_name"] != "string" && typeof data["state"]["location"]["display_name"] != "undefined") 
            throw new Error(`Invalid display name: ${data["state"]["location"]["display_name"]}`);
         // $.state.movement
         if (typeof data["state"]["movement"] != "object") 
            throw new Error(`Invalid movement: ${data["state"]["movement"]}`);
         // $.state.movement.state
         if (data["state"]["movement"]["state"] != "Standing" && data["state"]["movement"]["state"] != "Moving") 
            throw new Error(`Invalid movement state: ${data["state"]["movement"]["state"]}`);
         // $.state.movement.change_time
         if (typeof data["state"]["movement"]["change_time"] != "string") 
            throw new Error(`Invalid change time: ${data["state"]["movement"]["change_time"]}`);
         // $.state.movement.measure_time
         if (typeof data["state"]["movement"]["measure_time"] != "string") 
            throw new Error(`Invalid measure time: ${data["state"]["movement"]["measure_time"]}`);
      }

      return data as NexxiotVehicle;
   } catch (e) {
      console.error("Error parsing vehicle", data, e);
      throw e;
   }
}
async function Query_NexxiotTokenStart(api_auth_key: string): Promise<NexxiotTokenStart> {
   const axios_resp: axios.AxiosResponse = await axios.default.post("https://api.live.nexiot.ch/nx/api-access-tokens/api/v1/oidc/token", qs.stringify({
      "grant_type": "refresh_token",
      "refresh_token": api_auth_key
   }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
   });
   const nts: NexxiotTokenStart = new NexxiotTokenStart(axios_resp.data);
   return nts;
}
async function Query_NexxiotVehicles(nts: NexxiotTokenStart, limit: number = 500): Promise<Record<string, NexxiotVehicle>> {
   const axios_resp: axios.AxiosResponse = await axios.default.get(`https://api.live.nexiot.ch/nx/connect/api/v1/assets?page_size=${limit}`,{
      headers: { "Authorization": `Bearer ${nts.access_token}` }
   });
   const data_assets: any = axios_resp.data.assets;
   if (!Array.isArray(data_assets)) throw new Error(`Invalid data: ${data_assets}`);
   const id_vehicle_map: Record<string, NexxiotVehicle> = {};
   for (let i = 0; i < data_assets.length; i++) {
      // console.log(`Parsing vehicle ${i+1}/${data_assets.length}`, data_assets[i]);
      const nv: NexxiotVehicle = ParseNexxiotVehicle(data_assets[i]);
      id_vehicle_map[nv.id] = nv;
   }
   return id_vehicle_map;
}

export class NexxiotPositionLoop {
   private static running = false;
   public static vehicles_last_pull: Record<string, NexxiotVehicle> = {};
   
   public static async Run(args: { api_auth_key: string, interval_ms: number, saveItem: (nexxiot_vehicle: NexxiotVehicle) => {}}): Promise<void> {
      if (NexxiotPositionLoop.running) 
         throw new Error(`Already running`);
      NexxiotPositionLoop.running = true;

      let nts: NexxiotTokenStart = await Query_NexxiotTokenStart(args.api_auth_key);

      NexxiotPositionLoop.vehicles_last_pull = await Query_NexxiotVehicles(nts);
      console.log(`Pulled ${Object.keys(NexxiotPositionLoop.vehicles_last_pull).length} vehicles`);
      for (const nv of Object.values(NexxiotPositionLoop.vehicles_last_pull)) 
         args.saveItem(nv);

      while (true) {
         await new Promise((t) => setTimeout(t, args.interval_ms));
         const now: number = Date.now();
         if (nts.timestamp_expiration > now)
            nts = await Query_NexxiotTokenStart(args.api_auth_key);

         NexxiotPositionLoop.vehicles_last_pull = await Query_NexxiotVehicles(nts);
         console.log(`Pulled ${Object.keys(NexxiotPositionLoop.vehicles_last_pull).length} vehicles`);
         for (const nv of Object.values(NexxiotPositionLoop.vehicles_last_pull)) 
            args.saveItem(nv);
      }
   }
}