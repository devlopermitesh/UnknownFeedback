"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "../button"
import { X } from "lucide-react"
import { Message } from "@/app/Models/User"
import axios, { AxiosError } from "axios"
import { useToast } from "../hooks/use-toast"
import { formatDistanceToNow } from 'date-fns';
import { ApiResponse } from "@/app/types/ApiResponse"
interface MessagecardProps{
Message:Message,
onMessageDelete:(id:string) => void
}

/**
 * Returns a human-readable string representing the time difference
 * between the current time and the input date.
 *
 * @param inputDate - The input date string (e.g., "Sun Nov 10 2024 14:37:25 GMT+0530").
 * @returns A string like "5 minutes ago", "2 days ago", etc.
 */
function timeAgo(inputDate:Date): string {
  // Parse the input date string into a Date object
  const date = new Date(inputDate);

  // Ensure the input date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string provided');
  }

  // Calculate the distance between now and the input date
  const result = formatDistanceToNow(date, { addSuffix: true });

  return result;
}



const MessageCard:React.FC<MessagecardProps> = ({Message,onMessageDelete}) => {
    const {toast}=useToast()
    const {_id:messageId} = Message
    const date = new Date(Message.createdAt);
    const handleDelete = async() => {
    try {
      const response = await axios.delete(`/api/deleteMessage/${messageId}`);
      if (response.data.success) {
          toast({
              title: "Message deleted successfully",
              variant: "default",
              color: "green",
          });
          onMessageDelete(messageId);
      } else {
          toast({
              title: "Failed to delete message",

              variant: "default",
              color: "red",
          });
      }
    } catch (error) {
        
      const AxiosError=error as AxiosError<ApiResponse>
      const errormessage=AxiosError?.response?.data?.message
    toast({
        title:"error in deleting message",
        description:errormessage,
        variant:"destructive",
        color:"red"
    })

    }
    }
  return (
    <Card>
  <CardHeader>
    <CardTitle>{Message.context}</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="h-8 w-8 ms-auto"><X className="h-4 w-4 text-white-500" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    {/* <CardDescription>{new Date(Message.createdAt)}</CardDescription> */}
  </CardHeader>
  <CardFooter>
    <p>{timeAgo(date)}</p>
  </CardFooter>
</Card>

  )
}

export default MessageCard