import {z} from "zod";
export const verifyvalidation=z.object({
    code:z.string().min(6,"code should be at least 6 characters").max(6,"code should be at most 6 characters"),
})