const Twitter = require('twitter');
const fs = require('fs').promises;
const config = require('./config');
const client = new Twitter(config.auth);

async function main() {
  const follows = JSON.parse(await fs.readFile('follows.json'));

  for (const query of config.blacklist_search_query) {
    client.get('search/tweets', { q: query, count: 100 }, (error, data, response) => {
      if (error) return console.log(error);

      for (const tweet of data.statuses) {
        if (follows.ids.includes(tweet.user['id_str'])) return;

        client.post('blocks/create', { user_id: tweet.user['id_str'] }, (error, data, response) => {
          if (error) return console.log(error);

          const { name, screen_name, description } = data;
          console.log(`[Blocked] ${name}@${screen_name}: ${description}`);
        });
      }
    });
  }
}

main();
