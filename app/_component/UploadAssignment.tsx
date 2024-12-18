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
    questions: z.array(z.object({ question: z.string().min(1, 'Question is required') })).optional(),
  });

const UploadAssignmentAction = () => {
  const createAssignment = useMutation(api.uploading.uploadAssignment);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const courses = useQuery(api.getting.getCourses) || [];
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      course: '',
      questions: [{ question: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'questions' });

  const onSubmit = async (values: any) => {
    try {
      const questions = values.questions?.map((q: any) => q.question);
      if (!questions || questions.length === 0) {
        throw new Error('Please add at least one question.');
      }

      await createAssignment({
        courseCode: values.course,
        question: questions,
      });
      toast.success('Assignment uploaded successfully!');
      form.reset();
      setIsFileDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload. Please try again.');
    }
  };
  return (
       <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
          <DialogTrigger >
            <div className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
              <PlusCircle />
              Add Assignment
            </div>
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
  <FormLabel>Questions</FormLabel>
  <div className="max-h-40 overflow-y-auto space-y-4">
    {fields.map((field, index) => (
      <div key={field.id} className="flex items-center gap-2">
        <Input
          placeholder={`Question ${index + 1}`}
          {...form.register(`questions.${index}.question`)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="destructive"
          onClick={() => remove(index)}
          className="ml-2"
        >
          <Trash />
        </Button>
      </div>
    ))}
  </div>
  <Button type="button" onClick={() => {
       const lastQuestion = form.getValues().questions[fields.length - 1]?.question;

       // Check if the last question is not empty before appending a new one
       if (lastQuestion && lastQuestion.trim() !== '') {
           append({ question: '' });
       } else if (lastQuestion === undefined || lastQuestion.trim() === '') {
           toast.error('Please fill in the current question before adding a new one.');
       }
       
  }} className="mt-2">
    <Plus /> Add Question
  </Button>
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

export default UploadAssignmentAction;
