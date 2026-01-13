/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { LuSettings, LuPlus, LuX } from 'react-icons/lu';
import { Button } from '@/components/ui';
import api from '@/lib/axios';
import { queryClient } from '@/providers/query-provider';
import { useEffect, BaseSyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/ui/input';
import { QuestionsInBank } from '@/types/dashboard.types';
import ResourceTypeModal, {
  Resource,
  DiagramResource,
  ComprehensionResource,
} from '@/components/modal/ResourceTypeModal';
import Image from 'next/image';
import getErrorDetails from '@/utils/getErrorDetails';

const schema = Yup.object({
  optionA: Yup.string().required('Option A is required'),
  optionB: Yup.string().required('Option B is required'),
  optionC: Yup.string().required('Option C is required'),
  optionD: Yup.string().required('Option D is required'),
  questionText: Yup.string().required('Question Text is required'),
  correctAnswer: Yup.string().required('Correct answer is required'),
  marks: Yup.string()
    .min(0, 'Mark cannot be less than 0')
    .required('Question mark is required'),
});

type FormProps = Yup.InferType<typeof schema>;

interface CreateQuestionProps {
  bankId: string;
  type: 'update' | 'create';
  closeModal: () => void;
  singleQuestion: QuestionsInBank | null;
  availableResources: {
    diagrams: DiagramResource[];
    comprehensions: ComprehensionResource[];
  };
}

const CreateQuestion = ({
  bankId,
  type,
  closeModal,
  singleQuestion,
  availableResources,
}: CreateQuestionProps) => {
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<{
    diagram: DiagramResource | null;
    comprehension: ComprehensionResource | null;
  }>({ diagram: null, comprehension: null });
  const [removedResources, setRemovedResources] = useState<{
    diagram: boolean;
    comprehension: boolean;
  }>({ diagram: false, comprehension: false });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>({
    resolver: yupResolver(schema),
  });

  const questionOptions = [
    {
      label: 'Option A',
      value: 'A',
    },
    {
      label: 'Option B',
      value: 'B',
    },
    {
      label: 'Option C',
      value: 'C',
    },
    {
      label: 'Option D',
      value: 'D',
    },
  ];

  const handleSubmitQuestion: SubmitHandler<FormProps> = async (
    data,
    event: BaseSyntheticEvent<object, HTMLButtonElement> | undefined,
  ) => {
    // @ts-expect-error
    const buttonValue = event?.nativeEvent.submitter.value;
    const options = [data.optionA, data.optionB, data.optionC, data.optionD];
    const answerIndex = questionOptions.findIndex(
      (item) => item.value === data.correctAnswer,
    );
    const answer = options[answerIndex];

    const json = {
      options,
      answer,
      text: data.questionText,
      marks: Number(data.marks),
    };

    const payload =
      type === 'create'
        ? {
            ...json,
            bankId: Number(bankId),
            imageUrl: selectedResources.diagram?.url ?? null,
            comprehensionText: selectedResources.comprehension?.text ?? null,
          }
        : {
            ...json,
            imageUrl:
              removedResources.diagram && !selectedResources.diagram
                ? null
                : selectedResources.diagram?.url,
            comprehensionText:
              removedResources.comprehension && !selectedResources.comprehension
                ? null
                : selectedResources.comprehension?.text,
          };

    try {
      const res =
        type === 'update'
          ? await api.patch(`/question/${singleQuestion?.id}`, payload)
          : await api.post('/question', payload);

      await queryClient.invalidateQueries({
        queryKey: ['questionBanks', bankId],
      });
      toast.success(res.data.message || 'Successful');
      reset();

      if (buttonValue !== 'save-another') {
        closeModal();
      }
    } catch (error) {
      toast.error(getErrorDetails(error));
    }
  };

  const handleResourceSelection = (resource: Resource) => {
    if (resource.type === 'diagram') {
      setSelectedResources((prev) => ({
        ...prev,
        diagram: resource,
      }));
      setRemovedResources((prev) => ({ ...prev, diagram: false }));
    } else {
      setSelectedResources((prev) => ({
        ...prev,
        comprehension: resource,
      }));
      setRemovedResources((prev) => ({ ...prev, comprehension: false }));
    }
    toast.success(
      `${
        resource.type === 'diagram' ? 'Diagram' : 'Instructions'
      } attached successfully`,
    );
  };

  const handleRemoveResource = (type: 'diagram' | 'comprehension') => {
    setSelectedResources((prev) => ({
      ...prev,
      [type]: null,
    }));
    setRemovedResources((prev) => ({ ...prev, [type]: true }));
    toast.success('Resource removed');
  };

  useEffect(() => {
    if (type !== 'update') return;

    const correctAnswerIndex = (singleQuestion?.options as string[]).findIndex(
      (item) => item === singleQuestion?.answer,
    );

    const correctAnswer = questionOptions[correctAnswerIndex].value;

    setValue('questionText', singleQuestion?.text as string);
    setValue('optionA', singleQuestion?.options[0] as string);
    setValue('optionB', singleQuestion?.options[1] as string);
    setValue('optionC', singleQuestion?.options[2] as string);
    setValue('optionD', singleQuestion?.options[3] as string);
    setValue('correctAnswer', correctAnswer);
    setValue('marks', `${singleQuestion?.marks}`);

    if (singleQuestion?.imageUrl) {
      const match = availableResources.diagrams.find(
        (d) => d.url === singleQuestion.imageUrl,
      );
      if (match) {
        setSelectedResources((prev) => ({ ...prev, diagram: match }));
      }
    }

    if (singleQuestion?.comprehensionText) {
      const match = availableResources.comprehensions.find(
        (c) => c.text === singleQuestion.comprehensionText,
      );
      if (match) {
        setSelectedResources((prev) => ({ ...prev, comprehension: match }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, setValue, singleQuestion]);

  return (
    <>
      <ResourceTypeModal
        isOpen={resourceModalOpen}
        setIsOpen={setResourceModalOpen}
        onSelectResource={handleResourceSelection}
        availableResources={availableResources}
      />

      <div className='flex flex-col gap-1 bg-background rounded-xl w-full p-3'>
        <div className='flex items-center justify-between mb-2'>
          <span className='font-medium'>Create Question</span>

          <button
            type='button'
            onClick={() => setResourceModalOpen(true)}
            className='flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 border border-primary-300 rounded-md hover:bg-primary-50 transition-colors'
          >
            <LuPlus className='w-4 h-4' />
            Add Resource
          </button>
        </div>

        {(selectedResources.diagram || selectedResources.comprehension) && (
          <div className='mb-3 p-3 bg-primary-50 border border-primary-200 rounded-md flex flex-col gap-3'>
            {selectedResources.diagram && (
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-sm font-medium text-primary-700'>
                      📊 Diagram:
                    </span>
                    <span className='text-sm text-primary-600'>
                      {selectedResources.diagram.name}
                    </span>
                  </div>
                  <div className='mt-2 relative w-full max-w-xs h-32'>
                    <Image
                      src={selectedResources.diagram.url}
                      alt={selectedResources.diagram.name}
                      fill
                      className='rounded border border-primary-300 object-contain'
                    />
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() => handleRemoveResource('diagram')}
                  className='p-1 hover:bg-primary-100 rounded transition-colors ml-2'
                  title='Remove diagram'
                >
                  <LuX className='w-4 h-4 text-primary-700' />
                </button>
              </div>
            )}

            {selectedResources.comprehension && (
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-sm font-medium text-primary-700'>
                      📖 Instructions:
                    </span>
                    <span className='text-sm text-primary-600'>
                      {selectedResources.comprehension.title}
                    </span>
                  </div>
                  <p className='text-xs text-neutral-600 line-clamp-2 mt-1'>
                    {selectedResources.comprehension.text}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => handleRemoveResource('comprehension')}
                  className='p-1 hover:bg-primary-100 rounded transition-colors ml-2'
                  title='Remove instructions'
                >
                  <LuX className='w-4 h-4 text-primary-700' />
                </button>
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleSubmitQuestion)}
          className='flex flex-col gap-3 w-full'
        >
          <Input
            label='Question Text'
            name='questionText'
            placeholder='What is 1 + 5?'
            hookFormRegister={register}
            errorText={errors.questionText && errors.questionText.message}
          />

          <Input
            label='Option A'
            name='optionA'
            placeholder='6'
            hookFormRegister={register}
            errorText={errors.optionA && errors.optionA.message}
          />

          <Input
            label='Option B'
            name='optionB'
            placeholder='4'
            hookFormRegister={register}
            errorText={errors.optionB && errors.optionB.message}
          />

          <Input
            label='Option C'
            name='optionC'
            placeholder='7'
            hookFormRegister={register}
            errorText={errors.optionC && errors.optionC.message}
          />

          <Input
            label='Option D'
            name='optionD'
            placeholder='10'
            hookFormRegister={register}
            errorText={errors.optionD && errors.optionD.message}
          />

          <div className='flex md:flex-row flex-col items-center gap-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor='correctAnswer'>
                <span className='text-sm text-neutral-600'>Correct Answer</span>

                <select
                  id='correctAnswer'
                  {...register('correctAnswer')}
                  className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
                >
                  <option value={''} disabled>
                    Select Correct Answer
                  </option>
                  {questionOptions.map((answer) => (
                    <option key={answer.value} value={answer.value}>
                      {answer.label}
                    </option>
                  ))}
                </select>
              </label>

              {errors?.correctAnswer?.message && (
                <small className='text-error-500'>
                  {errors?.correctAnswer?.message}
                </small>
              )}
            </div>

            <Input
              label='Marks'
              name='marks'
              placeholder='1'
              type='number'
              min={0}
              hookFormRegister={register}
              errorText={errors.marks && errors.marks.message}
            />
          </div>

          <div className='flex flex-row items-center gap-3'>
            <div className='w-fit'>
              <Button type='submit' disabled={isSubmitting}>
                Save Question
              </Button>
            </div>

            {type === 'create' && (
              <div className='w-fit'>
                <button
                  value='save-another'
                  type='submit'
                  disabled={isSubmitting}
                  className='px-3 py-2 text-sm font-semibold text-neutral-800 shadow-sm border border-neutral-200 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-fit hover:bg-neutral-200 rounded-md'
                >
                  <div className='flex flex-row items-center gap-2'>
                    <span>Save & Add Another</span>
                    <LuSettings />
                  </div>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateQuestion;
