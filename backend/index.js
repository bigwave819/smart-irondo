import express from 'express'
import { ENV } from './config/env.js'
import { db } from './db/conn.js' // Import db
import userRoutes from './routes/user.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()


app.get('/health', async (req, res) => {
    try {
        const result = await db.execute('SELECT NOW() as current_time');
        res.json({
            status: 'Database is connected!',
            time: result.rows[0].current_time
        });
    } catch (error) {
        res.status(500).json({
            status: 'Database connection failed',
            error: error.message
        });
    }
});


app.use('/api/user', userRoutes)
app.use('api/admin', adminRoutes)

const PORT = ENV.PORT
app.listen(PORT, () => {
    console.log(`the server is running on the port ${PORT}`);
    console.log(`Test database at: http://localhost:${PORT}/health`);
})