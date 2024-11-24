"use client";
import React from "react";
import Image from "next/image";
import "../style/global.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const Home = () => {
  const router=useRouter();
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-blue-100 p-6 l">
      {/* Text Section */}
      <div className="flex-1 text-center md:text-left p-4 max-w-md">
        <h1 className="text-4xl font-bold mb-4">Speak & Listen Freely</h1>
        <p className="text-lg mb-6">
          Get feedback from your users without leaving your app.
        </p>
        <Button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600" onClick={()=>router.push("/sign-in")} >
          Get Start
        </Button>
      </div>

      <div className="flex-1 flex justify-center p-4 max-w-md">
        <div className="relative w-[250px] h-[500px] bg-black rounded-xl shadow-xl overflow-hidden rotate-3">
          <Image
            src="/Screenshot 2024-11-24 094041.png" 
            width={250}
            height={500}
            alt="Mobile screen"
            layout="container" 
            objectFit="cover" 
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
