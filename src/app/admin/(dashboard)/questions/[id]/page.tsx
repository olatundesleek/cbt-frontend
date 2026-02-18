"use client";

import Modal from "@/components/modal";
import AppTable, { TableDataItem } from "@/components/table";
import { Button, SpinnerMini } from "@/components/ui";
import {
  useGetQuestionBankDetails,
  useGetQuestionsInBank,
} from '@/features/dashboard/queries/useDashboard';
import { queryClient } from '@/providers/query-provider';
import { QuestionsInBank } from '@/types/dashboard.types';
import { useParams } from 'next/navigation';
import { ChangeEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateQuestion from './create-question';
import { useMutation } from '@tanstack/react-query';
import { dashboardServices } from '@/services/dashboardService';
import { MdDeleteOutline } from 'react-icons/md';
import { LuImage, LuFileText, LuX } from 'react-icons/lu';
import Image from 'next/image';
import ResourceUploadSection, {
  Resource,
} from '@/components/resources/ResourceUploadSection';
import getErrorDetails from '@/utils/getErrorDetails';
import MathHtmlRenderer from '@/components/mathHtmlRenderer';

const Questions = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bankResources, setBankResources] = useState<Resource[]>([]);
  const [resourcePreview, setResourcePreview] = useState<{
    type: 'diagram' | 'comprehension';
    data: string;
  } | null>(null);
  const itemsPerPage = 10;
  const { id: questionBankId } = useParams();
  const { back: goBack } = useRouter();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: QuestionsInBank | null;
    type: 'create' | 'update' | 'delete';
  }>({
    isOpen: false,
    modalContent: null,
    type: 'create',
  });
  const {
    data: questions,
    isLoading,
    error,
  } = useGetQuestionsInBank(`${questionBankId}`);

  const { data: questionBankDetails } = useGetQuestionBankDetails(
    `${questionBankId}`,
  );
  const questionBankTitle =
    questionBankDetails?.data.questionBankName ?? 'Question Bank';

  //update modal state
  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: boolean | QuestionsInBank | ('create' | 'update' | 'delete') | null;
  }) => {
    setModalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // delete question
  const { mutate: deleteFn, isPending: isDeleting } = useMutation({
    mutationFn: dashboardServices.deleteQuestion,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['questionBanks'] });
      toast.success(data?.message || 'Question Deleted Successfully');
      updateModalState({ key: 'isOpen', value: false });
    },
    onError: (error) => {
      toast.error(getErrorDetails(error));
    },
  });

  // select items
  const handleSelectQuestion = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    // Reset input value so the same file can be selected again
    e.target.value = '';
  };;

  // download questions template
  const handleImportQuestions = async () => {
    if (!selectedFile) {
      return inputRef.current?.click();
    }

    setIsPending(true);

    const formData = new FormData();
    formData.append('bankId', `${questionBankId}`);
    formData.append('questions', selectedFile);

    try {
      const res = await dashboardServices.uploadQuestions(formData);
      await queryClient.invalidateQueries({ queryKey: ['questionBanks'] });
      toast.success(res.message);
      setSelectedFile(null);
    } catch (error) {
      toast.error(getErrorDetails(error));
    } finally {
      setIsPending(false);
    }
  };

  const totalMarks =
    questions?.reduce((sum, question) => sum + question.marks, 0) ?? 0;

  if (error) {
    toast.error(getErrorDetails(error));
  }

  return (
    <section className='flex flex-col gap-4 w-full'>
      <div className='flex flex-col gap-4 w-full'>
        <button
          className='self-start cursor-pointer'
          title='Go back'
          onClick={goBack}
        >
          <IoMdArrowRoundBack size={20} />
        </button>

        <div className='flex flex-row items-center justify-between w-full'>
          <h1 className='text-2xl font-semibold'>
            {questionBankTitle} Questions
          </h1>

          <div className='w-fit'>
            <Button
              onClick={() => {
                updateModalState({ key: 'isOpen', value: true });
                updateModalState({ key: 'type', value: 'create' });
              }}
            >
              Add Question
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <SpinnerMini color='#0c4a6e' />
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full'>
            <div className=' col-span-3'>
              {/* Resource Upload Section */}
              <ResourceUploadSection
                bankId={`${questionBankId}`}
                onResourcesChange={(resources) => setBankResources(resources)}
              />
            </div>
            <div className='col-span-1 flex flex-col gap-5 w-full'>
              <div className='p-3 flex flex-col gap-3 w-full border border-neutral-200 rounded-2xl'>
                <span className='text-base font-bold'>
                  Question Bank Summary
                </span>
                <div className='flex flex-col gap-4 w-full'>
                  <div className='flex flex-row items-center justify-between w-full'>
                    <span>Total Questions</span>
                    <span>{questions?.length}</span>
                  </div>
                  <div className='flex flex-row items-center justify-between w-full'>
                    <span>Total Marks</span>
                    <span>{totalMarks}</span>
                  </div>
                  <div className='flex flex-row items-center justify-between w-full'>
                    <span>Bank ID</span>
                    <span>{questionBankId}</span>
                  </div>
                </div>
              </div>

              <div className='p-3 flex flex-col gap-3 w-full border border-neutral-200 rounded-2xl'>
                <span className='text-base font-bold'>Upload CSV File</span>

                <Link
                  download
                  href={`${
                    process.env.NEXT_PUBLIC_API_URL
                  }${dashboardServices.getQuestionsTemplate()}`}
                  className='px-3 py-2 text-sm font-semibold text-neutral-800 shadow-sm border border-neutral-200 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-fit hover:bg-neutral-200 rounded-md'
                >
                  Download Template
                </Link>

                <div className='flex flex-col gap-4 w-full'>
                  {/* PUT QUESTIONS HERE */}

                  <div className='flex flex-col gap-2 w-fit'>
                    <Button
                      disabled={isPending}
                      onClick={handleImportQuestions}
                    >
                      {isPending
                        ? 'Uploading...'
                        : selectedFile
                          ? 'Upload selected file'
                          : 'Import Questions'}
                    </Button>
                    <input
                      hidden
                      ref={inputRef}
                      type='file'
                      onChange={handleSelectQuestion}
                      accept='.csv'
                    />
                    {selectedFile && (
                      <div className='flex flex-row items-center justify-between gap-4 w-full'>
                        <span className='text-base font-medium text-purple-800'>
                          {selectedFile?.name}
                        </span>
                        <button
                          aria-label='Remove file'
                          type='button'
                          className='cursor-pointer opacity-100 hover:opacity-70'
                          onClick={() => setSelectedFile(null)}
                        >
                          <MdDeleteOutline color='#ef4444' size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full gap-4'>
            <div>
              <AppTable
                data={questions ?? []}
                isLoading={isLoading}
                headerColumns={[
                  'S/N',
                  'Resources',
                  'Question',
                  'Answer',
                  'Options',
                  'Mark',
                ]}
                itemKey={({ item }) => `${item.id}`}
                itemsPerPage={itemsPerPage}
                onActionClick={({ item }) =>
                  updateModalState({ key: 'modalContent', value: item })
                }
                renderItem={({ item }) => {
                  // Calculate global index by finding item position in full dataset
                  const globalIndex = (questions ?? []).findIndex(
                    (q) => q.id === item.id,
                  );
                  return (
                    <>
                      <TableDataItem>
                        <span className='font-light text-sm text-neutral-600'>
                          {globalIndex + 1}.
                        </span>
                      </TableDataItem>
                      <TableDataItem>
                        <div className='flex items-center gap-2'>
                          {item.imageUrl && (
                            <button
                              type='button'
                              onClick={(e) => {
                                e.stopPropagation();
                                setResourcePreview({
                                  type: 'diagram',
                                  data: item.imageUrl!,
                                });
                              }}
                              className='group relative hover:scale-110 transition-transform'
                              title='View diagram'
                            >
                              <LuImage className='w-4 h-4 text-primary-600 cursor-pointer' />
                              <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-neutral-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10'>
                                View diagram
                              </span>
                            </button>
                          )}
                          {item.comprehensionText && (
                            <button
                              type='button'
                              onClick={(e) => {
                                e.stopPropagation();
                                setResourcePreview({
                                  type: 'comprehension',
                                  data: item.comprehensionText!,
                                });
                              }}
                              className='group relative hover:scale-110 transition-transform'
                              title='View instructions'
                            >
                              <LuFileText className='w-4 h-4 text-primary-600 cursor-pointer' />
                              <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-neutral-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10'>
                                View instructions
                              </span>
                            </button>
                          )}
                          {!item.imageUrl && !item.comprehensionText && (
                            <span className='text-neutral-400 text-xs'>—</span>
                          )}
                        </div>
                      </TableDataItem>
                      <TableDataItem>
                        {/* <div
                          className='prose max-w-none'
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        /> */}
                        <MathHtmlRenderer html={item.text} />
                      </TableDataItem>
                      <TableDataItem>
                        {/* {item.answer} */}
                        <MathHtmlRenderer html={item.answer} />
                      </TableDataItem>
                      <TableDataItem>
                        {/* {item.options?.join?.(', ') ?? ''} */}
                        {/* {item.options?.map((option, index) => (
                          <span key={index} className='flex items-center gap-2'>
                            <MathHtmlRenderer html={option} />
                          </span>
                        )) ?? ''} */}
                        <MathHtmlRenderer
                          html={item.options?.join(', ') ?? ''}
                          // options={{ delimiter: '||' }}
                        />
                      </TableDataItem>
                      <TableDataItem>{item.marks}</TableDataItem>
                    </>
                  );
                }}
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
        </>
      )}

      {/* modal to delete and update a question bank */}
      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(value) =>
          updateModalState({ key: 'isOpen', value: value as boolean })
        }
      >
        {modalState.type !== 'delete' ? (
          <CreateQuestion
            bankId={`${questionBankId}`}
            type={modalState.type}
            singleQuestion={modalState.modalContent}
            closeModal={() => updateModalState({ key: 'isOpen', value: false })}
            availableResources={{
              diagrams: bankResources.filter((r) => r.type === 'diagram'),
              comprehensions: bankResources.filter(
                (r) => r.type === 'comprehension',
              ),
            }}
          />
        ) : (
          <div className='w-full h-full flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2 w-full'>
              <span className='text-lg text-error-700 font-medium'>
                Delete Question
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
                  onClick={() => deleteFn(`${modalState?.modalContent?.id}`)}
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

      {/* Resource Preview Modal */}
      {resourcePreview && (
        <div
          className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4'
          onClick={() => setResourcePreview(null)}
        >
          <div
            className='bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-xl font-semibold'>
                {resourcePreview.type === 'diagram'
                  ? 'Diagram Preview'
                  : 'Instructions'}
              </h3>
              <button
                onClick={() => setResourcePreview(null)}
                className='p-2 hover:bg-neutral-100 rounded-full transition-colors'
                aria-label='Close preview'
              >
                <LuX className='w-5 h-5' />
              </button>
            </div>
            {resourcePreview.type === 'diagram' ? (
              <div className='relative w-full min-h-[300px]'>
                <Image
                  src={resourcePreview.data}
                  alt='Question diagram'
                  width={800}
                  height={600}
                  className='w-full h-auto rounded-lg'
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div>
                <p className='text-neutral-700 whitespace-pre-wrap'>
                  {resourcePreview.data}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Questions;
