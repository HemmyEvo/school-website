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
import { useMutation } from 'convex/react';
import { PlusCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  unit: z
    .number({
      invalid_type_error: 'Unit must be a valid number',
    })
    .positive('Unit must be a positive number'),
  course: z
    .string()
    .min(1, 'Course is required')
    .max(20, 'Course must not exceed 20 characters'),
});

const UploadCourse = () => {
  const createFile = useMutation(api.uploading.uploadCourse);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unit: 0,
      course: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createFile({
        course: values.course,
        unit: values.unit,
      });

      form.reset();
      setIsFileDialogOpen(false);
      toast.success('Course uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload the course. Please try again later.');
    }
  }

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <div
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
          aria-label="Add Course"
        >
          <PlusCircle />
          Add Course
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Your Course</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Course Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Unit"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} // Coerce input value to a number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              aria-label="Submit Course"
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

export default UploadCourse;
