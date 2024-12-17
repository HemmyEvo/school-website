import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { PlusCircle, Loader2, Plus, Trash } from 'lucide-react';
const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(20, 'Title is too long'),
  course: z.string().min(1, 'Course is required'),
  file: z.instanceof(FileList).optional(),
});

const UploadNoteAction = () => {
  const createNote = useMutation(api.uploading.uploadNote);
  const generateUploadUrl = useMutation(api.uploading.generateUploadUrl);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const courses = useQuery(api.getting.getCourses) || [];
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', course: '' },
  });

  const [images, setImages] = useState<File[]>([]);

  const handleFileUpload = (file: File) => {
    setImages((prev) => [...prev, file]);
  };

  const onSubmit = async (values: any) => {
    try {
      if (images.length === 0) {
        throw new Error('Please upload at least one image.');
      }

      const uploadUrls = await Promise.all(
        images.map(async (image) => {
          const postUrl = await generateUploadUrl();
          const res = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': image.type },
            body: image,
          });
          if (!res.ok) throw new Error('File upload failed');
          const { storageId } = await res.json();
          return storageId;
        })
      );

      await createNote({
        file: uploadUrls,
        title: values.title,
        course: values.course,
      });
      toast.success('Note uploaded successfully!');
      form.reset();
      setImages([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload. Please try again.');
    }
  };

  return (
       <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
              <PlusCircle />
              Add Note
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Note</DialogTitle>
              <DialogDescription>Fill in the details below.</DialogDescription>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    
                
    
                {/* Course Selection with ShadCN */}
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map(course => <SelectItem key={course._id} value={course.course}>{course.course}</SelectItem>)}
                         
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    
                  <div>
                    <FormLabel>Images</FormLabel>
                    {images.map((img, index) => (
                      <p key={index}>{img.name}</p>
                    ))}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                      }}
                    />
                  </div>
           
    
                <Button type="submit" disabled={form.formState.isSubmitting}>
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

export default UploadNoteAction;
