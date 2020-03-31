const Twitter = require("twitter");
const config = require("./config");
const fs = require("fs").promises;
const client = new Twitter(config.auth);


const getFriends = () => new Promise(resolve => {
  const params = { screen_name: config.screen_name, cursor: -1, stringify_ids: true };
  client.get("friends/ids", params, ((error, data, response) => {
    if(error) return console.log(error);
    resolve(data)
  }));
});

async function main() {
  const friends = await getFriends();
  await fs.writeFile("follows.json", JSON.stringify(friends));

}

main();
