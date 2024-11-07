import {z} from "zod";

const usernamevalidation=z.string().min(3,"username should be at least 3 characters").max(20,"username should be at most 20 characters").regex(/^[a-zA-Z0-9_]+$/,"username can only contain letters, numbers, and underscores").toLowerCase();

export const signupSchema = z.object({
    username:usernamevalidation,
    email:z.string().email(),
    password:z.string().min(6,"password should be at least 6 characters").max(20,"password should be at most 20 characters"),
    

})