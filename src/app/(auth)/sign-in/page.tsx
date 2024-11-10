"use client";
import { signInSchema } from "@/app/schemas/signInSchema";
import { useToast } from "@/components/ui/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import Header from "@/components/ui/custome/Header";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const page = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const results=await signIn("credentials", {  password: data.password,username: data.username,redirect: false });
    console.log(results);
    

    if (results?.error) {
      toast({
        title:"Error In loggin",
        description:results.error,
        variant:"destructive",
        color:"red"
      })
    }
    if (results?.ok) {
      toast({
        title:"Success",
        description:"You have logged in successfully",
        variant:"default",
        color:"green"
      })
    router.replace('/dashboard');
    }

     };

  return (
    <div className="flex justify-center items-center w-full h-full relative bg-white border border-solid border-black  flex-col">
      

      {/* Form */}
      <div className="border-solid p-2 border rounded border-gray-900 shadow-custom-shadow px-10 flex flex-col gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
          <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Username "
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />           

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message && (
                      <span className="text-red-500">
                        {form.formState.errors.password?.message}
                      </span>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing In..." : "Sign-In"}
            </Button>
          </form>
        </Form>

        {/* Signup Link */}
        <hr />
        <p className="text-center">
          Don't have an account?{" "}
          <a href="/sign-up" className="text-blue-500">
            Sign-Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default page;
