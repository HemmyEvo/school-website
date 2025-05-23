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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { PlusCircle, Loader2, FileText, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  course: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  venue: z.string().optional(),
  attachment: z.any().optional(),
});

const UploadAnnouncementAction = () => {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const courses = useQuery(api.getting.getCourses) || [];
  const createAnnouncement = useMutation(api.uploading.uploadAnnouncement);
  const generateUploadUrl = useMutation(api.uploading.generateUploadUrl);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      course: '',
      title: '',
      venue: '',
      attachment: null
    },
  });

  React.useEffect(() => {
    if (!isFileDialogOpen) {
      form.reset();
    }
  }, [isFileDialogOpen, form]);

  const onSubmit = async (values: any) => {
    if (!form.formState.isValid) return;
    
    let storageId;
    const file = values.attachment?.[0];
    
    try {
      if (file) {
        const postUrl = await generateUploadUrl();
        const res = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        
        if (!res.ok) throw new Error('File upload failed');
        const { storageId: id } = await res.json();
        storageId = id;
      }

      await createAnnouncement({
        description: values.description,
        course: values.course,
        venue: values.venue,
        title: values.title,
        attachment: storageId
      });
      
      toast.success('Announcement published successfully!');
      setIsFileDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload announcement');
    }
  };

  const announcementTypes = [
    { value: 'Class Update', label: 'Class Update', icon: <FileText className="w-4 h-4" /> },
    { value: 'Manual Update', label: 'Manual Update', icon: <UploadCloud className="w-4 h-4" /> },
    { value: 'School Announcement', label: 'School Announcement', icon: <FileText className="w-4 h-4" /> },
    { value: 'Special Announcement', label: 'Special Announcement', icon: <FileText className="w-4 h-4" /> },
    { value: 'App Management', label: 'App Management', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
          <PlusCircle className="w-4 h-4" />
          New Announcement
        </Button>
      </DialogTrigger>
      
      <DialogContent className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/40 max-w-2xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
        <div className="p-1"> {/* Added padding container */}
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Announcement</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Share important updates with your class
            </DialogDescription>
          </DialogHeader>
          
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 pb-2">
              {/* Announcement Type */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Announcement Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50">
                        <SelectValue placeholder="Select announcement type" />
                      </SelectTrigger>
                      <SelectContent className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/40">
                        {announcementTypes.map((type) => (
                          <SelectItem 
                            key={type.value} 
                            value={type.value}
                            className="hover:bg-white/20 dark:hover:bg-gray-700/50"
                          >
                            <div className="flex items-center gap-2">
                              {type.icon}
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description (Textarea) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter announcement details..."
                        className="min-h-[120px] bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Fields */}
              {(form.watch('title') === 'Manual Update' || form.watch('title') === 'Class Update') && (
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Course</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/40">
                          {courses.map((course) => (
                            <SelectItem 
                              key={course._id} 
                              value={course.course}
                              className="hover:bg-white/20 dark:hover:bg-gray-700/50"
                            >
                              {course.course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('title') === 'Class Update' && (
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue/Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter venue details"
                          className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('title') === 'Manual Update' && (
                <FormField
                  control={form.control}
                  name="attachment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attachment</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer w-full">
                            <div className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-white/30 dark:border-gray-600/50 rounded-lg bg-white/20 dark:bg-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/40 transition-colors">
                              <UploadCloud className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm font-medium text-center">
                                {field.value?.[0]?.name || 'Click to upload file'}
                              </span>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => field.onChange(e.target.files)}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-3 pt-4 pb-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsFileDialogOpen(false)}
                  className="border-white/30 dark:border-gray-600/50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : null}
                  Publish Announcement
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadAnnouncementAction;