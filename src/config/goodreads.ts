import YAML from "yaml";
import fs from "fs";

let goodreadsKey: string;
let goodreadsSecret: string;

interface IGoodreadsSecrets {
  key: string;
  secret: string;
}

(function loadGoodreadsSecrets() {
  const data = fs.readFileSync("./secrets/goodreads-secrets.yaml");
  const secrets: IGoodreadsSecrets = YAML.parse(data.toString());
  goodreadsKey = secrets.key;
  goodreadsSecret = secrets.secret;
})();

export { goodreadsKey, goodreadsSecret };
