'use client'
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Trash } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';
import UploadManual from '@/app/_component/UploadShop';
import { Calendar } from '@/components/ui/calendar';

type Props = {};

const Shop = (props: Props) => {
  const me = useQuery(api.user.getMe);
  const admin = me?.admin;
  const manuals = useQuery(api.getting.getShopItems) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterCourseCode, setFilterCourseCode] = useState('');
  let [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredManuals = manuals.filter((manual) => {
    const creationDate = new Date(manual._creationTime);
    const datePosted = creationDate.toLocaleDateString();
    const matchesSearch = manual.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = filterDate
          ? datePosted === format(filterDate, 'yyyy-MM-dd')
          : true;
    const matchesCourseCode = filterCourseCode
      ? manual.course === filterCourseCode
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

  const deleteManual = useMutation(api.uploading.deleteShop);
  const handleDelete = async (noteId: string) => {
    try {
      await deleteManual({ noteId });
    } catch (error) {
      alert('Error deleting note');
    }
  };

  // Function to format the price to Nigerian Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  return (
    <div className="h-full flex flex-col p-3 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold">Buy Manuals</p>
        {admin && <UploadManual />}
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
            <Button variant="outline" className="w-[280px] justify-start">
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
            {[...new Set(manuals.map((m) => m.course))].map((code) => (
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
              {admin && (
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedManuals.map((manual, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{manual.course}</td>
                <td className="border border-gray-300 px-4 py-2">{manual.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatPrice(manual.price)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(manual._creationTime).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{manual.deadline}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={manual.url}
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    Buy Now
                  </Link>
                </td>
                {admin && (
                  <td className="border border-gray-300 px-4 py-2">
                    <Dialog>
                      <DialogTrigger >
                        <Button variant="outline" className="text-red-500">
                          <Trash className="mr-2" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to permanently delete this entry? This action cannot be undone, and the data will be removed from the database.
                        </DialogDescription>
                        <DialogFooter>
                          <Button onClick={() => handleDelete(manual._id)} className="bg-red-500 text-white">
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

export default Shop;
