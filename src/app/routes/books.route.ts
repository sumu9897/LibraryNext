import express from 'express';
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/books.controller';

export const booksRouter = express.Router();

booksRouter.post( "/", createBook );

booksRouter.get( "/", getBooks );

booksRouter.get( "/:id", getBookById );

booksRouter.put( "/:id", updateBook );

booksRouter.delete( "/:id", deleteBook );