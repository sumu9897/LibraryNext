import express from 'express';
import { createBook, getBookById, getBooks } from '../controllers/books.controller';

export const booksRouter = express.Router();

booksRouter.post( "/", createBook );

booksRouter.get( "/", getBooks );

booksRouter.get( "/:id", getBookById );
