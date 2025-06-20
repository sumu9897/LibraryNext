import express, { Application, NextFunction, Request, Response } from 'express';
import { home } from './app/controllers/home.controller';

const app: Application = express()

app.use( express.json() );

app.get( "/", home );

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route not found" })
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error) {
        res.status(400).json({ message: "Something went wrong from global error handler",status: 500,
            success: false,
            error
        } )
    }
})

export default app;