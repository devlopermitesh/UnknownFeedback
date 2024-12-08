"use client"
import { ApiResponse } from '@/app/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useCopyToClipboard } from 'usehooks-ts';
import { Switch as SwitchComponent } from "@/components/ui/switch"
import { Label } from '@/components/ui/label';
import MessageCard from '@/components/ui/custome/MessageCard';
import { Loader2 } from 'lucide-react';
import {Message} from "../../Models/User"
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
const Page = () => {
  const [isSwitchloading, setisSwitchloading] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
const {toast}=useToast();
const {data:session,status}=useSession();

const form=useForm();
const router=useRouter();
const {watch,setValue,register}=form
const Switch=watch("Switch")
const baseUrl=`${window.location.origin}`
  const profileUrl=`${baseUrl}/u/${session?.user?.username}`
//optimize ui update on delete
const handleDeleteMessage=async(messageId:string)=>{
  setMessages(()=>messages.filter((message :Message)=>message._id!==messageId));
console.log("messages",messages)
alert("message deleted successfully")
}

//fetch about message Accepting
const fetchAcceptMessage=useCallback(async()=>{
  setisSwitchloading(true);
  setLoading(true);
  try {
 const response=await axios.get("/api/accept-message");   
    if(response.data.success){
      setValue("Switch",response.data.AcceptingMessage);
    }
  } catch (error) {
    console.log("error",error)
    const AxiosError=error as AxiosError<ApiResponse>;
    toast({title:"error in accepting message",description:AxiosError?.response?.data?.message,variant:"destructive",color:"red"})
  }
  finally{
    setisSwitchloading(false);
    setLoading(false);
  }
},[])
//fetch all message 
const fetchMessages=useCallback(async(refresh:boolean=false)=>{
  setLoading(true);
  try {
    const response=await axios("/api/read-message")
    if(response.data.success){
 setMessages(response.data.data ||[]); 
 if(refresh){
   toast({title:"message fetched successfully",variant:"default",color:"green"})
 }
     toast({title:"message fetched successfully",variant:"default",color:"green"})
    }
  } catch (error) {
    console.log("error in fetching message",error)
    toast({title:"error in fetching message",variant:"destructive",color:"red"})

  }
  finally{
   setLoading(false) 

  }
},[messages,handleDeleteMessage,toast])

useEffect(()=>{

if(!session||!session.user) return ;
  fetchMessages();
  fetchAcceptMessage();

  
},[session,fetchAcceptMessage, fetchMessages])
//handle on switch change
const handleSwitchChange=useCallback(async(value:boolean)=>{
  setisSwitchloading(true);
  try {
    const response=await axios.post("/api/accept-message",{
      AcceptingMessage:value
    })
    if(response.data.success){
      toast({title:"message updated successfully",variant:"default",color:"green"})
    }
  } catch (error) {
    console.log("error in updating message",error)
    const AxiosError=error as AxiosError<ApiResponse>;
    toast({title:"error in updating message", description:AxiosError?.response?.data?.message,variant:"destructive",color:"red"})

  }
  finally{
    setisSwitchloading(false);
  }
},[isSwitchloading])


const useCopyToClipboard=async ()=> {
  
  await navigator.clipboard.writeText(profileUrl);
  toast({title:"Copied to clipboard",variant:"default",color:"green"})
}

    if (status === "loading") {
        return <div>Loading...</div>;
    }

return (
    <div className='relative w-full h-full flex flex-col bg-slate-200 space-y-3 overflow-x-hidden'>

      <div className='w-screen h-full flex flex-col  justify-center container space-y-3 ms-2'>
<h1 className='text-black text-xl font-bold capitalize text-start'>Copy Your Unique Link</h1>
<span className='w-full h-auto flex justify-center items-center'>
<input className='w-[90%] h-10 rounded-md mt-2 bg-slate-300 text-black ' defaultValue={profileUrl} readOnly></input>
<Button onClick={() => useCopyToClipboard()} className='bg-black w-[10%] rounded-md text-white '>Copy </Button>
</span>
<div className="flex items-center space-x-2">
      <SwitchComponent id="copy-mode" {...register("Switch")} checked={Switch} onCheckedChange={handleSwitchChange} disabled={isSwitchloading}/>
      <Label htmlFor="copy-mode" className='capitalize\'>Accept Mode {"on"}</Label>
    </div>
      </div>
      <hr className={`my-4 border-t border-gray-300 border-2`} />
      <Button
        className="max-w-xs w-10 h-10 rounded-md bg-black text-white relative z-20 flex items-center justify-center m-2"
        onClick={()=>alert("refreshing message")}
      >
        {loading ? (
          <Loader2 className="animate-spin text-white" size={20} />
        ) : (
          <RefreshCw size={24} className="" />
        )}
      </Button>
      {
        (messages && messages.length === 0) && <h1 className='text-black text-xl font-bold capitalize text-start'>No message found</h1>
      }
      {/* message container */}
      <div className='w-full h-auto grid grid-cols-1 grid-rows-5 gap-2  md:grid-cols-2 '>
{messages && messages.map((message,index)=><MessageCard key={index} Message={message as Message}  onMessageDelete={handleDeleteMessage}/>)}
      </div>

    </div>
  )
}

export default Page