import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import React from "react";

import Link from "next/link";

const Head = ({ ChatDetails }: { ChatDetails: any }) => {
  const chatImage = ChatDetails?.image;
  const chatName = ChatDetails?.name;
  return (
    <div className="w-full h-16 py-3 bg-[#dcdfdd] dark:bg-[#303030] border-[#a09f9fc7] dark:border-[#181818c7] border-b flex items-center justify-between px-4">
      {/* Profile Section */}
      <div className="profile flex items-center space-x-4">
        <Avatar className="relative">
          <AvatarImage src={chatImage || "/placeholder.png"} className="object-cover rounded-full" />
          <AvatarFallback>
            <Skeleton className="h-12 w-12 rounded-full" />
          </AvatarFallback>
        </Avatar>
        <div className="div">
            {!ChatDetails &&(
            <div className="flex flex-col space-y-1"> 
            <Skeleton className="h-4 w-[150px]" />
            </div>
            )}
 
        <p className="Name capitalize">{chatName}</p>
      
        </div>
       
      </div>

    </div>
  );
};

export default Head;
