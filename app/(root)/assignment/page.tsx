'use client';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import UploadAssignmentAction from '@/app/_component/UploadAssignment';
import Link from 'next/link';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash, ChevronDown, ChevronUp, Search, CalendarDays, BookOpen } from 'lucide-react';

const Assignment = () => {
  const me = useQuery(api.user.getMe);
  const admin = me?.admin;

  const assignments = useQuery(api.getting.getAssignments) || [];
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterCourseCode, setFilterCourseCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const itemsPerPage = 5;

  const toggleQuestionView = (index: number) => {
    setExpandedQuestions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.question.some((line: string) =>
      line.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const creationDate = new Date(assignment._creationTime);
    const datePosted = creationDate.toLocaleDateString();
    const matchesDate = filterDate
      ? datePosted === format(filterDate, 'dd/MM/yyyy')
      : true;
    const matchesCourseCode = filterCourseCode
      ? assignment.courseCode === filterCourseCode
      : true;

    return matchesSearch && matchesDate && matchesCourseCode;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssignments = filteredAssignments.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.max(Math.ceil(filteredAssignments.length / itemsPerPage), 1);

  const deleteNote = useMutation(api.uploading.deleteAssignment);

  const handleDelete = async (noteId: string, closeDialog: () => void) => {
    try {
      setIsDeleting(noteId);
      await deleteNote({ noteId });
      closeDialog();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const uniqueCourseCodes = [...new Set(assignments.map(a => a.courseCode))];

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-5 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Class Assignments
          </h1>
          <p className="text-gray-600 dark:text-gray-300/80 mt-1">
            {filteredAssignments.length} active assignments
          </p>
        </div>

        {admin && (
          <div className="mt-4 md:mt-0">
            <UploadAssignmentAction />
          </div>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/40 dark:bg-gray-800/50 border border-white/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('justify-start text-left font-normal')}>
              <CalendarDays className="mr-2 h-4 w-4" />
              {filterDate ? format(filterDate, 'PPP') : 'Filter by date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-white/30 dark:border-gray-700/40">
            <Calendar
              mode="single"
              selected={filterDate || undefined}
              onSelect={(date) => setFilterDate(date || null)}
              className="border-none"
            />
          </PopoverContent>
        </Popover>

        <Select onValueChange={(value) => setFilterCourseCode(value === 'all' ? '' : value)}>
          <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/40">
            <SelectItem value="all" className="hover:bg-white/20 dark:hover:bg-gray-700/50">
              All Courses
            </SelectItem>
            {uniqueCourseCodes.map((code) => (
              <SelectItem
                key={code}
                value={code}
                className="hover:bg-white/20 dark:hover:bg-gray-700/50"
              >
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {paginatedAssignments.length > 0 ? (
          paginatedAssignments.map((assignment, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {assignment.courseCode}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(assignment._creationTime), 'MMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                </div>

                {admin && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/40">
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        This will permanently delete this assignment. This action cannot be undone.
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            disabled={isDeleting === assignment._id}
                            onClick={(e) => {
                              e.preventDefault();
                              const dialog = e.currentTarget.closest('[data-state="open"]') as HTMLElement | null;
                              const close = () =>
                                dialog
                                  ?.querySelector('[data-dialog-close]')
                                  ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                              handleDelete(assignment._id, close);
                            }}
                          >
                            {isDeleting === assignment._id ? 'Deleting...' : 'Delete Assignment'}
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="outline" data-dialog-close>Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assignment Questions:
                </h4>
                <div className="prose prose-sm dark:prose-invert max-w-none bg-white/10 dark:bg-gray-700/20 p-4 rounded-lg">
                  {expandedQuestions.includes(index) ? (
                    <>
                      {assignment.question.map((line: string, lineIndex: number) => (
                        <p key={lineIndex} className="mb-2">
                          <span className="font-medium">{lineIndex + 1}.</span> {line}
                        </p>
                      ))}
                      <button
                        onClick={() => toggleQuestionView(index)}
                        className="flex items-center text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mt-2"
                      >
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show less
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="mb-2">
                        <span className="font-medium">1.</span>{' '}
                        {assignment.question[0].substring(0, 100)}
                        {assignment.question[0].length > 100 ? '...' : ''}
                      </p>
                      {assignment.question.length > 1 && (
                        <button
                          onClick={() => toggleQuestionView(index)}
                          className="flex items-center text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mt-1"
                        >
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Show {assignment.question.length - 1} more questions
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <Button asChild variant="outline" className="border-blue-500 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    <Link href="#">View Solution</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40">
            <p className="text-gray-600 dark:text-gray-400">
              No assignments found{searchQuery || filterDate || filterCourseCode ? ' matching your criteria' : ''}
            </p>
          </div>
        )}
      </div>

      {filteredAssignments.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-6 p-4 rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="gap-1"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="gap-1"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Assignment;
