import mongoose from "mongoose";

type ConnectionObject=
{
 isConnected?:number
}
const connection:ConnectionObject = {

};
export async function dbConnect():Promise<void> {
    if(connection.isConnected){


        console.log("already connected");
        return;
    }
    else{
        try{
const dbreply = await mongoose.connect(process.env.MONGODB_URI!);
connection.isConnected=dbreply.connections[0].readyState


        }
        catch(error){
            console.log("database connection failed !error",error)
            process.exit(1)

        }
    }
}