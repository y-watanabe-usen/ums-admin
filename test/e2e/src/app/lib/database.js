const mysql = require('mysql');
const Dir = require('./dir');
var config = require(`${Dir.config}/${process.env.CI ? 'ciConfig' : 'localConfig'}`);

class Database {
  constructor() {
    this.connection = mysql.createConnection(config.serverConf);
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

  executeQuery(query, params) {
    if (!this.isConnected) this.connect();
    this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(`executeQuery error. ${query}, ${err.stack}`);
        return;
      }
    });
  }
}

module.exports = new Database();