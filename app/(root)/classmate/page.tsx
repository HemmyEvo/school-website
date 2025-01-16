'use client';
import React, { useState } from 'react';
// import UploadCourse from '@/app/_component/UploadCourse';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

const Users = () => {
    const me = useQuery(api.user.getMe);
    // const admin = me?.admin;
    const createChat = useMutation(api.conversation.createChat)
    // Fetch users from Convex
    const filterUser = useQuery(api.user.getUser) || [];

    const users = filterUser.filter(user => user._id !== me?._id || user.admin !== me.admin);

if (me) {
    users.map(user => 
        createChat({
            participants: [user._id, me._id]
        })
    )
}
const { isAuthenticated } = useConvexAuth();
const chats = useQuery(api.conversation.getChat, isAuthenticated ? undefined : "skip");
const identity = chats?.map((chat) => chat) || [];
console.log()
    
    const [searchQuery, setSearchQuery] = useState('');
    let [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredUsers = users
        .filter((user) => {
            const matchesSearch = user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
            return matchesSearch;
        })
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    let totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (totalPages === 0) {
        totalPages = 1;
        currentPage = 1;
    }

    return (
        <div className="h-full flex flex-col p-3 w-full">
            <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold">Course mates</p>
            </div>

            <div className="mb-4 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search names..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm sm:text-base border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">S/N</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Contact</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                                <td className="border text-center capitalize border-gray-300 px-4 py-2">
                                    {user.name}
                                </td>
                                <td className="border text-center border-gray-300 px-4 py-2">{user.email}</td>
                                <td className="border text-center border-gray-300 px-4 py-2">
                                   {me?._id && identity.filter(chat => chat.participant.includes(me._id) && chat.participant.includes(user._id)).map(chat => (
                                       <Link key={chat._id} href={`./chat/${chat._id}`}>Chat {':)'}</Link>
                                   ))}
                                    {/* {id.includes(me?._id) && id.includes(user._id) &&  } */}
                       
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Users;
