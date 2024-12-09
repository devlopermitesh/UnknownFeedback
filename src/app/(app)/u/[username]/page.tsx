"use client";

import { MessageSchema } from '@/app/schemas/MessageSchema';
import { useToast } from '@/components/ui/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types/ApiResponse';
import { motion } from "framer-motion";

// Function to split the question string
function splitQuestions(input: string): string[] {
  return input.split('||').map(question => question.trim());
}

const Page = () => {
  const { toast } = useToast();
  const [message, setMessage] = React.useState<string>("");
  const [suggestedMessages, setSuggestedMessages] = React.useState<string[]>([
    "What's something new you've learned recently?",
    "If you could instantly master any skill, what would it be?",
    "What's a place you've always wanted to visit, and why?",
  ]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // Loader state

  const { username } = useParams<{ username: string }>();

  const form = useForm({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "", // Ensure the initial value is empty
      createdAt: new Date(),
    },
  });

  const { setValue, handleSubmit } = form; // Use setValue to update form state

  // Submit message handler
  const onSubmit = async (data: { content: string }) => {
    try {
      const messageData = { username, messageContent: data };
      console.log(messageData);
      const result = await axios.post("/api/send-message", messageData);
      if (result.data.success) {
        toast({
          title: "Message sent successfully",
          variant: "default",
          color: "green",
        });
      }
    } catch (error) {
      console.log("Error in submitting message", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: axiosError?.response?.data?.message || "Error in submitting message",
        variant: "destructive",
        color: "red",
      });
    }
    finally{
      setValue("content", "");
      setMessage("");
    }
  };

  // Suggest message handler
  const suggestMessage = async () => {
    setIsLoading(true); // Set loading state to true when API call starts
    try {
      const response = await axios.post("/api/suggest-message");
      if (response.data.success) {
        toast({
          title: "Message suggested successfully",
          variant: "default",
          color: "green",
        });
      }
      const suggestedMessage = response.data.response;
      setSuggestedMessages(splitQuestions(suggestedMessage));
    } catch (error) {
      console.log("Error in suggesting message", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: axiosError?.response?.data?.message || "Error in suggesting message",
        variant: "destructive",
        color: "red",
      });
    } finally {
      setIsLoading(false); // Set loading state to false once the API call is complete
    }
  };

  // Synchronize react-hook-form state and message state
  const handleMessageSelect = (msg: string) => {
    setMessage(msg);
    setValue("content", msg); // Sync form state with the selected message
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-50 items-center space-y-4 overflow-x-hidden">
      {/* Form for sending a message */}
      <div className="flex flex-col w-full h-auto bg-slate-50 items-center space-y-3">
        <h2 className="text-2xl font-bold text-center">Public Profile Link</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Suggest Anonymous Message to {username}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Got something on your mind? Let us know!"
                      {...field}
                      value={message} // Bind the input value to the message state
                      onChange={(e) => {
                        const newMessage = e.target.value;
                        setMessage(newMessage);
                        setValue("content", newMessage); // Sync form state
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    We value your opinion, no names needed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mx-auto">Send It</Button>
          </form>
        </Form>
      </div>

      {/* Suggested messages section */}
      <div className="flex flex-col w-full h-auto bg-slate-50 items-center space-y-3">
        <Button
          onClick={suggestMessage}
          className="mr-auto ms-8 relative"
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              {/* Loader */}
              <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-solid rounded-full animate-spin"></div> 
            </div>
          ) : (
            "Suggest Messages"
          )}
        </Button>
        <hr className="border-solid border-2 border-slate-300 w-full" />
        <p className="font-light capitalize text-black text-lg">Click on any below to select it</p>
        <div className="flex flex-col w-[90%] h-auto bg-slate-50 space-y-3 rounded-lg border border-solid border-slate-300 py-2">
          <h1 className="font-bold text-xl ml-2">Messages</h1>
          <ul className="flex flex-col w-full h-auto bg-slate-50 items-center space-y-3">
            {suggestedMessages.map((msg, index) => (
              <motion.li
                key={index}
                onClick={() => handleMessageSelect(msg)} // Update message state and form state
                className="w-[90%] h-10 bg-slate-100 text-center font-bold border-solid border border-slate-300 rounded-md cursor-pointer hover:bg-slate-200"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.95 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {msg}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
