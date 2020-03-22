import YAML from "yaml";
import fs from "fs";

let databaseURL: string;
let databaseName: string;

interface IDBSecrets {
  mlabUser: string;
  mlabPW: string;
  mlabDBName: string;
  mlabDomain: string;
  mlabPort: string;
}

(function loadDatabaseSecrets() {
  const data = fs.readFileSync("./secrets/db-secrets.yaml");
  const secrets: IDBSecrets = YAML.parse(data.toString());
  const { mlabDBName, mlabPW, mlabUser, mlabDomain, mlabPort } = secrets;
  databaseURL = `mongodb://${mlabUser}:${mlabPW}@${mlabDomain}:${mlabPort}/${mlabDBName}`;
  databaseName = mlabDBName;
})();

export { databaseURL, databaseName };
