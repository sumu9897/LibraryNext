import { NextFunction, Request, Response } from 'express';
import { Books } from '../models/books.model';
import { zodBookSchema } from "../utils/helper";

export const createBook = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        // console.log("createBook controller called", req.body);
        const zodBooks = await zodBookSchema.parseAsync( req.body );
        // console.log( "Validated Book Data:", zodBooks );
        
        const book = await Books.create( zodBooks );

        res.status( 201 ).json( {
            success: true,
            message: "Book created successfully",
            data: book,
            status: 201,
        } );
    }
    catch ( error )
    {
        // console.error( "Error in createBook controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            status: 500,
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        })

        // next(error);
    }
};

export const getBooks = async ( req: Request, res: Response ): Promise<void> =>
{
    try
    {
        const filter = req.query.filter as string | undefined;
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const limit = parseInt( req.query.limit as string ) || 10;

        // console.log(filter?.toUpperCase())

        const pipeline: any[] = [];

        // Match stage if filter is provided
        if ( filter )
        {
            pipeline.push( { $match: { genre: filter?.toUpperCase() } } );
        }

        // Sort stage
        pipeline.push( { $sort: { [ sortBy ]: sort } } );

        // Limit stage
        pipeline.push( { $limit: limit } );

        const books = await Books.aggregate( pipeline );

        if ( !books.length )
        {
            res.status( 404 ).json( {
                success: false,
                message: `No books found on query: ${ filter ?? sortBy ?? sort ?? limit }`,
                data: null,
            } );
            return;
        }

        res.status( 200 ).json( {
            success: true,
            message: "Books retrieved successfully",
            data: books,
        } );
    } catch ( error )
    {
        console.error( "Error in getBooks controller:", error );
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        } );
    }
};

export const getBookById = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // console.log("getBookById controller called with ID:", bookId);
        
        const book = await Books.findById( bookId );
        if ( !book )
        {
            res.status( 404 ).json( {
                success: false,
                message: "Book not found"
            } );

            return;
        }

        res.status( 200 ).json( {
            success: true,
            message: "Book retrieved successfully",
            data: book
        } );
    }
    catch ( error )
    {
        // console.error( "Error in getBookById controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });

        // next(error);
    }
};

export const updateBook = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // console.log("updateBook controller called with ID:", bookId);
        
        const zodBooks = await zodBookSchema.parseAsync( req.body );
        // console.log( "Validated Book Data for Update:", zodBooks );
        
        const book = await Books.findByIdAndUpdate( bookId, zodBooks, { new: true } );
        if ( !book )
        {
            res.status( 404 ).json( {
                success: false,
                message: "Book not found",
                data: null
            } );

            return;
        }

        res.status( 200 ).json( {
            success: true,
            message: "Book updated successfully",
            data: book
        } );
    }
    catch ( error )
    {
        // console.error( "Error in updateBook controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        });

        // next(error);
    }
}   

export const deleteBook = async ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    try
    {
        const bookId = req.params?.id;
        // console.log("deleteBook controller called with ID:", bookId);
        
        const book = await Books.findByIdAndDelete( bookId );
        if ( !book )
        {
            res.status( 404 ).json( {
                success: false,
                message: "Book not found",
                data: null
            } );

            return;
        }

        res.status( 200 ).json( {
            success: true,
            message: "Book deleted successfully",
            data: null
        } );
    }
    catch ( error )
    {
        // console.error( "Error in deleteBook controller:", error );
        
        res.status( 500 ).json( {
            message: "Internal Server Error",
            success: false,
            error: error instanceof Error ? error : "Unknown error",
        } );

        // next(error);
    }
};