import * as fs from "fs";
import * as mysql from "mysql2/promise";
import { Config } from "../conf";

(async () => {
   const access: mysql.ConnectionOptions = {
      host: Config.Current.nexxiot.db.host,
      port: Config.Current.nexxiot.db.port,
      user: Config.Current.nexxiot.db.user,
      password: Config.Current.nexxiot.db.password,
      multipleStatements: true
   };
   const conn = await mysql.createConnection(access);
   await conn.connect();
   console.log("Connected to MySQL");

   const sqlDefinition = fs.readFileSync("./src/nexxiot/nexxiot.mysql.sql", "utf8");
   console.log("Executing SQL definition:");
   console.log(sqlDefinition.split("\n").map((l, i) => `  SQL_[${i.toString().padStart(2)}]>  ${l}`).join("\n")); 
   await conn.query(sqlDefinition);
   console.log("Executed SQL definition");
   conn.destroy();
   console.log("Initialization complete");
})();