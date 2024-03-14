const redisClient = require('../redis');

// Middleware for caching
const cacheMiddleware = (key) => async (req, res, next) => {
  try {
    const cachedData = await getFromCache(key);

    if (cachedData) {
      console.log('Data retrieved from cache');
      return res.json(cachedData);
    }

    // If data is not in the cache the 
    //  proceed to the next middleware to fetch from the database
    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next();
  }
};

// Function to get data from Redis cache
const getFromCache = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Function to set data in Redis cache
const setInCache = (key, data) => {
  return new Promise((resolve, reject) => {
    redisClient.setex(key, 3600, JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = { cacheMiddleware, setInCache };
