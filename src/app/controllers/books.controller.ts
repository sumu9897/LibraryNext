import { Request, Response } from 'express';
import { Books } from '../models/books.model';
import { zodBookSchema } from '../utils/helper';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

// Enhanced error handler
const handleServerError = (res: Response, error: unknown): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      success: false,
      error: {
        name: 'ValidationError',
        errors: error.format(),
      },
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: 'Validation failed',
      success: false,
      error,
    });
    return;
  }

  res.status(500).json({
    message: 'Internal Server Error',
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error',
  });
};

// Create a new book
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = await zodBookSchema.parseAsync(req.body);
    const book = await Books.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// Get all books with optional filtering and sorting
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter = req.query.filter as string | undefined;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const pipeline: any[] = [];

    if (filter) {
      pipeline.push({ $match: { genre: filter.toUpperCase() } });
    }

    pipeline.push(
      { $sort: { [sortBy]: sort } },
      { $limit: limit }
    );

    const books = await Books.aggregate(pipeline);

    if (!books.length) {
      res.status(404).json({
        success: false,
        message: `No books found for query: ${filter ?? sortBy}`,
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// Get book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid book ID format',
        error: { name: 'CastError', value: bookId },
      });
      return;
    }

    const book = await Books.findById(bookId);

    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// Update book by ID
export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid book ID format',
          error: { name: 'CastError', value: bookId },
        });
        return;
      }
  
      const validatedData = await zodBookSchema.parseAsync(req.body);
  
      const updatedBook = await Books.findByIdAndUpdate(bookId, validatedData, { new: true });
  
      if (!updatedBook) {
        res.status(404).json({
          success: false,
          message: 'Book not found',
          data: null,
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        data: updatedBook,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  };

// Delete book by ID
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid book ID format',
        error: { name: 'CastError', value: bookId },
      });
      return;
    }

    const deletedBook = await Books.findByIdAndDelete(bookId);

    if (!deletedBook) {
      res.status(404).json({
        success: false,
        message: 'Book not found',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};
