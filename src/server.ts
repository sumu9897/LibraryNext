import dotenv from "dotenv";
import app from './app';
import connectToDatabase from './config/database';

dotenv.config();

const port = process.env.PORT || 5001;

const main = async () =>
{
    try
    {
        connectToDatabase();

        app.listen( port, () =>
        {
            console.log( `🌎 Server running at http://localhost:${ port }` );
        } );
    } catch ( error )
    {
        console.error( "❌ Failed to connect to MongoDB:", error );
        process.exit( 1 );
    }
};

main();