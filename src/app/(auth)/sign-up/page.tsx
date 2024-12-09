"use client";
import React, { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/hooks/use-toast";
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { signupSchema } from '@/app/schemas/signupSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios, { AxiosError } from "axios";
import { ApiResponse } from '@/app/types/ApiResponse';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameSearch, setIsUsernameSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback((value: string) => {
    setUsername(value);
  }, 1000);

  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState: { errors }, control } = methods;

  // Check if the username is available (debounced)
  useEffect(() => {
    if (username) {
      setIsUsernameSearch(true);
      setUsernameMessage("");
      async function checkUsername(username: string) {
        try {
          const results = await axios.get(`/usernamecheckunique?username=${username}`);
          if (results.data.success) {
            setUsernameMessage(results.data.message);
          }
          console.log(results.data);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsUsernameSearch(false);
        }
      }
      checkUsername(username);
    }
  }, [username]);

  // Submit form
  const onSubmit: SubmitHandler<z.infer<typeof signupSchema>> = async (data) => {
    setIsSubmitting(true);
    try {
      const results = await axios.post("/api/sign-up", data);
      console.log(results.data);
      if (results.data.success) {
        toast({
          title: "Account created successfully",
          description: "please verify your account",
          variant: "default",
        });
        router.replace(`/verify/${username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full bg-white border border-solid border-black relative flex-col">
      <div className="border-solid p-2 border rounded border-gray-900 shadow-custom-shadow px-10 flex flex-col gap-2">
        {/* Wrap the form with FormProvider */}
        <FormProvider {...methods}> {/* Provide the form context */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={control} // Use the 'control' from 'useForm'
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        setUsernameMessage("");
                        debouncedUsername(e.target.value);  // Debounced function call
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage>
                    {isUsernameSearch && <Loader2 className="animate-spin" />}
                    {usernameMessage && (
                      <span className={usernameMessage.includes("not available")|| usernameMessage.includes("already exists")|| usernameMessage.includes("should be at leas") ? "text-red-500" : "text-green-500"}>
                        {usernameMessage}
                      </span>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />

<FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.email && errors.email.message}</FormMessage>
                </FormItem>
              )}
            />

<FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.password && errors.password.message}</FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting || isUsernameSearch} className='w-full'>
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 " /> : "Submit"}
            </Button>
          </form>
        </FormProvider>
        <hr></hr>
        <h1>Already have an account? <a href="/sign-in" className="text-blue-500">Sign in</a></h1>
      </div>
    </div>
  );
};

export default Page;
