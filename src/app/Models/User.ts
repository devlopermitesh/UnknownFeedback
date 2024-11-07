import mongoose ,{Schema,Document} from "mongoose";


export interface User extends Document{
    name:string;
    email:string;
    password:string;
    verifyCode:string;
    verified:boolean;
    verifyExpires:Date;
    isAcceptMessage:boolean;
    messages:Message[];
}

export interface Message extends Document{
    context:string;
    createdAt:Date;
}

const MessageSchema:Schema<Message>=new Schema({
context:{
    type:String,
    required:[true,"context is required"]

},
createdAt:{
    type:Date,
    required:[true,"createdAt is required"]
}
});

const UserSchema:Schema<User>=new Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email: {
        type: String,
        match: [
            /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
            "Please enter a valid email address"
        ],
        required: [true, "Email is required"]
    },
    password: {
        type:String,
        required:[true,"password is required"]
    },
    verifyCode:{
        type:String,
        required:[true,"verifyCode is required"]
    },
    verified:{
        type:Boolean,
        default:false
    },
    verifyExpires:{
        type:Date,
        required:[true,"verifyExpires is required"]
        
    },
    isAcceptMessage:{
        type:Boolean,
        required:[true,"isAcceptMessage is required"],
        default:true
    },
    messages:[MessageSchema]


    
});

const UserModel=(mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>("User",UserSchema);
export default UserModel;