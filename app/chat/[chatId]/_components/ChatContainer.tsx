import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {Dialog,  DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const ChatBubble = ({ me, message, previousMessage, ChatDetails }: any) => {
	const date = new Date(message._creationTime);
	let hour = date.getHours();
	const minute = date.getMinutes().toString().padStart(2, "0");
	const amPm = hour >= 12 ? "PM" : "AM";
	useEffect(() =>{

	},[])
	// Convert to 12-hour format
	hour = hour % 12 || 12; // Convert 0 to 12 for midnight
	const formattedHour = hour.toString().padStart(2, "0");

	const time = `${formattedHour}:${minute} ${amPm}`;

	const isGroup = ChatDetails?.isGroup;
	const fromMe = message.sender?._id === me._id;
	const bgClass = fromMe 
    ? "bg-[#59f794]/80 backdrop-blur-sm" 
    : "bg-white/80 dark:bg-[#2d2d2d]/80 backdrop-blur-sm";
	const [open, setOpen] = useState(false);

	const renderMessageContent = () => {
		switch (message.messageType) {
			case "text":
				return <TextMessage message={message} />;
			case "image":
				return <ImageMessage message={message} handleClick={() => setOpen(true)} />;

			default:
				return null;
		}
	};
return (
    <>
      <DateIndicator message={message} previousMessage={previousMessage} />
      <div className={`flex gap-2 w-full ${fromMe ? "justify-end" : "justify-start"}`}>
        {!fromMe && <ChatBubbleAvatar message={message} />}
        <div
          className={`flex flex-col max-w-[80%] px-4 py-2 rounded-xl shadow-lg ${bgClass} border border-white/20`}
        >
          {renderMessageContent()}
          <MessageTime time={time} fromMe={fromMe} />
        </div>
      </div>
    </>
  );
};
	
	
export default ChatBubble;



const ImageMessage = ({ message, handleClick }: any) => {
	return (
		<div className='w-[250px] h-[250px] overflow-hidden relative'>
			<Image
				src={message.content}
				fill
				className='cursor-pointer object-cover rounded'
				alt='image'
				onClick={handleClick}
			/>
		</div>
	);
};




const ImageDialog = ({ src, onClose, open }: { open: boolean; src: string; onClose: () => void }) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-transparent border-none max-w-[90vw]">
        <div className="relative h-[80vh] w-full bg-black/50 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
          <Image 
            src={src} 
            fill 
            className="object-contain p-4" 
            alt="Enlarged chat image" 
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full"
          >
            ✕
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const MessageTime = ({ time, fromMe, ChatDetails,  message }: { time: string; fromMe: boolean; ChatDetails: any; message:any;}) => {
	return (
		<p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
			{time} 
		</p>
	);
};



const OtherMessageIndicator = () => (
	<div className='absolute bg-white  dark:bg-[#272727] top-0 -left-[4px] w-3 h-3 rounded-bl-full' />
);



const SelfMessageIndicator = () => (
	<div className='absolute bg-[#59f796] dark:bg-[#00804b] top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden' />
);


const TextMessage = ({ message }: any) => {
  const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content);

  return (
    <div className="space-y-1">
      {isLink ? (
        <a
          href={message.content}
          target="_blank"
          className="text-blue-500 hover:text-blue-400 underline break-all"
        >
          {message.content}
        </a>
      ) : (
        message.content.split("\n").map((line, i) => (
          <p key={i} className="text-gray-800 dark:text-gray-200">
            {line}
          </p>
        ))
      )}
    </div>
  );
};