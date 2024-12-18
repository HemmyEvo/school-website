import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

const formSchema = z.object({
  course: z.string().nonempty('Course code is required'),
  price: z.string().nonempty('Price is required'),
  name: z.string().nonempty('Name is required'),
  url: z.string().url('Invalid URL').nonempty('URL is required'),
});

const UploadManual = () => {
  const uploadManual = useMutation(api.uploading.uploadShop);
  const courses = useQuery(api.getting.getCourses) || [];
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: '',
      price: '',
      name: '',
      url: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Ensure that the deadline is selected before submitting
    if (!filterDate) {
      toast.error('Please select a deadline date');
      return;
    }

    try {
      const deadline = format(filterDate, 'dd/MM/yyyy');
      await uploadManual({
        ...values,
        price: Number(values.price),
        deadline,
      });

      form.reset();
      setFilterDate(null);
      toast.success('Manual uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload the manual. Please try again.');
    }
  };

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <div
          className="flex items-center cursor-pointer gap-2 text-blue-500 hover:text-blue-700"
          aria-label="Add Manual"
        >
          <PlusCircle />
          Add Manual
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Manual</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Course Field */}
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-label="Select Course"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course.course}>
                            {course.course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Price"
                      {...field}
                      aria-label="Price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Book Name"
                      {...field}
                      aria-label="Book Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* URL Field */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter Book URL"
                      {...field}
                      aria-label="Book URL"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Deadline Field (Using Dialog for date selection) */}
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <Button
                variant="outline"
                className="w-[280px] justify-start"
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  setIsDateDialogOpen(true); // Open the date picker dialog
                }}
              >
                {filterDate ? format(filterDate, 'PPP') : 'Filter by date'}
              </Button>
            </FormItem>

            {/* Date Dialog */}
            <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Date</DialogTitle>
                </DialogHeader>
                <Calendar
                  mode="single"
                  selected={filterDate || undefined} // Ensure correct selected value
                  onSelect={(date) => {
                    setFilterDate(date || null); // Ensure state updates correctly
                    setIsDateDialogOpen(false); // Close the date picker dialog
                  }}
                  className="border-none"
                />
              </DialogContent>
            </Dialog>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              aria-label="Submit Manual"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default UploadManual;
