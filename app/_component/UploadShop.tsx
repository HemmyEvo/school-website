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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from "lucide-react"

const formSchema = z.object({
  course: z.string().nonempty('Course code is required'),
  price: z.string().nonempty('Price is required'),
  deadline: z.date().nullable().optional(),
  name: z.string().nonempty('Name is required'),
  url: z.string().url('Invalid URL').nonempty('URL is required'),
});

const UploadManual = () => {
  const uploadManual = useMutation(api.uploading.uploadShop);
  const courses = useQuery(api.getting.getCourses) || [];
  const [date, setDate] = React.useState<Date>()
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      course: '',
      price: '',
      name: '',
      url: '',
      deadline: null,
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const deadline = date ? format(date, 'yyyy-MM-dd') : '';
      await uploadManual({
        ...values,
        price: Number(values.price),
        deadline,
      });

      form.reset();
      setDate(undefined);
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
            {/* Deadline Field */}
            <FormField
              control={form.control}
              name="deadline"
              render={() => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormMessage />
              <Popover>
              <PopoverTrigger asChild>
              <Button
              variant={"outline"}
              className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
              )}
              >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
              <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              />
              </PopoverContent>
              </Popover>
                </FormItem>
              )}
            />
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
