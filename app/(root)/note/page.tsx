'use client';

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import UploadAction from '@/app/_component/UploadAction';
import UploadNoteAction from '@/app/_component/UploadNote';
import Link from 'next/link';

const Note = () => {
  const admin = true; // Update this based on the database

  const notes = [
    // Sample notes data
    {
      courseCode: 'AG101',
      title: 'Introduction to Soil Science',
      datePosted: '2024-12-01',
      timePosted: '9:00 AM',
      imageUrl: 'https://example.com/note1.png',
    },
    {
      courseCode: 'CSC103',
      title: 'Basics of Programming',
      datePosted: '2024-12-05',
      timePosted: '11:00 AM',
      imageUrl: 'https://example.com/note2.png',
    },
    // Additional notes...
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterCourseCode, setFilterCourseCode] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = filterDate
      ? note.datePosted === format(filterDate, 'yyyy-MM-dd')
      : true;
    const matchesCourseCode = filterCourseCode
      ? note.courseCode === filterCourseCode
      : true;
    return matchesSearch && matchesDate && matchesCourseCode;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotes = filteredNotes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  let totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  if (totalPages === 0) {
   currentPage = 1 
    totalPages = 1;
  }
  return (
    <div className="h-full flex flex-col p-3 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Notes</p>
        {admin && (
        <UploadNoteAction />
        )} {/* upload file action */}
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search notes..."
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
            {[...new Set(notes.map((n) => n.courseCode))].map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border text-sm sm:text-base border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
              Course Code
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
              Title
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
              Date Posted
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
              Time Posted
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
              Download
            </th>
            {admin &&(
                   <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                   Actions
                 </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedNotes.map((note, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {note.courseCode}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {note.title}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {note.datePosted}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {note.timePosted}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  href={note.imageUrl}
                  download
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Download Image
                </Link>
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

export default Note;
