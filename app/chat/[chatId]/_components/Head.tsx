import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

const Head = ({ ChatDetails }: { ChatDetails: any }) => {
  const chatImage = ChatDetails?.image;
  const chatName = ChatDetails?.name;

  return (
    <div className="w-full h-16 py-3 bg-white/10 dark:bg-[#1a1a1a]/70 backdrop-blur-md border-b border-white/20 dark:border-[#333]/50 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="profile flex items-center space-x-4">
        <Avatar className="relative border-2 border-white/30">
          <AvatarImage src={chatImage || "/placeholder.png"} className="object-cover rounded-full" />
          <AvatarFallback>
            <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
          </AvatarFallback>
        </Avatar>
        <div className="div">
          {!ChatDetails && (
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-4 w-[150px] bg-white/10" />
            </div>
          )}
          <p className="Name capitalize text-white dark:text-gray-100 font-medium">
            {chatName || "Classroom Chat"}
          </p>
        </div>
      </div>
    </div>
  );
};