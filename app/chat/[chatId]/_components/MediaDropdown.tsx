import { useEffect, useRef, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ImageIcon, Plus, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

const MediaDropdown = ({ ChatDetails }: { ChatDetails: any }) => {
	const imageInput = useRef<HTMLInputElement>(null);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	

	const [isLoading, setIsLoading] = useState(false);

	const generateUploadUrl = useMutation(api.conversation.generateUploadUrl);
	const sendImage = useMutation(api.message.sendImage);

	const me = useQuery(api.user.getMe);

	

	const handleSendImage = async () => {
		setIsLoading(true);
		try {
			// Step 1: Get a short-lived upload URL
			const postUrl = await generateUploadUrl();
			// Step 2: POST the file to the URL
			const result = await fetch(postUrl, {
				method: "POST",
				headers: { "Content-Type": selectedImage!.type },
				body: selectedImage,
			});

			const { storageId } = await result.json();
			// Step 3: Save the newly allocated storage id to the database
			await sendImage({
				conversation: ChatDetails!._id,
				imgId: storageId,
				sender: me!._id,
			});

			setSelectedImage(null);
		} catch (err) {
			toast.error("Failed to send image");
		} finally {
			setIsLoading(false);
		}
	};



	return (
		<>
			<input
				type='file'
				ref={imageInput}
				accept='image/*'
				onChange={(e) => setSelectedImage(e.target.files![0])}
				hidden
			/>


			{selectedImage && (
				<MediaImageDialog
					isOpen={selectedImage !== null}
					onClose={() => setSelectedImage(null)}
					selectedImage={selectedImage}
					isLoading={isLoading}
					handleSendImage={handleSendImage}
				/>
			)}

		

			<DropdownMenu>
				<DropdownMenuTrigger>
					<Plus className='text-gray-600 dark:text-gray-400' />
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => imageInput.current!.click()}>
						<ImageIcon size={18} className='mr-1' /> Photo
					</DropdownMenuItem>
					
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
export default MediaDropdown;

type MediaImageDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedImage: File;
	isLoading: boolean;
	handleSendImage: () => void;
};

const MediaImageDialog = ({ isOpen, onClose, selectedImage, isLoading, handleSendImage }: MediaImageDialogProps) => {
	const [renderedImage, setRenderedImage] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedImage) return;
		const reader = new FileReader();
		reader.onload = (e) => setRenderedImage(e.target?.result as string);
		reader.readAsDataURL(selectedImage);
	}, [selectedImage]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogTitle />
			<DialogContent>
				<DialogDescription className='flex flex-col gap-10 justify-center items-center'>
					{renderedImage && <Image src={renderedImage} width={300} height={300} alt='selected image' />}
					<Button className='w-full' disabled={isLoading} onClick={handleSendImage}>
						{isLoading ? "Sending..." : "Send"}
					</Button>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};
