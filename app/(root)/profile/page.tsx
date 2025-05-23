'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit3, Mail, Phone, User, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

const Profile: React.FC = () => {
  const user = useQuery(api.user.getMe);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.uploading.generateUploadUrl);
  const uploadImage = useMutation(api.uploading.updateImage);

  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast.error('Please select a valid image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const postUrl = await generateUploadUrl();
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      await new Promise((resolve, reject) => {
        xhr.open('POST', postUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(file);
      });

      const { storageId } = JSON.parse(xhr.responseText);
      await uploadImage({ user: user!._id, image: storageId });
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload. Please try again.'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-blue-100">Manage your account settings</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Profile help center</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8 relative group">
              <div className="relative">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name || 'Profile Picture'}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {user?.name ? (
                      <span className="text-4xl font-medium text-gray-600 dark:text-gray-300">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <Skeleton className="w-full h-full" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                />
                
                <button
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="absolute -bottom-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>
              
              {isUploading && (
                <div className="w-full max-w-xs mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-center text-gray-500 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user ? user.name : <Skeleton className="w-48 h-6 rounded-md" />}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {user ? user.email : <Skeleton className="w-64 h-4 mt-2 rounded-md" />}
                </p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Full Name
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {user ? user.name : <Skeleton className="w-32 h-4 rounded-md" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Matric Number
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {user ? user.username?.slice(3) : <Skeleton className="w-24 h-4 rounded-md" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Email Address
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {user ? user.email : <Skeleton className="w-48 h-4 rounded-md" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-full">
                      <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Need Help?
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Contact our support team
                      </p>
                    </div>
                  </div>
                  <Link href="https://wa.link/endaa7" passHref>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                    >
                      Contact
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Security Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;