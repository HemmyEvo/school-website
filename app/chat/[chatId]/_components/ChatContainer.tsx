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
	const bgClass = fromMe ? "bg-[#59f794]" :  "bg-white";
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

	
	if (!fromMe) {
		return (
			<>
				<DateIndicator message={message} previousMessage={previousMessage} />
				<div className='flex gap-1 w-2/3'>
					<ChatBubbleAvatar message={message}/>
					<div className={`flex flex-col z-20 max-w-[100%] px-2 pt-1  rounded-md shadow-md relative ${bgClass}`}>
						<OtherMessageIndicator />
						{renderMessageContent()}
						{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
						<MessageTime ChatDetails={ChatDetails} message={message} time={time} fromMe={fromMe} />
					</div>
				</div>
			</>
		);
	}
	
	return (
		<>
			<DateIndicator message={message} previousMessage={previousMessage} />
			<div className='flex gap-1 w-2/3 ml-auto'>
				<div className={`flex flex-col z-20 max-w-[100%] px-2 pt-1 ml-auto rounded-md shadow-md relative ${bgClass}`}>
					<SelfMessageIndicator />
					{renderMessageContent()}
					{open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
					<MessageTime ChatDetails={ChatDetails} message={message} time={time} fromMe={fromMe} />
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
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogTitle />
			<DialogContent className='min-w-[750px]'>
				<DialogDescription className='relative h-[450px] flex justify-center'>
					<Image src={src} fill className='rounded-lg object-contain' alt='image' />
				</DialogDescription>
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
	const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL
	const messageArray = message.content.split("\n");
  
	return (
	  <div >
		{isLink ? (
		  // If it's a URL, render it as a clickable link
		  <a
			href={message.content}
			target='_blank'
			rel='noopener noreferrer'
			className='mr-2 text-sm font-light break-words text-blue-400 underline'
		  >
			{message.content} {/* Display the URL as a single line */}
		  </a>
		) : (
		  // Otherwise, render each line of the message in a separate <p> tag
		  messageArray.map((msg: string, i: number) => (
			<p className='mr-2 w-[100%]  break-words text-sm font-light' key={i}>
			  {msg}
			</p>
		  ))
		)}
	  </div>
	);
  };