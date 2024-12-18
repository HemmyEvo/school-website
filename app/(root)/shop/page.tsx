'use client';

import { Calendar } from '@/components/ui/calendar';
import { PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import Link from 'next/link';

type Props = {};

const Shop = (props: Props) => {
  const admin = true; // Update this admin base on the database

  const manuals = [
    {
      courseCode: 'AG101',
      name: 'Climate Change and Agriculture',
      price: '$10.00',
      datePosted: '2024-12-10',
      deadline: '2024-12-20',
      link: '#',
    },
    {
      courseCode: 'CSC103',
      name: 'Introduction to Programming',
      price: '$15.00',
      datePosted: '2024-12-11',
      deadline: '2024-12-25',
      link: '#',
    },
    {
      courseCode: 'AG101',
      name: 'Soil Preparation Techniques',
      price: '$12.50',
      datePosted: '2024-12-12',
      deadline: '2024-12-22',
      link: '#',
    },
    // Add more manuals...
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterCourseCode, setFilterCourseCode] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredManuals = manuals.filter((manual) => {
    const matchesSearch = manual.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = filterDate
      ? manual.datePosted === format(filterDate, 'yyyy-MM-dd')
      : true;
    const matchesCourseCode = filterCourseCode
      ? manual.courseCode === filterCourseCode
      : true;
    return matchesSearch && matchesDate && matchesCourseCode;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedManuals = filteredManuals.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  let totalPages = Math.ceil(filteredManuals.length / itemsPerPage);
  if (totalPages === 0) {
    currentPage = 1;
    totalPages = 1;
  }

  return (
    <div className="h-full flex flex-col p-3 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Buy Manuals</p>
        {admin && (
          <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
            <PlusCircle />
            Add Manual
          </button>
        )} {/* upload file action */}
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search manuals..."
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
              selected={filterDate || undefined} // Convert null to undefined
              onSelect={(date) => setFilterDate(date || null)} // Ensure null can still be set
              className="border-none"
            />
          </PopoverContent>
        </Popover>

        <Select onValueChange={(value) => setFilterCourseCode(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {[...new Set(manuals.map((m) => m.courseCode))].map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Course Code
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Manual Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Date Posted
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Deadline
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Buy Link
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedManuals.map((manual, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {manual.courseCode}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {manual.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {manual.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {manual.datePosted}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {manual.deadline}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={manual.link}
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    Buy Now
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

export default Shop;
