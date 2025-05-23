'use client';
import React, { useState } from 'react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, MessageSquare, User, Mail } from 'lucide-react';

const Users = () => {
    // Data hooks
    const me = useQuery(api.user.getMe);
    const createChat = useMutation(api.conversation.createChat);
    const filterUser = useQuery(api.user.getUser) || [];
    const { isAuthenticated } = useConvexAuth();
    const chats = useQuery(api.conversation.getChat, isAuthenticated ? undefined : "skip");

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Filter and process users
    const users = filterUser.filter(user => user._id !== me?._id);
    const identity = chats?.map(chat => chat) || [];

    // Create chats if needed
    React.useEffect(() => {
        if (me) {
            users.forEach(user => {
                createChat({ participants: [user._id, me._id] });
            });
        }
    }, [me, users]);

    // Filter and paginate
    const filteredUsers = users
        .filter(user => user?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="h-full w-full p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header with subtle gradient */}
            <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
                    <h1 className="text-2xl md:text-3xl font-bold">Classroom Network</h1>
                    <p className="opacity-90 mt-2">Connect with your peers and collaborate seamlessly</p>
                </div>
            </div>

            {/* Search with advanced filter UI */}
            <div className="relative mb-8 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <Input
                    type="text"
                    placeholder="Search by name, email, or course..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-6 text-lg border-0 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {filteredUsers.length} {filteredUsers.length === 1 ? 'member' : 'members'}
                </div>
            </div>

            {/* User cards with holographic effect */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedUsers.map((user) => {
                    const chat = me?._id && identity.find(chat => 
                        chat.participant.includes(me._id) && 
                        chat.participant.includes(user._id)
                    );

                    return (
                        <div 
                            key={user._id}
                            className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            {/* Holographic accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400" />

                            <div className="p-5">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white capitalize line-clamp-1">
                                            {user.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            <Mail className="h-4 w-4 mr-1" />
                                            <span className="line-clamp-1">{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                                            Student
                                        </span>
                                        {user.admin && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                                                Admin
                                            </span>
                                        )}
                                    </div>

                                    {chat && (
                                        <Link href={`./chat/${chat._id}`}>
                                            <Button 
                                                size="sm" 
                                                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md transition-all transform group-hover:scale-105"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Message
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Advanced pagination */}
            {totalPages > 1 && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {paginatedUsers.length} of {filteredUsers.length} classmates
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="rounded-full px-4 py-2 border-gray-300 dark:border-gray-600"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        
                        <div className="flex space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = currentPage <= 3 
                                    ? i + 1 
                                    : currentPage >= totalPages - 2 
                                        ? totalPages - 4 + i 
                                        : currentPage - 2 + i;
                                
                                if (page < 1 || page > totalPages) return null;

                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className={`rounded-full w-10 h-10 p-0 ${currentPage === page ? 'bg-blue-600' : 'border-gray-300 dark:border-gray-600'}`}
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="rounded-full px-4 py-2 border-gray-300 dark:border-gray-600"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <User className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        No classmates found
                    </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {searchQuery 
                            ? "Try adjusting your search query" 
                            : "Your classroom network will appear here"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Users;