import { createClient } from 'redis'

const redisClient = createClient({
    url: `redis://${process.env.REDIS_URL}`,
})

redisClient.on('error', (err) => {
    console.error('Redis error:', err.message)
})
;(async () => {
    try {
        await redisClient.connect()
        console.log('Connected to Redis')
    } catch (err) {
        console.error('Could not connect to Redis:', err.message)
    }
})()

export default redisClient
