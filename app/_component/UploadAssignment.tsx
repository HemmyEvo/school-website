import React, { useEffect, useState } from 'react';
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
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { PlusCircle, Loader2, Plus, Trash, FileText, BookOpen } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(20, 'Title is too long'),
  course: z.string().min(1, 'Course is required'),
  questions: z.array(
    z.object({ 
      question: z.string()
        .min(1, 'Question is required')
        .min(10, 'Question should be at least 10 characters')
    })
  ).min(1, 'At least one question is required'),
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

  const { fields, append, remove } = useFieldArray({ 
    control: form.control, 
    name: 'questions' 
  });

  useEffect(() => {
    if (!isFileDialogOpen) {
      form.reset();
    }
  }, [isFileDialogOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const questions = values.questions.map(q => q.question);
      
      await createAssignment({
        courseCode: values.course,
        question: questions,
      });
      
      toast.success('Assignment created successfully!');
      setIsFileDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create assignment');
    }
  };

  const handleAddQuestion = () => {
    const lastQuestion = form.getValues().questions[fields.length - 1]?.question;
    
    if (lastQuestion?.trim()) {
      append({ question: '' });
    } else {
      toast.error('Please complete the current question before adding another');
    }
  };

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
          <PlusCircle className="w-4 h-4" />
          New Assignment
        </Button>
      </DialogTrigger>
      
      <DialogContent className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/40 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className=" z-10 pt-2">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Create New Assignment
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Add questions and details for your class assignment
          </DialogDescription>
        </DialogHeader>
        
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 pb-2">
            {/* Assignment Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Midterm Exam, Homework #2"
                      className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50"
                      {...field} 
                    />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/40">
                      {courses.map(course => (
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

            {/* Questions Section */}
            <div>
              <FormLabel className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Questions
              </FormLabel>
              
              <div className="mt-2 space-y-4 max-h-[300px] overflow-y-auto p-1">
                {fields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className="p-4 rounded-lg bg-white/30 dark:bg-gray-700/30 border border-white/40 dark:border-gray-600/40"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-medium mt-2 text-gray-700 dark:text-gray-300">
                        {index + 1}.
                      </span>
                      <FormField
                        control={form.control}
                        name={`questions.${index}.question`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                placeholder={`Enter question #${index + 1}`}
                                className="min-h-[80px] bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:bg-red-500/10 mt-2"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                type="button"
                onClick={handleAddQuestion}
                variant="outline"
                className="mt-3 border-white/30 dark:border-gray-600/50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4  pb-4">
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
                Create Assignment
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default UploadAssignmentAction;