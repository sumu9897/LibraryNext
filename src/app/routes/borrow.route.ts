import express from 'express';
import { borrowABook, BorrowBooksSummary } from '../controllers/borrow.controller';

export const borrowRouter = express.Router();

borrowRouter.post( "/", borrowABook );

borrowRouter.get("/", BorrowBooksSummary)