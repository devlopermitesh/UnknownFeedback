"use client";
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useToast } from '@/components/ui/hooks/use-toast';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyvalidation } from '@/app/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types/ApiResponse';
import Header from '@/components/ui/custome/Header';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(verifyvalidation),
    defaultValues: {
      verifycode: "",
    },
  });
  const { username } = useParams<{ username: string }>();

  const onSubmit = async (data: { verifycode: string }) => {
    console.log("onSubmit is called!");  // Check if the function is getting triggered.
    try {
        console.log("Form Submitted with data:", data);
        
        const verifydata = { username, code: { verifycode: data.verifycode } };  
        console.log("Verification Data: ", verifydata);
        const result = await axios.post('/api/verifycode', verifydata);

        if (result.data.success) {
            toast({
                title: "Account Verified",
                description: "You can now log in to your account",
                variant: "default",
                color:"green"
            });
            router.replace('/sign-in');
        } else {
            toast({
                title: "Verification Failed",
                description: result.data.message || "Unknown error during verification",
                variant: "destructive",
                color:"red"
            });
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError?.response?.data?.message || "An unexpected error occurred";
        toast({
            title: "Error during verification",
            description: errorMessage,
            variant: "destructive",
        });
        console.error("Verification error:", error);
    }
};

  return (
    <div className="flex justify-center items-center w-full h-full bg-white border border-solid border-black absolute flex-col">
      <Header />
      <div className="border-solid p-2 border rounded border-gray-900 shadow-custom-shadow px-10 flex flex-col gap-2">
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="verifycode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your phone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Page;
