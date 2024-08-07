import * as fs from "fs";
import * as os from "os";

export type ConfigDefinition = {
   nexxiot: {
      db: {
         host: string,
         port: number,
         user: string,
         password: string
      },
      api_key: string
   }
};
export class Config {
   private static _c: ConfigDefinition | null = null;
   private static LoadConfig(): ConfigDefinition {
      const conf: Record<string, any> = JSON.parse(fs.readFileSync("./config.json", "utf8"));
      if (typeof conf !== "object") throw new Error(`Invalid config: ${conf}`);

      // $.nexxiot
      if (typeof conf.nexxiot !== "object") throw new Error(`Invalid nexxiot: ${conf.nexxiot}`);
      // $.nexxiot.db
      if (typeof conf.nexxiot.db !== "object") throw new Error(`Invalid nexxiot.db: ${conf.nexxiot.db}`);
      // $.nexxiot.db.host
      if (typeof conf.nexxiot.db.host !== "string") throw new Error(`Invalid nexxiot.db.host: ${conf.nexxiot.db.host}`);
      // $.nexxiot.db.port
      if (typeof conf.nexxiot.db.port !== "number") throw new Error(`Invalid nexxiot.db.port: ${conf.nexxiot.db.port}`);
      // $.nexxiot.db.user
      if (typeof conf.nexxiot.db.user !== "string") throw new Error(`Invalid nexxiot.db.user: ${conf.nexxiot.db.user}`);
      // $.nexxiot.db.password
      if (typeof conf.nexxiot.db.password !== "string") throw new Error(`Invalid nexxiot.db.password: ${conf.nexxiot.db.password}`);
      // $.nexxiot.db.api_key
      if (typeof conf.nexxiot.api_key !== "string") throw new Error(`Invalid nexxiot.api_key: ${conf.nexxiot.api_key}`);
      
      return conf as ConfigDefinition;
   }
   public static ReloadConfig(): void { 
      Config._c = Config.LoadConfig();
      if (Config._c == null)
         throw new Error(`Failed to load config`);
   }
   /**
    * Get the current config / load it if not already loaded
    */
   public static get Current(): ConfigDefinition {
      if (Config._c === null)
         this.ReloadConfig();
      return Config._c!;
   }
}