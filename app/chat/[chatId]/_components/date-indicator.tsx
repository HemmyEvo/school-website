import { getRelativeDateTime, isSameDay } from "@/lib/utils";

const DateIndicator = ({ message, previousMessage }: any) => {
	return (
		<>
			{!previousMessage || !isSameDay(previousMessage._creationTime, message._creationTime) ? (
				<div className='flex justify-center'>
					<p className='text-sm text-gray-500 dark:text-gray-400 mb-2 p-1 z-50 rounded-md bg-[#ffffff96] dark:bg-[#5353539d]'>
						{getRelativeDateTime(message, previousMessage)}
					</p>
				</div>
			) : null}
		</>
	);
};
export default DateIndicator;