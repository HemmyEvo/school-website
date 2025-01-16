"use client";

import React from "react";
import Head from "./_components/Head";
import Body from "./_components/Body";
import { redirect, useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import MessageInput from "./_components/Input";

const Page = () => {
  const params = useParams();
  const { isAuthenticated } = useConvexAuth();
  const chats = useQuery(api.conversation.getChat, isAuthenticated ? undefined : "skip");

  // Filter for the matching chat
  const ChatDetails = chats?.find((chat) => params.chatId === chat._id) || redirect("/classmate");
  return (
    <div className=" w-full bg-[#dddddd]  h-[100vh] flex flex-col">
      <Head ChatDetails={ChatDetails} />
      <Body Detail={ChatDetails}/>
      <MessageInput ChatDetails={ChatDetails}/>
    </div>
  );
};

export default Page;
