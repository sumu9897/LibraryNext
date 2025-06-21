import { Request, Response } from 'express';
import { Books } from '../models/books.model';
import { Borrow } from '../models/borrow.model';
import { zodBorrowSchema } from '../utils/helper';

export const borrowABook = async ( req: Request, res: Response ): Promise<void> =>
{
    // console.log( "borrowABook controller called" );
    try
    {
        const zodBook = await zodBorrowSchema.parseAsync( req.body );

        const updatedBook = await Books.adjustCopiesAfterBorrow( zodBook.book, zodBook.quantity );

        console.log( "Validated Borrow Data:", zodBook, updatedBook );
        
        if ( updatedBook )
        {
            const borrowedBook = await Borrow.create( req.body );

            res.status( 200 ).json( {
                success: true,
                message: "Book borrowed successfully",
                data: borrowedBook,
            } );
        }

    }
    catch ( error )
    {
        console.error( "Error in borrowABook controller:", error );
      
        if ( error instanceof Error )
        {
            if ( error.message === "Book not found" )
            {
                res.status( 404 ).json( {
                    message: error.message,
                    success: false,
                    error: { name: error.name, message: error.message },
                } );

                return;
            }
      
            if ( error.message === "Not enough copies available" )
            {
                res.status( 400 ).json( {
                    message: error.message,
                    success: false,
                    error: { name: error.name, message: error.message },
                } );

                return;
            }
        }
      
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        } );
    }
};

export const BorrowBooksSummary = async ( req: Request, res: Response ): Promise<void> =>
{
    try
    {
        const summary = await Borrow.aggregate( [
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' },
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            },
            {
                $unwind: '$bookDetails'
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$bookDetails.title',
                        isbn: '$bookDetails.isbn'
                    },
                    totalQuantity: 1,
                }
            }
        ] );

        if( summary.length === 0 )
        {
            res.status( 404 ).json( {
                success: false,
                message: "No borrow records found",
            } );

            return;
        }
        
        res.status( 200 ).json( {
            success: true,
            message: "Borrow summary retrieved successfully",
            data: summary,
        } );
    }
    catch ( error )
    {
        console.error( "Error in BorrowBooksSummary controller:", error );
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        } );
    }
}