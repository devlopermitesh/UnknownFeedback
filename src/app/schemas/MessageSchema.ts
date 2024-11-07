import {z} from "zod";
export const MessageSchema=z.object({
  content:z.string().min(1,"message should be at least 1 characters").max(1000,"message should be at most 1000 characters"),  
  createdAt:z.date()
})