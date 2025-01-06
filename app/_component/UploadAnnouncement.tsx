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
  import { useForm, FormProvider } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';
  import toast from 'react-hot-toast';
  import { api } from '@/convex/_generated/api';
  import { useMutation, useQuery } from 'convex/react';
  import { PlusCircle, Loader2 } from 'lucide-react';

  const formSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    course: z.string().optional(),
    title: z.string().optional(),
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
        title: 'Class Update',
        venue: '',
        attachment: ''
      },
    });
    React.useEffect(() => {
    !isFileDialogOpen &&  form.reset();
    }, [isFileDialogOpen])
    

    const onSubmit = async (values: any) => {
      
      if (!form.formState.isValid) return;
    const file = values.attachment;
    
     let storage
      if(file){
        const postUrl = await generateUploadUrl();
        const res = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': file[0].type},
          body: file,
        });
        if (!res.ok) throw new Error('File upload failed');
  
        const {storageId} = await res.json();
        storage = storageId
      }
      console.log(storage)
    
      try {
        await createAnnouncement({
          description: values.description,
          course: values.course,
          venue: values.venue,
          title: values.title,
          attachment: storage
        });
        toast.success('Announcement uploaded successfully!');
        form.reset();
        setIsFileDialogOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to upload. Please try again.');
      }
    };

    const Titles = ['App Management', 'Manual Update', 'Class Update', 'School Announcement', 'Special Announcement'];

    return (
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
            <PlusCircle />
            Add Announcement
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Announcement</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Selection */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Title" />
                        </SelectTrigger>
                        <SelectContent>
                          {Titles.map((title, i) => (
                            <SelectItem key={i} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Fields based on Selection */}
              {(() => {
                switch (form.watch('title')) {
                  case 'App Management':
                    return (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>App Details</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter app details" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  case 'Manual Update':
                    return (
                      <>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Update Details</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter manual update details" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Course Selection */}
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
                        <FormField
                          control={form.control}
                          name="attachment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Attachment</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  onChange={(e) => field.onChange(e.target.files)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    );
                  case 'Class Update':
                    return (
                      <>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Class Details</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter class details" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="venue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter the venue" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Course Selection */}
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
                      </>
                    );
                  case 'School Announcement':
                    return (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Announcement Details</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter announcement details" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  case 'Special Announcement':
                    return (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Details</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter special details" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  default:
                    return null;
                }
              })()}

              <Button type='submit' disabled={form.formState.isSubmitting}>
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

  export default UploadAnnouncementAction;
