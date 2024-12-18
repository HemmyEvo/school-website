'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

const Profile = () => {
  const user = useQuery(api.user.getMe);

  return (
    <div className="h-full flex flex-col p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex flex-col items-center mb-6">
        <img
          src={user?.image || '/default-avatar.jpg'}
          alt="User Avatar"
          className="w-40 h-40 rounded-full mb-4 border-4 border-gray-300 shadow-md"
        />
        <p className="text-2xl font-semibold text-gray-800">{user?.name}</p>
        <p className="text-lg text-gray-500">{user?.email}</p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between text-gray-600">
          <p className="text-sm font-medium">Full Name:</p>
          <p className="text-sm text-gray-700">{user?.name}</p>
        </div>

        <div className="flex justify-between text-gray-600">
          <p className="text-sm font-medium">Matric Number:</p>
          <p className="text-sm text-gray-700">{user?.username.slice(3)}</p>
        </div>

        <div className="flex justify-between text-gray-600">
          <p className="text-sm font-medium">Email:</p>
          <p className="text-sm text-gray-700">{user?.email}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Link href={'https://wa.link/endaa7'}>
        <Button variant="outline" className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200">
          Contact Support
        </Button>
        </Link>
     
      </div>
    </div>
  );
};

export default Profile;
