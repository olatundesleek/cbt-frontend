/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { LuSettings, LuPlus, LuX } from 'react-icons/lu';
import { Button } from '@/components/ui';
import api from '@/lib/axios';
import { queryClient } from '@/providers/query-provider';
import {
  BaseSyntheticEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '@/components/ui/input';
import { EditorAction, QuestionsInBank } from '@/types/dashboard.types';
import ResourceTypeModal, {
  Resource,
  DiagramResource,
  ComprehensionResource,
} from '@/components/modal/ResourceTypeModal';
import Image from 'next/image';
import getErrorDetails from '@/utils/getErrorDetails';
import EditorBar from '@/components/editorbar';
import ReactQuill from 'react-quill-new';
import { EditableMathField } from 'react-mathquill';
import { addStyles } from 'react-mathquill';

addStyles();

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

const defaultValues: FormProps = {
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  questionText: '',
  correctAnswer: '',
  marks: '',
};

type QuestionOption = {
  label: string;
  value: string;
};

type SelectedResources = {
  diagram: DiagramResource | null;
  comprehension: ComprehensionResource | null;
};

type RemovedResources = {
  diagram: boolean;
  comprehension: boolean;
};

type OptionKey = 'optionA' | 'optionB' | 'optionC' | 'optionD';

type OptionEditorState = {
  optionA: {
    value: string;
    activeTab: Record<EditorAction, boolean>;
  };
  optionB: {
    value: string;
    activeTab: Record<EditorAction, boolean>;
  };
  optionC: {
    value: string;
    activeTab: Record<EditorAction, boolean>;
  };
  optionD: {
    value: string;
    activeTab: Record<EditorAction, boolean>;
  };
};

const createEmptyOptionState = (): OptionEditorState => ({
  optionA: {
    value: '',
    activeTab: {
      bold: false,
      italic: false,
      underline: false,
      color: false,
      math: false,
      text: false,
      strike: false,
      background: false,
    },
  },
  optionB: {
    value: '',
    activeTab: {
      bold: false,
      italic: false,
      underline: false,
      color: false,
      math: false,
      text: false,
      strike: false,
      background: false,
    },
  },
  optionC: {
    value: '',
    activeTab: {
      bold: false,
      italic: false,
      underline: false,
      color: false,
      math: false,
      text: false,
      strike: false,
      background: false,
    },
  },
  optionD: {
    value: '',
    activeTab: {
      bold: false,
      italic: false,
      underline: false,
      color: false,
      math: false,
      text: false,
      strike: false,
      background: false,
    },
  },
});

const questionOptions: QuestionOption[] = [
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

interface ResourcePreviewProps {
  selectedResources: SelectedResources;
  onRemove: (type: 'diagram' | 'comprehension') => void;
}

const ResourcePreview = ({
  selectedResources,
  onRemove,
}: ResourcePreviewProps) => {
  if (!selectedResources.diagram && !selectedResources.comprehension) {
    return null;
  }

  return (
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
            onClick={() => onRemove('diagram')}
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
            onClick={() => onRemove('comprehension')}
            className='p-1 hover:bg-primary-100 rounded transition-colors ml-2'
            title='Remove instructions'
          >
            <LuX className='w-4 h-4 text-primary-700' />
          </button>
        </div>
      )}
    </div>
  );
};

interface QuestionEditorProps {
  editorValue: string;
  editorInputRef: RefObject<ReactQuill | null>;
  onChange: (value: string) => void;
  onFocus: () => void;
}

const QuestionEditor = ({
  editorValue,
  editorInputRef,
  onChange,
  onFocus,
}: QuestionEditorProps) => {
  return (
    <div className='flex flex-col gap-1'>
      <label htmlFor='questionText'>
        <span className='text-sm text-neutral-600'>Question Text</span>
      </label>
      <ReactQuill
        ref={editorInputRef}
        modules={{ toolbar: false }}
        value={editorValue}
        onChange={onChange}
        onChangeSelection={onFocus}
        className='rounded-lg border border-neutral-300 focus-within:border-blue-500 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-blue-500 h-10'
        id='questionText'
        placeholder='What is 1 + 5'
      />
    </div>
  );
};

interface OptionEditorProps {
  optionKey: OptionKey;
  label: string;
  value: string;
  editorRef: RefObject<ReactQuill | null>;
  onChange: (value: string) => void;
  onFocus: (optionKey: OptionKey) => void;
}

const OptionEditor = ({
  optionKey,
  label,
  value,
  editorRef,
  onChange,
  onFocus,
}: OptionEditorProps) => {
  return (
    <div className='flex flex-col gap-2 p-2 rounded-md'>
      <label className='text-sm font-medium text-neutral-700'>{label}</label>
      <ReactQuill
        ref={editorRef}
        modules={{ toolbar: false }}
        value={value}
        onChange={onChange}
        onChangeSelection={() => onFocus(optionKey)}
        className='rounded-md border border-neutral-300 focus-within:border-blue-500 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 h-12 bg-white'
        id={optionKey}
        placeholder={`Enter ${label}`}
      />
    </div>
  );
};

interface QuestionFormFieldsProps {
  register: UseFormRegister<FormProps>;
  errors: FieldErrors<FormProps>;
  options: QuestionOption[];
  isSubmitting: boolean;
  type: 'update' | 'create';
  optionEditorState: OptionEditorState;
  optionEditorRefs: {
    optionA: RefObject<ReactQuill | null>;
    optionB: RefObject<ReactQuill | null>;
    optionC: RefObject<ReactQuill | null>;
    optionD: RefObject<ReactQuill | null>;
  };
  onOptionChange: (key: OptionKey, value: string) => void;
  onOptionFocus: (optionKey: OptionKey) => void;
}

const QuestionFormFields = ({
  register,
  errors,
  options,
  isSubmitting,
  type,
  optionEditorState,
  optionEditorRefs,
  onOptionChange,
  onOptionFocus,
}: QuestionFormFieldsProps) => {
  const optionLabels: Record<OptionKey, string> = {
    optionA: 'Option A',
    optionB: 'Option B',
    optionC: 'Option C',
    optionD: 'Option D',
  };

  return (
    <>
      {(['optionA', 'optionB', 'optionC', 'optionD'] as OptionKey[]).map(
        (optionKey) => (
          <OptionEditor
            key={optionKey}
            optionKey={optionKey}
            label={optionLabels[optionKey]}
            value={optionEditorState[optionKey].value}
            editorRef={optionEditorRefs[optionKey]}
            onChange={(value) => onOptionChange(optionKey, value)}
            onFocus={onOptionFocus}
          />
        ),
      )}

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
              {options.map((answer) => (
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
          step='any'
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
    </>
  );
};

interface MathModalProps {
  mathValue: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onInsert: () => void;
}

const MathModal = ({
  mathValue,
  onChange,
  onClose,
  onInsert,
}: MathModalProps) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
      <div className='bg-white p-4 rounded-lg w-100'>
        <h3>Insert Math</h3>

        <EditableMathField
          latex={mathValue}
          onChange={(mathField) => onChange(mathField.latex())}
          className='border p-2 rounded min-h-12.5'
        />

        <div className='mt-4 flex justify-end gap-2'>
          <Button type='button' onClick={onClose}>
            Cancel
          </Button>
          <Button type='button' onClick={onInsert}>
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

const CreateQuestion = ({
  bankId,
  type,
  closeModal,
  singleQuestion,
  availableResources,
}: CreateQuestionProps) => {
  const [activeTab, setActiveTab] = useState<Record<EditorAction, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    color: false,
    math: false,
    text: false,
    strike: false,
    background: false,
  });
  const [showMathModal, setShowMathModal] = useState(false);
  const [mathValue, setMathValue] = useState('');
  const [mathTargetOption, setMathTargetOption] = useState<OptionKey | null>(
    null,
  );
  const [editorValue, setEditorValue] = useState('');
  const editorInputRef = useRef<ReactQuill>(null);
  const [activeOptionKey, setActiveOptionKey] = useState<OptionKey | null>(
    null,
  );

  const [optionEditorState, setOptionEditorState] = useState<OptionEditorState>(
    createEmptyOptionState(),
  );
  const optionEditorRefs: {
    optionA: RefObject<ReactQuill | null>;
    optionB: RefObject<ReactQuill | null>;
    optionC: RefObject<ReactQuill | null>;
    optionD: RefObject<ReactQuill | null>;
  } = {
    optionA: useRef<ReactQuill>(null),
    optionB: useRef<ReactQuill>(null),
    optionC: useRef<ReactQuill>(null),
    optionD: useRef<ReactQuill>(null),
  };

  const [formKey, setFormKey] = useState(0);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<SelectedResources>(
    { diagram: null, comprehension: null },
  );
  const [removedResources, setRemovedResources] = useState<RemovedResources>({
    diagram: false,
    comprehension: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleEditorChange = (value: string) => {
    setEditorValue(value);
    setValue('questionText', value, { shouldDirty: true });
  };

  const handleOptionChange = (optionKey: OptionKey, value: string) => {
    setOptionEditorState((prev) => ({
      ...prev,
      [optionKey]: {
        ...prev[optionKey],
        value,
      },
    }));
    setValue(optionKey, value, { shouldDirty: true });
  };

  const applyFormatToActiveOption = (action: EditorAction, value?: string) => {
    if (!activeOptionKey) return;

    const quill = optionEditorRefs[activeOptionKey].current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    if (!range) return;

    if (action === 'math') {
      setMathTargetOption(activeOptionKey);
      setShowMathModal(true);
      return;
    }

    if (action === 'text') {
      quill.removeFormat(range.index, range.length);
      setOptionEditorState((prev) => ({
        ...prev,
        [activeOptionKey]: {
          ...prev[activeOptionKey],
          activeTab: {
            bold: false,
            italic: false,
            underline: false,
            color: false,
            background: false,
            math: false,
            text: true,
            strike: false,
          },
        },
      }));
      return;
    }

    if (action === 'color' || action === 'background') {
      quill.format(action, value || false);
      return;
    }

    const currentFormat = quill.getFormat(range!);
    const isActive = !!currentFormat[action];

    quill.format(action, !isActive);

    setOptionEditorState((prev) => ({
      ...prev,
      [activeOptionKey]: {
        ...prev[activeOptionKey],
        activeTab: {
          ...prev[activeOptionKey].activeTab,
          [action]: !isActive,
        },
      },
    }));
  };

  const syncActiveTabFormats = () => {
    if (!activeOptionKey) return;

    const quill = optionEditorRefs[activeOptionKey].current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    if (!range) return;

    const formats = quill.getFormat(range);

    setOptionEditorState((prev) => ({
      ...prev,
      [activeOptionKey]: {
        ...prev[activeOptionKey],
        activeTab: {
          ...prev[activeOptionKey].activeTab,
          bold: !!formats.bold,
          italic: !!formats.italic,
          underline: !!formats.underline,
          strike: !!formats.strike,
        },
      },
    }));
  };

  const handleSubmitQuestion: SubmitHandler<FormProps> = async (
    data,
    event: BaseSyntheticEvent<object, HTMLButtonElement> | undefined,
  ) => {
    // @ts-expect-error
    const buttonValue = event?.nativeEvent.submitter.value;
    const options = [
      optionEditorState.optionA.value,
      optionEditorState.optionB.value,
      optionEditorState.optionC.value,
      optionEditorState.optionD.value,
    ];
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
      reset(defaultValues);
      setEditorValue('');
      setOptionEditorState(createEmptyOptionState());
      setSelectedResources({ diagram: null, comprehension: null });
      setRemovedResources({ diagram: false, comprehension: false });

      if (buttonValue !== 'save-another') {
        closeModal();
      } else {
        setFormKey((prev) => prev + 1);
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

    setEditorValue(singleQuestion?.text as string);
    setValue('questionText', singleQuestion?.text as string);
    setValue('optionA', singleQuestion?.options[0] as string);
    setValue('optionB', singleQuestion?.options[1] as string);
    setValue('optionC', singleQuestion?.options[2] as string);
    setValue('optionD', singleQuestion?.options[3] as string);
    setValue('correctAnswer', correctAnswer);
    setValue('marks', `${singleQuestion?.marks}`);

    setOptionEditorState((prev) => ({
      ...prev,
      optionA: {
        ...prev.optionA,
        value: (singleQuestion?.options[0] as string) || '',
      },
      optionB: {
        ...prev.optionB,
        value: (singleQuestion?.options[1] as string) || '',
      },
      optionC: {
        ...prev.optionC,
        value: (singleQuestion?.options[2] as string) || '',
      },
      optionD: {
        ...prev.optionD,
        value: (singleQuestion?.options[3] as string) || '',
      },
    }));

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

  //editor implementation
  const applyFormat = function (action: EditorAction, value?: string) {
    const quill = editorInputRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    if (!range) return;

    if (action === 'math') {
      setShowMathModal(true);
      return;
    }

    if (action === 'text') {
      quill.removeFormat(range.index, range.length);
      setActiveTab({
        bold: false,
        italic: false,
        underline: false,
        color: false,
        background: false,
        math: false,
        text: true,
        strike: false,
      });
      return;
    }

    if (action === 'color' || action === 'background') {
      quill.format(action, value || false);
      return;
    }

    const currentFormat = quill.getFormat(range!);
    const isActive = !!currentFormat[action];

    quill.format(action, !isActive);

    setActiveTab((prev) => ({
      ...prev,
      [action]: !isActive,
    }));
  };

  useEffect(() => {
    const quill = editorInputRef.current?.getEditor();
    if (!quill) return;

    const updateFormats = () => {
      const range = quill.getSelection();
      if (!range) return;

      const formats = quill.getFormat(range);

      setActiveTab((prev) => ({
        ...prev,
        bold: !!formats.bold,
        italic: !!formats.italic,
        underline: !!formats.underline,
        strike: !!formats.strike,
      }));
    };

    quill.on('selection-change', updateFormats);
    quill.on('text-change', updateFormats);

    return () => {
      quill.off('selection-change', updateFormats);
      quill.off('text-change', updateFormats);
    };
  }, []);

  useEffect(() => {
    if (!activeOptionKey) return;

    const quill = optionEditorRefs[activeOptionKey].current?.getEditor();
    if (!quill) return;

    const handleSelectionChange = () => {
      syncActiveTabFormats();
    };

    quill.on('selection-change', handleSelectionChange);
    quill.on('text-change', handleSelectionChange);

    return () => {
      quill.off('selection-change', handleSelectionChange);
      quill.off('text-change', handleSelectionChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOptionKey]);

  const handleInsertMath = () => {
    const targetRef = mathTargetOption
      ? optionEditorRefs[mathTargetOption]
      : editorInputRef;
    const quill = targetRef.current?.getEditor();
    const range = quill?.getSelection();
    if (!quill || !range) return;

    const cleanedLatex = mathValue
      .replace(/\\\s+/g, ' ') // remove "\\ "
      .replace(/\s+/g, ' ') // normalize spaces
      .trim();

    quill.insertText(range.index, `⟦${cleanedLatex}⟧`);
    setShowMathModal(false);
    setMathValue('');
    setMathTargetOption(null);
  };

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

        <ResourcePreview
          selectedResources={selectedResources}
          onRemove={handleRemoveResource}
        />

        {activeOptionKey ? (
          <EditorBar
            applyFormat={applyFormatToActiveOption}
            activeTab={optionEditorState[activeOptionKey].activeTab}
          />
        ) : (
          <EditorBar applyFormat={applyFormat} activeTab={activeTab} />
        )}

        <form
          key={formKey}
          onSubmit={handleSubmit(handleSubmitQuestion)}
          className='flex flex-col gap-3 w-full'
        >
          <QuestionEditor
            editorValue={editorValue}
            editorInputRef={editorInputRef}
            onChange={handleEditorChange}
            onFocus={() => setActiveOptionKey(null)}
          />

          <QuestionFormFields
            register={register}
            errors={errors}
            options={questionOptions}
            isSubmitting={isSubmitting}
            type={type}
            optionEditorState={optionEditorState}
            optionEditorRefs={optionEditorRefs}
            onOptionChange={handleOptionChange}
            onOptionFocus={setActiveOptionKey}
          />
        </form>
      </div>
      {showMathModal && (
        <MathModal
          mathValue={mathValue}
          onChange={setMathValue}
          onClose={() => setShowMathModal(false)}
          onInsert={handleInsertMath}
        />
      )}
    </>
  );
};;

export default CreateQuestion;
