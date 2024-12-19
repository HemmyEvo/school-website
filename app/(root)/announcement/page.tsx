'use client';

import React, { useEffect, useState } from 'react';
import { DatabaseIcon, PlusCircle } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import UploadAction from '@/app/_component/UploadShop';
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
    const matchesSearch = announcement.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = filterDate
      ? datePosted === format(filterDate, 'MM/dd/yyyy')
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

      <ul className="space-y-6">
  {paginatedAnnouncements.map((announcement, index) => (
    <li 
      key={index} 
      className="border border-gray-200 rounded-lg shadow-lg p-6 bg-gradient-to-r from-white via-gray-50 to-white hover:shadow-xl transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 hover:text-indigo-600">
          {announcement.title}
        </h3>
        <span className="text-sm text-gray-500">
          {formatDate(announcement._creationTime)}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed mb-4">
        {announcement.description}
      </p>
      <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
        <div>
          <p><strong>Time:</strong> {"N/A"}</p>
          <p><strong>Venue:</strong> { "N/A"}</p>
        </div>
        <div>
          <p><strong>Attachment:</strong> {"None"}</p>
          <p><strong>Course Code:</strong> {announcement.courseCode}</p>
        </div>
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
