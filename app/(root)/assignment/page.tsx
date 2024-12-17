'use client';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import UploadAction from '@/app/_component/UploadAction';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import UploadAssignmentAction from '@/app/_component/UploadAssignment';

type Props = {};

const Assignment = (props: Props) => {
  const admin = true; // Update this admin base on the database

  const assignments = useQuery(api.getting.getAssignments) || [];

  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterCourseCode, setFilterCourseCode] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleQuestionView = (index: number) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter((i) => i !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  };

  // Updated filtering logic
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.question.some((line: string) =>
      line.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const creationDate = new Date(assignment._creationTime);
    const datePosted = creationDate.toLocaleDateString(); 
     const matchesDate = filterDate
         ? datePosted === format(filterDate, 'yyyy-MM-dd')
         : true;
    const matchesCourseCode = filterCourseCode
      ? assignment.courseCode === filterCourseCode
      : true;

    return matchesSearch && matchesDate && matchesCourseCode;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssignments = filteredAssignments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  let totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  if (totalPages === 0) {
    currentPage = 1;
    totalPages = 1;
  }

  return (
    <div className="h-full flex flex-col p-3 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Assignment</p>
        {admin && <UploadAssignmentAction />}
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search assignments..."
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

        <Select onValueChange={(value) => setFilterCourseCode(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {[...new Set(assignments.map((a) => a.courseCode))].map((code) => (
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
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Course Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Assignment Question</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Date Posted</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Time Posted</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Solution</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAssignments.map((assignment, index) => (
              <tr key={index} className="hover:bg-gray-50 hover:dark:bg-gray-900">
                <td className="border border-gray-300 px-4 py-2">{assignment.courseCode}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {expandedQuestions.includes(index) ? (
                    <>
                      {assignment.question.map((line: string, lineIndex: number) => (
                        <p key={lineIndex} className="mb-1">
                          {lineIndex + 1}. {line}
                        </p>
                      ))}
                      <button
                        onClick={() => toggleQuestionView(index)}
                        className="text-blue-500 underline hover:text-blue-700 ml-2"
                      >
                        View Less
                      </button>
                    </>
                  ) : (
                    <>
                    
                      {assignment.question.slice(0, 2).map((line: string, lineIndex: number) => (
                        <p key={lineIndex} className="mb-1">
                          {lineIndex + 1}. {line}
                        </p>
                        
                      ))}
                      {assignment.question.length > 0 && (
                        <button
                          onClick={() => toggleQuestionView(index)}
                          className="text-blue-500 underline hover:text-blue-700 ml-2"
                        >
                          View More
                        </button>
                      )}
                    </>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{new Date(assignment._creationTime).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(assignment._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <a href="#" className="text-blue-500 underline hover:text-blue-700">
                    View Solution
                  </a>
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

export default Assignment;
