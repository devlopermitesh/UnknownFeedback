import { Message } from "../Models/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    data?:Message[];
    isAcceptingMessage?:boolean;
}

