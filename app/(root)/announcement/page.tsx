'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import UploadAction from '@/app/_component/UploadAction';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import UploadAnnouncementAction from '@/app/_component/UploadAnnouncement';


const Announcement = () => {
  const me = useQuery(api.user.getMe)
  const admin = me?.admin; // Update this based on the database

  // Fetch announcements from Convex
  const fetchedAnnouncements = useQuery(api.getting.getAnnouncements) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterCourseCode, setFilterCourseCode] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAnnouncements = fetchedAnnouncements.filter((announcement) => {
    const creationDate = new Date(announcement._creationTime);
    const datePosted = creationDate.toLocaleDateString(); 
    const timePosted = creationDate.toLocaleTimeString();
    const matchesSearch = announcement.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = filterDate
      ? datePosted === format(filterDate, 'yyyy-MM-dd')
      : true;
    const matchesCourseCode = filterCourseCode
      ? announcement.courseCode === filterCourseCode || announcement.courseCode === 'ALL'
      : true;
    return matchesSearch && matchesDate && matchesCourseCode;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  let totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  if (totalPages === 0) {
    currentPage = 1;
    totalPages = 1;
  }

  return (
    <div className="h-full flex flex-col p-3 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Announcements</p>
        {admin && (
          <UploadAnnouncementAction />
        )} {/* Add announcement action */}
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-[280px] justify-start')}>
              {filterDate ? format(filterDate, 'PPP') : 'Filter by date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filterDate || undefined}
              onSelect={(date) => setFilterDate(date || null)}
              className="border-none"
            />
          </PopoverContent>
        </Popover>

        <Select
          onValueChange={(value) => setFilterCourseCode(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {[...new Set(fetchedAnnouncements.map((a) => a.courseCode))].map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ul className="list-none space-y-4">
        {paginatedAnnouncements.map((announcement, index) => (
          <li key={index} className="border border-gray-300 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">
              {announcement.title}
            </h3>
            <p className="text-gray-600 mt-2">
              {announcement.description}
            </p>
            <div className="text-sm text-gray-500 mt-2">
              <p>Posted on: {new Date(announcement._creationTime).toLocaleDateString()}</p>
              <p>Time: {new Date(announcement._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p>Course Code: {announcement.courseCode}</p>
            </div>
          </li>
        ))}
      </ul>

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

export default Announcement;
