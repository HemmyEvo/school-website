'use client';

import { Calendar } from '@/components/ui/calendar';
import { PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import UploadCourse from '@/app/_component/UploadCourse';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Props = {};

const Courses = (props: Props) => {
  const admin = true; // Update this admin base on the database

  // Fetch courses from Convex
  const courses = useQuery(api.getting.getCourses) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourseCode, setFilterCourseCode] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  let totalUnits = courses.reduce((sum, course) => sum + course.unit, 0);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.course
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCourseCode = filterCourseCode
      ? course.course === filterCourseCode
      : true;
    return matchesSearch && matchesCourseCode;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  let totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  if (totalPages === 0) {
    totalPages = 1;
    currentPage = 1;
  }

  return (
    <div className="h-full flex flex-col p-3 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Course Offering</p>
        {admin && <UploadCourse />}
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />

        <Select onValueChange={(value) => setFilterCourseCode(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {[...new Set(courses.map((course) => course.course))].map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm sm:text-base border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Course Code
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                Units
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCourses.map((course, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border text-center border-gray-300 px-4 py-2">
                  {course.course}
                </td>
                <td className="border text-center border-gray-300 px-4 py-2">
                  {course.unit}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="border text-center border-gray-300 px-4 py-2">Total</th>
              <th className="border text-center border-gray-300 px-4 py-2">{totalUnits}</th>
            </tr>
          </tfoot>
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

export default Courses;
