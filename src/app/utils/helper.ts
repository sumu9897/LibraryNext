import { z } from 'zod';

export const zodBookSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, 'Title cannot be empty'),

  author: z
    .string({
      required_error: 'Author is required',
    })
    .min(1, 'Author cannot be empty'),

  genre: z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], {
    required_error: 'Genre is required',
    invalid_type_error: 'Genre must be one of FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY',
  }),

  isbn: z
    .string({
      required_error: 'ISBN is required',
    })
    .min(10, 'ISBN must be at least 10 characters'),

  description: z
    .string()
    .optional(),

  copies: z
    .number({
      required_error: 'Copies is required',
      invalid_type_error: 'Copies must be a number',
    })
    .int('Copies must be an integer')
    .min(0, 'Copies must be a positive number'),

  available: z
    .boolean()
    .optional(),
});

export const zodBorrowSchema = z.object( {
    book: z.string().min( 1, "Book ID is required" ),
    quantity: z
        .number()
        .int()
        .min( 1, "Quantity must be at least 1" )
        .refine( ( value ) => value >= 1, {
            message: "Quantity must be at least 1",
        } ),
    dueDate: z
        .string()
        .transform( ( val ) => new Date( val ) )
        .refine( ( date ) => date.getTime() > Date.now(), {
            message: "Due date must be in the future",
        } ),
} );
