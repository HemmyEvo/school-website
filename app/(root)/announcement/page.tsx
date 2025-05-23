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
import { Trash, ChevronDown, ChevronUp, Search, CalendarDays } from 'lucide-react';

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
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const filteredAnnouncements = fetchedAnnouncements.filter((announcement) => {
    const creationDate = new Date(announcement._creationTime);
    const datePosted = creationDate.toLocaleDateString();
    const matchesSearch = announcement?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const matchesDate = filterDate ? datePosted === format(filterDate, 'dd/MM/yyyy') : true;
    return matchesSearch && matchesDate;
  });

  const toggleDescriptionView = (index: number): void => {
    setExpandedDescriptions(prev => 
      prev.includes(index) 
        ? prev.filter((i) => i !== index) 
        : [...prev, index]
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.max(Math.ceil(filteredAnnouncements.length / itemsPerPage), 1);

  const deleteManual = useMutation(api.uploading.deleteAnnouncement);
 const handleDelete = async (noteId: string, closeDialog: () => void) => {
    try {
      setIsDeleting(noteId);
      await deleteManual({ noteId });
      closeDialog();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    } finally {
      setIsDeleting(null);
    }
  };
  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white/90">
            Classroom Announcements
          </h1>
          <p className="text-gray-600 dark:text-gray-300/80 mt-1">
            {filteredAnnouncements.length} active announcements
          </p>
        </div>
        
        {admin && (
          <div className="mt-4 md:mt-0">
            <UploadAnnouncementAction />
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search announcements..."
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
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {paginatedAnnouncements.length > 0 ? (
          paginatedAnnouncements.map((announcement, index) => (
            <div 
              key={index} 
              className="p-5 rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {announcement.title || 'Untitled Announcement'}
                    </h3>
                    {announcement.courseCode && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        {announcement.courseCode}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Posted on {format(new Date(announcement._creationTime), 'PPP')}
                    {announcement.venue && ` • ${announcement.venue}`}
                  </p>
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
                                            disabled={isDeleting === announcement._id}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              const dialog = e.currentTarget.closest('[data-state="open"]') as HTMLElement | null;
                                              const close = () =>
                                                dialog
                                                  ?.querySelector('[data-dialog-close]')
                                                  ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                                              handleDelete(announcement._id, close);
                                            }}
                                          >
                                            {isDeleting === announcement._id ? 'Deleting...' : 'Delete Assignment'}
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
                {announcement.description && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {announcement.description.length > 200 ? (
                      <>
                        {expandedDescriptions.includes(index) ? (
                          <>
                            <p>{announcement.description}</p>
                            <button
                              onClick={() => toggleDescriptionView(index)}
                              className="flex items-center text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mt-2"
                            >
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show less
                            </button>
                          </>
                        ) : (
                          <>
                            <p>{announcement.description.substring(0, 200)}...</p>
                            <button
                              onClick={() => toggleDescriptionView(index)}
                              className="flex items-center text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mt-2"
                            >
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Read more
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <p>{announcement.description}</p>
                    )}
                  </div>
                )}

                {announcement.attachment && (
                  <div className="mt-3">
                    <a 
                      href={announcement.attachment} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                    >
                      View Attachment →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40">
            <p className="text-gray-600 dark:text-gray-400">
              No announcements found{searchQuery || filterDate ? ' matching your criteria' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredAnnouncements.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-6 p-4 rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="gap-1"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Announcement;