const redis = require('redis');

// Connect to Redis
const client = redis.createClient();

// Log any Redis connection errors
client.on('error', (err) => {
  console.error(`Redis Error: ${err}`);
});

module.exports = client;
