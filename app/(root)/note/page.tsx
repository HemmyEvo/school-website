'use client';

import React, { useState } from 'react';
import { Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UploadNoteAction from '@/app/_component/UploadNote';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Note = () => {
  const me = useQuery(api.user.getMe);
  const admin = me?.admin;

  const notes = useQuery(api.getting.getNotes) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterCourseCode, setFilterCourseCode] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  const [editingNote, setEditingNote] = useState<any | null>(null);  // State to manage editing
  const itemsPerPage = 5;

  const filteredNotes = notes.filter((note) => {
    const creationDate = new Date(note._creationTime);
    const datePosted = creationDate.toLocaleDateString();
    const matchesSearch = note.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = filterDate
      ? datePosted === format(filterDate, 'yyyy-MM-dd')
      : true;
    const matchesCourseCode = filterCourseCode
      ? note.courseCode === filterCourseCode || note.courseCode === 'ALL'
      : true;
    return matchesSearch && matchesDate && matchesCourseCode;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotes = filteredNotes.slice(startIndex, startIndex + itemsPerPage);

  let totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  if (totalPages === 0) {
    currentPage = 1;
    totalPages = 1;
  }
  // Helper to download all URLs as a ZIP file
  const downloadAllImages = async (urls: string[], title: string) => {
    const zip = new JSZip();

    await Promise.all(
      urls.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(`${title}_${index + 1}.jpg`, blob);
      })
    );

    const zipContent = await zip.generateAsync({ type: 'blob' });
    saveAs(zipContent, `${title}.zip`);
  };

  // Helper to download a single image
  const downloadSingleImage = async (url: string, title: string, index: number) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, `${title}_${index + 1}.jpg`);
  };

  const deleteNote = useMutation(api.uploading.deleteNote);
  const handleDelete = async (noteId: string) => {
      try {
        await deleteNote({ noteId });
      } catch (error) {
        alert("Error deleting note");
      }
    
  };


  return (
    <div className="h-full flex flex-col p-3 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Notes</p>
        {admin && <UploadNoteAction />}
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
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Course Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Date Posted</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Download</th>
              {admin && <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Actions</th>}
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
                  {new Date(note._creationTime).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="outline">Download</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {note.imageUrl.length > 1 && (
                        <DropdownMenuItem onClick={() => downloadAllImages(note.imageUrl, note.title)}>
                          Download All as ZIP
                        </DropdownMenuItem>
                      )}
                      {note.imageUrl.map((url, i) => (
                        <DropdownMenuItem key={i} onClick={() => downloadSingleImage(url, note.title, i)}>
                          Download {i + 1}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                {admin && (
                  <td className="border border-gray-300 px-4 py-2">
                    <Dialog>
                    <DialogTrigger>
                    <Button variant="outline" className="text-red-500">
                    <Trash className="mr-2" /> Delete
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogTitle>
                    Confirm Deletion
                    </DialogTitle>
                    <DialogDescription>
                    Are you sure you want to permanently delete this entry? This action cannot be undone and the data will be removed from the database.
                    </DialogDescription>
                    <DialogFooter>
                    <Button onClick={() => handleDelete(note._id)} className="bg-red-500 text-white">
                    Yes, Delete
                    </Button>
                    <DialogClose>
                    <Button variant="outline" className="text-gray-500">Cancel</Button>
                    </DialogClose>
                    </DialogFooter>
                    </DialogContent>
                    </Dialog>

              
                     
                  </td>
                )}
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
