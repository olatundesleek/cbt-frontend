"use client";

import { useState, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AppTable, { TableDataItem } from '@/components/table';
import Input from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { useServerPagination } from '@/hooks/useServerPagination';
import {
  useGetCourses,
  useGetQuestionBank,
} from '@/features/dashboard/queries/useDashboard';
import api, { errorLogger } from '@/lib/axios';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AllCourses, AllQuestionBank } from '@/types/dashboard.types';
import Modal from '@/components/modal';
import { GoPlus } from 'react-icons/go';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { formatDate } from '../../../../../utils/helpers';

type FormProps = Yup.InferType<typeof schema>;

interface UpdateQuestionBankProps {
  singleBank: AllQuestionBank | null;
  courses: AllCourses[];
  closeModal: () => void;
}

const schema = Yup.object({
  questionBankName: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  course: Yup.string().required('Course is required'),
});

const UpdateQuestionBank = ({
  singleBank,
  closeModal,
  courses,
}: UpdateQuestionBankProps) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      questionBankName: '',
      course: '',
      description: '',
    },
  });

  const handleUpdateQuestionBank: SubmitHandler<FormProps> = async (data) => {
    const { questionBankName, description } = data;

    const payload = {
      questionBankName,
      description,
      courseId: Number(data.course),
    };

    try {
      const response = await api.patch(
        `/question-banks/${singleBank?.id}`,
        payload,
      );
      await queryClient.invalidateQueries({ queryKey: ['questionBanks'] });
      resetForm();
      closeModal();
      toast.success(response.data.message || 'Updated Successfully');
    } catch (error) {
      errorLogger(error);
    }
  };

  useEffect(() => {
    if (!singleBank) return;

    setValue('course', `${singleBank.courseId}`);
    setValue('description', singleBank.description);
    setValue('questionBankName', singleBank.questionBankName);
  }, [singleBank, setValue]);

  if (!singleBank) return null;

  return (
    <div className='flex flex-col gap-1 w-full'>
      <span className='text-base font-bold'>Update Question Bank</span>

      <form
        onSubmit={handleSubmit(handleUpdateQuestionBank)}
        className='flex flex-col items-stretch gap-2 w-full'
      >
        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='course'>
            <span className='text-sm text-neutral-600'>Select Course</span>

            <select
              id='course'
              {...register('course')}
              className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
            >
              <option value={''} disabled>
                Select Course
              </option>
              {courses?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course?.title}
                </option>
              ))}
            </select>
          </label>

          {errors?.course?.message && (
            <small className='text-error-500'>{errors?.course?.message}</small>
          )}
        </div>

        <Input
          label='Question Bank Name'
          name='questionBankName'
          placeholder='Math 403 Questions'
          hookFormRegister={register}
          errorText={errors.questionBankName && errors.questionBankName.message}
        />

        <div className='flex flex-col gap-1 w-full'>
          <label htmlFor='description' className='text-sm text-neutral-600'>
            Question Description
          </label>
          <textarea
            id='description'
            placeholder='Basic Mathematics For SS2 students'
            {...register('description')}
            className='rounded-md border border-neutral-300 p-1 bg-background text-foreground caret-foreground shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
          ></textarea>
          {errors?.description?.message && (
            <small className='text-error-500'>
              {errors?.description?.message}
            </small>
          )}
        </div>

        <div className='w-fit'>
          <Button type='submit' disabled={isSubmitting}>
            <div className='flex flex-row items-center gap-2 w-full'>
              <GoPlus />
              <span>
                {isSubmitting ? 'Updating...' : 'Update Question Bank'}
              </span>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

const QuestionBank = () => {
  const userRole = useUserStore((s) => s.role);
  // Add server pagination hook
  const { params, goToPage, updateParams, setLimit } = useServerPagination({
    defaultPage: 1,
    defaultLimit: 10,
  });

  const [searchValue, setSearchValue] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: AllQuestionBank | null;
    type: 'update' | 'delete';
  }>({
    isOpen: false,
    modalContent: null,
    type: 'update',
  });
  const { push } = useRouter();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset: resetForm,
  } = useForm<FormProps>({
    defaultValues: { questionBankName: '', course: '', description: '' },
    resolver: yupResolver(schema),
  });

  //get all courses
  const {
    data: allCourses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetCourses();

  // get all question banks
  const {
    data: allQuestionBank,
    isLoading: questionBankLoading,
    error: questionBankError,
  } = useGetQuestionBank(params);

  // Client-side search filtering
  const filteredQuestionBanks =
    allQuestionBank?.data.data?.filter((bank) =>
      searchValue
        ? bank.questionBankName
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        : true,
    ) ?? [];

  const tableColumns = useMemo(
    () =>
      userRole === 'admin'
        ? [
            'S/N',
            'Question Name',
            'Course',
            'Total Questions',
            'Created By',
            'Created on',
          ]
        : ['S/N', 'Question Name', 'Course', 'Total Questions', 'Created on'],
    [userRole],
  );

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | AllQuestionBank | ('update' | 'delete') | null;
  }) => {
    setModalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // create question bank
  const handleCreateQuestionBank: SubmitHandler<FormProps> = async (data) => {
    const { questionBankName, description } = data;

    const payload = {
      questionBankName,
      description,
      courseId: Number(data.course),
    };

    try {
      const res = await api.post('/question-banks', payload);
      toast.success(res.data.message || 'Success');
      await queryClient.invalidateQueries({ queryKey: ['questionBanks'] });
      resetForm();
    } catch (error) {
      errorLogger(error);
    }
  };

  // delete question bank
  const handleDeleteQuestionBank = async () => {
    setIsDeleting(true);

    try {
      const res = await api.delete(
        `/question-banks/${modalState?.modalContent?.id}`,
      );
      await queryClient.invalidateQueries({ queryKey: ['questionBanks'] }); // invalidate and refetch classes
      toast.success(res.data.message || 'Deleted Successfully');
      updateModalState({ key: 'isOpen', value: false });
    } catch (error) {
      errorLogger(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (coursesError || questionBankError) {
    errorLogger(coursesError || questionBankError);
  }

  return (
    <section className='flex flex-col gap-4 w-full'>
      <h1 className='text-2xl font-semibold'>Question Bank</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 w-full gap-4'>
        <div className='col-span-1 flex flex-col gap-1 bg-background rounded-xl w-full p-3 h-fit'>
          <span className='font-medium'>Create Question Bank</span>

          <form
            onSubmit={handleSubmit(handleCreateQuestionBank)}
            className='flex flex-col gap-3 w-full'
          >
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor='course'>
                <span className='text-sm text-neutral-600'>Select Course</span>

                <select
                  id='course'
                  {...register('course')}
                  disabled={coursesLoading}
                  className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
                >
                  <option value={''} disabled>
                    Select Course
                  </option>
                  {allCourses?.data?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course?.title}
                    </option>
                  ))}
                </select>
              </label>

              {errors?.course?.message && (
                <small className='text-error-500'>
                  {errors?.course?.message}
                </small>
              )}
            </div>

            <Input
              label='Question Bank Name'
              name='questionBankName'
              placeholder='Math 403 Questions'
              hookFormRegister={register}
              errorText={
                errors.questionBankName && errors.questionBankName.message
              }
            />

            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor='description' className='text-sm text-neutral-600'>
                Question Description
              </label>
              <textarea
                id='description'
                placeholder='Basic Mathematics For SS2 students'
                {...register('description')}
                className='rounded-md border border-neutral-300 p-1 bg-background text-foreground caret-foreground shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'
              ></textarea>
              {errors?.description?.message && (
                <small className='text-error-500'>
                  {errors?.description?.message}
                </small>
              )}
            </div>

            <div className='w-fit'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Question Bank'}
              </Button>
            </div>
          </form>
        </div>

        <div className='col-span-2 flex flex-col gap-3 bg-background rounded-xl w-full p-3'>
          <span className='font-medium'>All Question Banks</span>

          {/* Search and Filter Section */}
          <div className='flex items-center gap-3 w-full flex-wrap'>
            <Input
              name='search'
              placeholder='Search question banks by name...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <select
              value={params.sort || ''}
              onChange={(e) =>
                updateParams({ sort: e.target.value || undefined })
              }
              className='rounded-md border border-neutral-300 px-3 py-2 bg-background text-foreground'
              aria-label='Sort by field'
            >
              <option value=''>Sort By</option>
              <option value='questionBankName'>Name</option>
              <option value='createdAt'>Date Created</option>
            </select>
            <select
              value={params.order || 'asc'}
              onChange={(e) =>
                updateParams({ order: e.target.value as 'asc' | 'desc' })
              }
              className='rounded-md border border-neutral-300 px-3 py-2 bg-background text-foreground'
              aria-label='Sort order'
            >
              <option value=''>Order</option>
              <option value='asc'>Ascending</option>
              <option value='desc'>Descending</option>
            </select>
            <select
              value={params.limit || 10}
              onChange={(e) => setLimit(Number(e.target.value))}
              className='rounded-md border border-neutral-300 px-3 py-2 bg-background text-foreground'
              aria-label='Items per page'
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <AppTable
            data={filteredQuestionBanks}
            label='All Question Banks'
            isLoading={questionBankLoading}
            onRowPress={({ item }) => push(`/admin/questions/${item.id}`)}
            headerColumns={tableColumns}
            itemKey={({ item }) => `${item.id}`}
            paginationMode='server'
            paginationMeta={{
              currentPage: allQuestionBank?.data?.pagination?.page || 1,
              totalPages: allQuestionBank?.data?.pagination?.pages || 1,
              totalItems: allQuestionBank?.data?.pagination?.total || 0,
              itemsPerPage: allQuestionBank?.data?.pagination?.limit || 10,
            }}
            onPageChange={goToPage}
            onActionClick={({ item }) =>
              updateModalState({ key: 'modalContent', value: item })
            }
            renderItem={({ item, itemIndex }) => (
              <>
                <TableDataItem>
                  <span className='font-light text-sm text-neutral-600'>
                    {((params?.page ?? 1) - 1) *
                      (allQuestionBank?.data?.pagination?.limit || 10) +
                      itemIndex +
                      1}
                    .
                  </span>
                </TableDataItem>
                <TableDataItem>{item.questionBankName}</TableDataItem>
                <TableDataItem>{item?.course?.title ?? 'N/A'}</TableDataItem>
                <TableDataItem>{(item.questions ?? []).length}</TableDataItem>
                {userRole === 'admin' && (
                  <TableDataItem>
                    {item?.teacher?.firstname && item?.teacher?.lastname
                      ? item.teacher.firstname + ' ' + item.teacher.lastname
                      : 'N/A'}
                  </TableDataItem>
                )}
                <TableDataItem>
                  {formatDate(item.createdAt.toString())}
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
                  Update Bank
                </button>
                <button
                  onClick={() => {
                    updateModalState({ key: 'type', value: 'delete' });
                    updateModalState({ key: 'isOpen', value: true });
                  }}
                  className='px-2 py-1 rounded bg-error-500 text-white text-xs cursor-pointer'
                >
                  Delete Bank
                </button>
              </div>
            }
          />
        </div>
      </div>

      {/* modal to delete and update a question bank */}
      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(value) =>
          updateModalState({ key: 'isOpen', value: value as boolean })
        }
      >
        {modalState.type === 'update' ? (
          <UpdateQuestionBank
            singleBank={modalState.modalContent}
            courses={allCourses?.data ?? []}
            closeModal={() => updateModalState({ key: 'isOpen', value: false })}
          />
        ) : (
          <div className='w-full h-full flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 w-full'>
              <span className='text-lg text-error-700 font-medium'>
                Delete Question Bank
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
                  onClick={handleDeleteQuestionBank}
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

export default QuestionBank;
