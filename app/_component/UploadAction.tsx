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

type Props = {
  active: 'announcement' | 'note' | 'assignment';
};

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(20, 'Title is too long'),
  description: z.string().min(1, 'Title is required'),
  course: z.string().min(1, 'Course is required'),
  file: z.instanceof(FileList).optional(),
  questions: z
  .array(z.object({ question: z.string().min(1, 'Question is required') }))
  .optional(),
});

const UploadAction = ({ active }: Props) => {
  const courses = useQuery(api.getting.getCourses) || [];
  const createAnnouncement = useMutation(api.uploading.uploadAnnouncement);
  const createNote = useMutation(api.uploading.uploadNote);
  const createAssignment = useMutation(api.uploading.uploadAssignment);
  const generateUploadUrl = useMutation(api.uploading.generateUploadUrl);

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      course: '',
      questions: [{ question: '' }],
    },
  });


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const handleFileUpload = (file: File) => {
    setImages((prev) => [...prev, file]);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (active === 'note') {
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
      } else if (active === 'announcement') {
        await createAnnouncement({
          title: values.title,
          description: values.description || '',
          course: values.course,
        });
      } else if (active === 'assignment') {
        const questions = values.questions?.map((q) => q.question);
        if (!questions || questions.length === 0) {
          throw new Error('Please add at least one question.');
        }
  
        await createAssignment({
          courseCode: values.course,
          question: questions,
        });
      }
  
      toast.success('Upload successful!');
      form.reset();
      setImages([]);
      setIsFileDialogOpen(false);
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload. Please try again.'
      );
    }
  };
  
  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
          <PlusCircle />
          Add {active}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload {active}</DialogTitle>
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

            {/* Description (Announcement) */}
            {active === 'announcement' && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            {/* File Upload for Notes */}
            {active === 'note' && (
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
            )}

            {/* Questions for Assignment */}
            {active === 'assignment' && (
              <div>
                <FormLabel>Questions</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      placeholder={`Question ${index + 1}`}
                      {...form.register(`questions.${index}.question`)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => append({ question: '' })} className="mt-2">
                  <Plus /> Add Question
                </Button>
              </div>
            )}

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

export default UploadAction;
