"use client";

import { useState, useEffect } from "react";
import {
  useGetCourses,
  useGetTeachers,
} from "@/features/dashboard/queries/useDashboard";
import AppTable, { TableDataItem } from "@/components/table";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api, { errorLogger } from "@/lib/axios";
import { queryClient } from "@/providers/query-provider";
import toast from "react-hot-toast";
import { AllCourses, AllTeachersResponse } from "@/types/dashboard.types";
import Modal from "@/components/modal";

type FormProps = Yup.InferType<typeof schema>;

interface UpdateCourseProps {
  course: AllCourses | null;
  allTeachers: AllTeachersResponse['data'];
  closeModal: () => void;
}

const schema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  teacher: Yup.string().required('Course Teacher is required'),
});

const UpdateCourse = ({
  course,
  allTeachers,
  closeModal,
}: UpdateCourseProps) => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    reset: resetForm,
  } = useForm<FormProps>({
    defaultValues: { title: '', teacher: '', description: '' },
    resolver: yupResolver(schema),
  });

  const handleUpdateCourse: SubmitHandler<FormProps> = async (data) => {
    const { title, description } = data;

    const payload = {
      title,
      description,
      teacherId: Number(data.teacher),
    };

    try {
      const res = await api.patch(`/courses/${course?.id}`, payload);
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success(res.data.message || 'Success');
      resetForm();
      closeModal();
    } catch (error) {
      errorLogger(error);
    }
  };

  useEffect(() => {
    if (!course) return;

    setValue('title', course.title);
    setValue('description', course.description);
    setValue('teacher', `${course.teacherId}`);
  }, [course, setValue]);

  if (!course) return null;

  return (
    <div className=' flex flex-col gap-1 bg-background rounded-xl w-full p-3'>
      <span className='font-medium'>Update Course</span>

      <form
        onSubmit={handleSubmit(handleUpdateCourse)}
        className='flex flex-col gap-3 w-full'
      >
        <Input
          label='Course Title'
          name='title'
          placeholder='MAT 101'
          hookFormRegister={register}
          errorText={errors.title && errors.title.message}
        />

        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='description' className='text-sm text-neutral-600'>
            Course Description
          </label>
          <textarea
            id='description'
            placeholder='Basic Mathematics'
            {...register('description')}
            className='rounded-md border border-neutral-300 p-1 bg-background text-foreground caret-foreground shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
          ></textarea>
          {errors?.description?.message && (
            <small className='text-error-500'>
              {errors?.description?.message}
            </small>
          )}
        </div>

        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='teacher'>
            <span className='text-sm text-neutral-600'>Select Teacher</span>

            <select
              id='teacher'
              {...register('teacher')}
              disabled={!allTeachers.length}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              <option value={''} disabled>
                Select Teacher
              </option>
              {allTeachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstname + ' ' + teacher.lastname}
                </option>
              ))}
            </select>
          </label>

          {errors?.teacher?.message && (
            <small className='text-error-500'>{errors?.teacher?.message}</small>
          )}
        </div>

        <div className='w-fit'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Teacher'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Courses = () => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: AllCourses | null;
    type: 'update' | 'delete';
  }>({
    isOpen: false,
    modalContent: null,
    type: 'update',
  });

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset: resetForm,
  } = useForm<FormProps>({
    defaultValues: { title: '', teacher: '', description: '' },
    resolver: yupResolver(schema),
  });

  // get all teachers
  const {
    data: allTeachers,
    isLoading: teachersLoading,
    error: teachersError,
  } = useGetTeachers();

  //get all courses
  const {
    data: allCourses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetCourses();

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | AllCourses | ('update' | 'delete') | null;
  }) => {
    setModalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //delete course fn
  const handleDeleteCourse = async () => {
    setIsDeleting(true);

    try {
      const res = await api.delete(`courses/${modalState?.modalContent?.id}`);
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success(res.data.message || 'Deleted Successfully');
      updateModalState({ key: 'isOpen', value: false });
    } catch (error) {
      errorLogger(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // create course fn
  const handleCreateCourse: SubmitHandler<FormProps> = async (data) => {
    const { title, description } = data;

    const payload = {
      title,
      description,
      teacherId: Number(data.teacher),
    };

    try {
      const res = await api.post('/courses', payload);
      toast.success(res.data.message || 'Success');
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      resetForm();
    } catch (error) {
      errorLogger(error);
    }
  };

  if (teachersError || coursesError) {
    errorLogger(teachersError || coursesError);
  }

  return (
    <section className='flex flex-col gap-4 w-full'>
      <h1 className='text-2xl font-semibold'>Create Courses</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-4'>
        <div className='col-span-1 flex flex-col gap-1 bg-background rounded-xl w-full p-3'>
          <span className='font-medium'>Create Course</span>

          <form
            onSubmit={handleSubmit(handleCreateCourse)}
            className='flex flex-col gap-3 w-full'
          >
            <Input
              label='Course Title'
              name='title'
              placeholder='MAT 101'
              hookFormRegister={register}
              errorText={errors.title && errors.title.message}
            />

            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor='description' className='text-sm text-neutral-600'>
                Course Description
              </label>
              <textarea
                id='description'
                placeholder='Basic Mathematics'
                {...register('description')}
                className='rounded-md border border-neutral-300 p-1 bg-background text-foreground caret-foreground shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
              ></textarea>
              {errors?.description?.message && (
                <small className='text-error-500'>
                  {errors?.description?.message}
                </small>
              )}
            </div>

            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor='teacher'>
                <span className='text-sm text-neutral-600'>Select Teacher</span>

                <select
                  id='teacher'
                  {...register('teacher')}
                  disabled={teachersLoading || !allTeachers}
                  className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
                >
                  <option value={''} disabled>
                    Select Teacher
                  </option>
                  {allTeachers?.data?.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstname + ' ' + teacher.lastname}
                    </option>
                  ))}
                </select>
              </label>

              {errors?.teacher?.message && (
                <small className='text-error-500'>
                  {errors?.teacher?.message}
                </small>
              )}
            </div>

            <div className='w-fit'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </form>
        </div>

        <div className='col-span-1 flex flex-col gap-3 bg-background rounded-xl w-full p-3'>
          <AppTable
            data={allCourses?.data ?? []}
            centralizeLabel
            isLoading={coursesLoading}
            label='All Courses'
            headerColumns={['s/n', 'Course Title', 'Teacher']}
            itemKey={({ item }) => `${item.id}`}
            onActionClick={({ item }) =>
              updateModalState({ key: 'modalContent', value: item })
            }
            renderItem={({ item, itemIndex }) => (
              <>
                <TableDataItem>{itemIndex + 1}</TableDataItem>
                <TableDataItem>{item.title}</TableDataItem>
                <TableDataItem>
                  {item.teacher.firstname + ' ' + item.teacher.lastname}
                </TableDataItem>
              </>
            )}
            actionModalContent={
              <div className='flex flex-col gap-2 w-full'>
                <button
                  onClick={() => {
                    updateModalState({ key: 'type', value: 'update' });
                    updateModalState({ key: 'isOpen', value: true });
                  }}
                  className='px-2 py-1 rounded bg-primary-500 text-white text-xs cursor-pointer'
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    updateModalState({ key: 'type', value: 'delete' });
                    updateModalState({ key: 'isOpen', value: true });
                  }}
                  className='px-2 py-1 rounded bg-error-500 text-white text-xs cursor-pointer'
                >
                  Delete
                </button>
              </div>
            }
          />
        </div>
      </div>

      {/* modal to delete and update */}
      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={() => updateModalState({ key: 'isOpen', value: false })}
      >
        {modalState.type === 'update' ? (
          <UpdateCourse
            course={modalState.modalContent}
            allTeachers={allTeachers?.data ?? []}
            closeModal={() => updateModalState({ key: 'isOpen', value: false })}
          />
        ) : (
          <div className='w-full h-full flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 w-full'>
              <span className='text-lg text-error-700 font-medium'>
                Delete Course
              </span>
              <span className='text-sm font-normal'>
                This action is irreversible
              </span>
            </div>

            <div className='flex flex-row items-center justify-center w-full'>
              <div className='flex flex-row items-center gap-2 w-full max-w-[50%] mx-auto'>
                <Button
                  variant='danger'
                  disabled={isDeleting}
                  onClick={handleDeleteCourse}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>

                <Button
                  disabled={isDeleting}
                  onClick={() =>
                    updateModalState({ key: 'isOpen', value: false })
                  }
                >
                  No, Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Courses;
