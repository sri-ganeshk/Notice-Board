import express from 'express'
import cors from 'cors';
import config from './config/config'
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ApiError from './utils/ApiError';

import { authRouter } from './routes/auth.routes';
import { noticeRouter } from './routes/notice.routes';
import eventRouter from './routes/event.routes';
import commentRouter from './routes/comment.routes';

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.MONGO_URI).then(()=>{
    console.log(`db connected with the uri as ${config.MONGO_URI}`)
}).catch((e)=>{
    console.log(`err is in db connection ${e}`)
})

app.use('/api/auth', authRouter)
app.use('/api/notices', noticeRouter)
app.use('/api/events', eventRouter)
app.use('/api/comments', commentRouter)

app.get('/',(req,res)=>{
    res.json({
        success: true,
        message: 'api is running'
    })
})

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            statusCode: err.statusCode
        });
    }
    
    // Default error
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        statusCode: 500
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(config.port, () => {
        console.log(`the app is running on port ${config.port}`)
    })
}

export default app;