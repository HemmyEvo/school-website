'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';

const Profile: React.FC = () => {
  const user = useQuery(api.user.getMe);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.uploading.generateUploadUrl);
  const uploadImage = useMutation(api.uploading.updateImage);

  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast.error('Please select a valid image.');
      return;
    }

    try {
      setIsUploading(true);

      const postUrl = await generateUploadUrl();
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!res.ok) {
        throw new Error('File upload failed');
      }

      const { storageId } = await res.json();
      await uploadImage({ user: user!._id, image: storageId });
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex flex-col items-center mb-6">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="file-upload"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          }}
        />
        <Avatar className="w-40 h-40 relative">
          <label
            htmlFor="file-upload"
            className="absolute cursor-pointer flex justify-center items-center rounded-full overflow-hidden bottom-2 right-4 bg-white h-10 w-10"
          >
            <Edit3 />
          </label>
          <AvatarImage
            src={user?.image || undefined}
            alt={user?.name || 'Profile Picture'}
            className="rounded-full mb-4 border-4 border-gray-300 shadow-md"
          />
          <AvatarFallback>
            <Skeleton className="w-40 h-40" />
          </AvatarFallback>
        </Avatar>
        <div className="text-2xl mt-4 font-semibold text-gray-800">
          {user ? user.name : <Skeleton className="w-[300px] h-4 rounded-md" />}
        </div>
        <div className="text-lg text-gray-500">
          {user ? user.email : <Skeleton className="w-[200px] mt-3 h-4 rounded-md" />}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between text-gray-600">
          <p className="text-sm font-medium">Full Name:</p>
          <div className="text-sm text-gray-700">
            {user ? user.name : <Skeleton className="w-[100px] h-4 rounded-md" />}
          </div>
        </div>

        <div className="flex justify-between text-gray-600">
          <p className="text-sm font-medium">Matric Number:</p>
          <div className="text-sm text-gray-700">
            {user ? user.username?.slice(3) : <Skeleton className="w-[100px] h-4 rounded-md" />}
          </div>
        </div>

        <div className="flex justify-between text-gray-600">
          <p className="text-sm font-medium">Email:</p>
          <div className="text-sm text-gray-700">
            {user ? user.email : <Skeleton className="w-[200px] mt-3 h-4 rounded-md" />}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Link href="https://wa.link/endaa7">
          <Button
            variant="outline"
            className={cn(
              'w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200',
              { 'opacity-50 pointer-events-none': isUploading }
            )}
          >
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
