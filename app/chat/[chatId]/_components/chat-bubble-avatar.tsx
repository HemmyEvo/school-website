import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatBubbleAvatar = ({ isMember, message}: any) => {

	return (
		<Avatar className='overflow-visible relative'>
			{message.sender.isOnline && isMember && (
				<div className='absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 ' />
			)}
			<AvatarImage src={message.sender?.image} className='rounded-full object-cover w-8 h-8' />
			<AvatarFallback className='w-8 h-8 '>
				<div className='animate-pulse bg-gray-tertiary rounded-full'></div>
			</AvatarFallback>
		</Avatar>
	);
};
export default ChatBubbleAvatar;