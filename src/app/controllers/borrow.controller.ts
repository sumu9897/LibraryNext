import { Request, Response } from 'express';
import { Books } from '../models/books.model';
import { Borrow } from '../models/borrow.model';
import { zodBorrowSchema } from '../utils/helper';
import { ZodError } from 'zod';
import mongoose from 'mongoose';


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

export const borrowABook = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = await zodBorrowSchema.parseAsync(req.body);

    const updatedBook = await Books.adjustCopiesAfterBorrow(validatedData.book, validatedData.quantity);

    if (!updatedBook) {
      res.status(404).json({
        message: 'Book not found',
        success: false,
        error: { name: 'NotFoundError', message: 'Book not found' },
      });
      return;
    }

    const borrowedBook = await Borrow.create(validatedData);

    res.status(200).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrowedBook,
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'Book not found' || error.message === 'Not enough copies available')) {
      res.status(error.message === 'Book not found' ? 404 : 400).json({
        message: error.message,
        success: false,
        error: { name: error.name, message: error.message },
      });
    } else {
      handleServerError(res, error);
    }
  }
};

export const BorrowBooksSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);

    if (summary.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No borrow records found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};
