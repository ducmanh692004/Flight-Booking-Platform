import redis from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = redis.createClient(process.env.REDIS_URL); // 6379 port on my local

redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully (v3 with Promisify)');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

// === PHẦN QUAN TRỌNG NHẤT ===
// Chuyển đổi các hàm callback sang Promise.
// .bind(redisClient) là bắt buộc để đảm bảo `this` trỏ đúng vào redisClient.

redisClient.get = promisify(redisClient.get).bind(redisClient);
redisClient.set = promisify(redisClient.set).bind(redisClient);
redisClient.del = promisify(redisClient.del).bind(redisClient);

// Trong code gốc bạn có dùng set với 'EX', nên ta cần promisify cả setex
redisClient.setex = promisify(redisClient.setex).bind(redisClient);

// Bạn có thể thêm các hàm khác cần dùng ở đây...
// Ví dụ: redisClient.exists = promisify(redisClient.exists).bind(redisClient);

export default redisClient;
