'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import UploadAnnouncementAction from '@/app/_component/UploadAnnouncement';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Trash } from 'lucide-react';

const Announcement = () => {
  const me = useQuery(api.user.getMe);
  const admin = me?.admin;

  const fetchedAnnouncements = useQuery(api.getting.getAnnouncements) || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const filteredAnnouncements = fetchedAnnouncements.filter((announcement) => {
    const creationDate = new Date(announcement._creationTime);
    const datePosted = creationDate.toLocaleDateString();
    const matchesSearch = announcement?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const matchesDate = filterDate ? datePosted === format(filterDate, 'MM/dd/yyyy') : true;
    return matchesSearch && matchesDate;
  });

  const toggleDescriptionView = (index: number) => {
    if (expandedDescriptions.includes(index)) {
      setExpandedDescriptions(expandedDescriptions.filter((i) => i !== index));
    } else {
      setExpandedDescriptions([...expandedDescriptions, index]);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage);

  let totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  if (totalPages === 0) {
    totalPages = 1;
  }

  const deleteManual = useMutation(api.uploading.deleteAnnouncement);
  const handleDelete = async (noteId: string) => {
    try {
      await deleteManual({ noteId });
    } catch (error) {
      alert('Error deleting note');
    }
  };

  return (
    <div className="h-full flex flex-col p-3 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Announcements</p>
        {admin && <UploadAnnouncementAction />}
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
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm sm:text-base border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">S/N</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Announcement type</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Course Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Venue</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Attachment</th>
              {admin && <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedAnnouncements.map((announcement, index) => (
              <tr key={index} className="hover:bg-gray-50 hover:dark:bg-gray-900">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{announcement.title || 'none'}</td>
                <td className="border border-gray-300 px-4 py-2">{announcement.courseCode || 'none'}</td>
                <td className="border border-gray-300 px-4 py-2 whitespace-pre-wrap">
                  {announcement.description && announcement.description.length > 100 ? (
                    expandedDescriptions.includes(index) ? (
                      <>
                        {announcement.description}
                        <button
                          onClick={() => toggleDescriptionView(index)}
                          className="text-blue-500 underline hover:text-blue-700 ml-2"
                        >
                          View Less
                        </button>
                      </>
                    ) : (
                      <>
                        {announcement.description.slice(0, 100)}...
                        <button
                          onClick={() => toggleDescriptionView(index)}
                          className="text-blue-500 underline hover:text-blue-700 ml-2"
                        >
                          View More
                        </button>
                      </>
                    )
                  ) : (
                    announcement.description
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{announcement.venue || 'none'}</td>
                <td className="border border-gray-300 px-4 py-2">{announcement.attachment || 'none'}</td>
                {admin && (
                  <td className="border border-gray-300 px-4 py-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger>
                        <Button variant="outline" className="text-red-500">
                          <Trash className="mr-2" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to permanently delete this entry? This action cannot be undone and the data will be removed from the database.
                        </DialogDescription>
                        <DialogFooter>
                        <Button onClick={async () => { await handleDelete(announcement._id); setIsDialogOpen(false); }} className="bg-red-500 text-white">
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

export default Announcement;
