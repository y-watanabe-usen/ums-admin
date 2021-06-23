import mysql, { Connection } from "mysql";
// var config = require(`${Dir.config}/${process.env.CI ? 'ciConfig' : 'localConfig'}`);
import dbConfig from "@/config/localDbConfig";

class Database {
  private connection: Connection;
  private isConnected = false;

  constructor() {
    this.connection = mysql.createConnection(dbConfig);
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        console.log(`mysql connection error. ${err.stack}`);
        return;
      }
    });
    this.isConnected = true;
  }

  disconnect() {
    this.connection.end();
    this.isConnected = false;
  }

  executeQuery(query: string, params: any) {
    if (!this.isConnected) this.connect();
    this.connection.query(query, params, (err) => {
      if (err) {
        console.log(`executeQuery error. ${query}, ${err.stack}`);
        return;
      }
    });
  }
}

const database = new Database();
export default database;
