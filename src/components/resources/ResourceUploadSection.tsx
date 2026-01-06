'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  LuUpload,
  LuImage,
  LuFileText,
  LuX,
  LuEye,
  LuPencil,
} from 'react-icons/lu';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
  useUploadQuestionBankImages,
  useDeleteQuestionBankImage,
  useUpdateQuestionBankImage,
  useCreateComprehension,
  useUpdateComprehension,
  useDeleteComprehension,
  useGetQuestionBankResources,
} from '@/features/dashboard/queries/useDashboard';
import { QuestionBankImage } from '@/types/dashboard.types';

interface DiagramResource {
  id: string;
  type: 'diagram';
  url: string;
  name: string;
  file?: File;
}

interface ComprehensionResource {
  id: string;
  type: 'comprehension';
  title: string;
  text: string;
}

export type Resource = DiagramResource | ComprehensionResource;

interface ResourceUploadSectionProps {
  bankId: string;
  onResourcesChange?: (resources: Resource[]) => void;
}

/**
 * Component for uploading and managing question bank resources
 * Handles both diagram (images) and comprehension (text passages) uploads
 * Resources are stored per question bank and can be attached to questions later
 */
const ResourceUploadSection = ({
  bankId,
  onResourcesChange,
}: ResourceUploadSectionProps) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'comprehension'>(
    'diagram',
  );
  const [diagrams, setDiagrams] = useState<DiagramResource[]>([]);
  const [comprehensions, setComprehensions] = useState<ComprehensionResource[]>(
    [],
  );
  const [showComprehensionForm, setShowComprehensionForm] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [diagramDescription, setDiagramDescription] = useState('');
  const [editTarget, setEditTarget] = useState<DiagramResource | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Comprehension form state
  const [compTitle, setCompTitle] = useState('');
  const [compText, setCompText] = useState('');
  const [compEditTarget, setCompEditTarget] =
    useState<ComprehensionResource | null>(null);
  const [compEditTitle, setCompEditTitle] = useState('');
  const [compEditText, setCompEditText] = useState('');

  const hasHydratedResourcesRef = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImagesMutation = useUploadQuestionBankImages(bankId);
  const deleteImageMutation = useDeleteQuestionBankImage();
  const updateImageMutation = useUpdateQuestionBankImage();
  const createComprehensionMutation = useCreateComprehension(bankId);
  const updateComprehensionMutation = useUpdateComprehension();
  const deleteComprehensionMutation = useDeleteComprehension();
  const queryClient = useQueryClient();
  const { data: resourcesData, isLoading: isResourcesLoading } =
    useGetQuestionBankResources(bankId);

  const mapImageToDiagram = (image: QuestionBankImage): DiagramResource => {
    const nameFromUrl = image.url.split('/').pop() || 'Diagram';
    return {
      id: `${image.id}`,
      type: 'diagram',
      url: image.url,
      name: image.description || nameFromUrl,
    };
  };

  const mapComprehension = (comp: {
    id: number | string;
    title: string;
    content: string;
  }): ComprehensionResource => ({
    id: `${comp.id}`,
    type: 'comprehension',
    title: comp.title,
    text: comp.content,
  });

  useEffect(() => {
    if (!resourcesData?.data || hasHydratedResourcesRef.current) return;

    const mappedImages = resourcesData.data.images.map(mapImageToDiagram);
    const mappedComprehensions =
      resourcesData.data.comprehensions.map(mapComprehension);

    startTransition(() => {
      setDiagrams(mappedImages);
      setComprehensions(mappedComprehensions);
      onResourcesChange?.([...mappedImages, ...mappedComprehensions]);
      hasHydratedResourcesRef.current = true;
    });
  }, [resourcesData, onResourcesChange]);

  // Handle diagram upload via API
  const handleDiagramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error('No files selected');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('bankImages', file);
    });

    if (diagramDescription.trim()) {
      formData.append('description', diagramDescription.trim());
    }

    uploadImagesMutation.mutate(formData, {
      onSuccess: (res) => {
        const mapped = res.data.map(mapImageToDiagram);
        setDiagrams((prev) => {
          const updated = [...prev, ...mapped];
          onResourcesChange?.([...updated, ...comprehensions]);
          return updated;
        });
        setDiagramDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        queryClient.invalidateQueries({
          queryKey: ['questionBankResources', bankId],
        });
      },
    });
  };

  // Handle comprehension creation
  const handleAddComprehension = () => {
    if (!compTitle.trim() || !compText.trim()) {
      toast.error('Please provide both title and text');
      return;
    }

    createComprehensionMutation.mutate(
      { title: compTitle.trim(), content: compText.trim() },
      {
        onSuccess: (res) => {
          const mapped = mapComprehension(res.data);
          setComprehensions((prev) => {
            const updated = [...prev, mapped];
            onResourcesChange?.([...diagrams, ...updated]);
            return updated;
          });
          setCompTitle('');
          setCompText('');
          setShowComprehensionForm(false);
          queryClient.invalidateQueries({
            queryKey: ['questionBankResources', bankId],
          });
        },
      },
    );
  };

  // Delete resource
  const handleDeleteResource = (
    id: string,
    type: 'diagram' | 'comprehension',
  ) => {
    if (type === 'diagram') {
      deleteImageMutation.mutate(id, {
        onSuccess: () => {
          setDiagrams((prev) => {
            const updated = prev.filter((d) => d.id !== id);
            onResourcesChange?.([...updated, ...comprehensions]);
            return updated;
          });
          queryClient.invalidateQueries({
            queryKey: ['questionBankResources', bankId],
          });
        },
      });
    } else {
      deleteComprehensionMutation.mutate(id, {
        onSuccess: () => {
          setComprehensions((prev) => {
            const updated = prev.filter((c) => c.id !== id);
            onResourcesChange?.([...diagrams, ...updated]);
            return updated;
          });
          queryClient.invalidateQueries({
            queryKey: ['questionBankResources', bankId],
          });
        },
      });
    }
  };

  return (
    <div className='flex flex-col gap-4 w-full p-4 border border-neutral-200 rounded-xl bg-background'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-foreground'>
            Question Bank Resources
          </h2>
          <p className='text-sm text-neutral-600'>
            Upload diagrams and comprehension passages for this question bank
          </p>
          {isResourcesLoading && (
            <p className='text-xs text-neutral-500 mt-1'>
              Loading existing resources...
            </p>
          )}
        </div>

        <div className='flex gap-2'>
          <span className='text-sm px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full'>
            {diagrams.length} Diagrams
          </span>
          <span className='text-sm px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full'>
            {comprehensions.length} Passages
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 border-b border-neutral-200'>
        <button
          onClick={() => setActiveTab('diagram')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'diagram'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <div className='flex items-center gap-2'>
            <LuImage className='w-4 h-4' />
            Diagrams
          </div>
        </button>
        <button
          onClick={() => setActiveTab('comprehension')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'comprehension'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <div className='flex items-center gap-2'>
            <LuFileText className='w-4 h-4' />
            Comprehensions
          </div>
        </button>
      </div>

      {/* Diagram Tab */}
      {activeTab === 'diagram' && (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='diagram-description'
                className='text-sm font-medium text-neutral-700'
              >
                Optional description (applies to all images)
              </label>
              <input
                id='diagram-description'
                type='text'
                value={diagramDescription}
                onChange={(e) => setDiagramDescription(e.target.value)}
                placeholder='e.g. Diagrams for algebra section'
                className='px-3 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white'
              />
            </div>
            <label htmlFor='diagram-upload' className='sr-only'>
              Upload diagrams
            </label>
            <input
              id='diagram-upload'
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              onChange={handleDiagramUpload}
              className='hidden'
              aria-label='Upload diagram images'
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadImagesMutation.isPending}
              className='flex items-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed'
            >
              <LuUpload className='w-5 h-5' />
              <span className='font-medium'>
                {uploadImagesMutation.isPending
                  ? 'Uploading...'
                  : 'Upload Diagrams'}
              </span>
              <span className='text-sm text-neutral-600'>
                (Images only, max 5MB each)
              </span>
              {uploadImagesMutation.isPending && (
                <span
                  className='ml-2 inline-block h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'
                  aria-label='Uploading'
                />
              )}
            </button>
          </div>

          {/* Diagram List */}
          {diagrams.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {diagrams.map((diagram) => (
                <div
                  key={diagram.id}
                  className='relative group border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow'
                >
                  <div className='w-full h-32 relative'>
                    <Image
                      src={diagram.url}
                      alt={diagram.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='p-2'>
                    <p className='text-xs text-neutral-600 truncate'>
                      {diagram.name}
                    </p>
                  </div>
                  <div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button
                      onClick={() => {
                        setEditTarget(diagram);
                        setEditDescription(diagram.name);
                        setEditFile(null);
                      }}
                      className='p-1.5 bg-white rounded-full shadow-md hover:bg-neutral-100'
                      title='Edit'
                    >
                      <LuPencil className='w-4 h-4 text-neutral-700' />
                    </button>
                    <button
                      onClick={() => setPreviewResource(diagram)}
                      className='p-1.5 bg-white rounded-full shadow-md hover:bg-neutral-100'
                      title='Preview'
                    >
                      <LuEye className='w-4 h-4 text-neutral-700' />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteResource(diagram.id, 'diagram')
                      }
                      disabled={deleteImageMutation.isPending}
                      className='p-1.5 bg-white rounded-full shadow-md hover:bg-error-50 disabled:cursor-not-allowed'
                      title='Delete'
                    >
                      <LuX
                        className={`w-4 h-4 ${
                          deleteImageMutation.isPending
                            ? 'text-neutral-400'
                            : 'text-error-600'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-neutral-500'>
              No diagrams uploaded yet
            </div>
          )}

          {editTarget && (
            <div className='border border-primary-200 bg-primary-50 rounded-lg p-4 flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='text-sm font-semibold text-primary-800'>
                    Edit image
                  </h4>
                  <p className='text-xs text-neutral-700'>
                    Update description or replace the file.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setEditTarget(null);
                    setEditDescription('');
                    setEditFile(null);
                    if (editFileInputRef.current)
                      editFileInputRef.current.value = '';
                  }}
                  className='p-1.5 rounded-full hover:bg-primary-100'
                  title='Close edit'
                >
                  <LuX className='w-4 h-4 text-primary-700' />
                </button>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='edit-description'
                  className='text-sm font-medium text-neutral-800'
                >
                  Description
                </label>
                <input
                  id='edit-description'
                  type='text'
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className='px-3 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white'
                />
              </div>

              <div className='flex items-center gap-3'>
                <input
                  aria-label='image-input'
                  ref={editFileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setEditFile(file);
                  }}
                />
                <button
                  type='button'
                  onClick={() => editFileInputRef.current?.click()}
                  className='px-3 py-2 text-sm font-medium border border-neutral-300 rounded-md hover:bg-neutral-100'
                >
                  {editFile
                    ? 'Change selected file'
                    : 'Choose new file (optional)'}
                </button>
                {editFile && (
                  <span className='text-xs text-neutral-600 truncate'>
                    {editFile.name}
                  </span>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  disabled={updateImageMutation.isPending}
                  onClick={() => {
                    if (!editTarget) return;
                    const formData = new FormData();
                    if (editFile) {
                      formData.append('bankImages', editFile);
                    }
                    if (editDescription.trim()) {
                      formData.append('description', editDescription.trim());
                    }
                    updateImageMutation.mutate(
                      {
                        imageId: editTarget.id,
                        formData,
                      },
                      {
                        onSuccess: (res) => {
                          const updated = mapImageToDiagram(res.data);
                          setDiagrams((prev) => {
                            const next = prev.map((d) =>
                              d.id === editTarget.id ? updated : d,
                            );
                            onResourcesChange?.([...next, ...comprehensions]);
                            return next;
                          });
                          setEditTarget(null);
                          setEditDescription('');
                          setEditFile(null);
                          if (editFileInputRef.current)
                            editFileInputRef.current.value = '';
                          queryClient.invalidateQueries({
                            queryKey: ['questionBankResources', bankId],
                          });
                        },
                        onError: () => {
                          // toast handled by hook
                        },
                      },
                    );
                  }}
                >
                  {updateImageMutation.isPending ? 'Saving...' : 'Save changes'}
                </Button>
                <button
                  type='button'
                  onClick={() => {
                    setEditTarget(null);
                    setEditDescription('');
                    setEditFile(null);
                    if (editFileInputRef.current)
                      editFileInputRef.current.value = '';
                  }}
                  className='px-3 py-2 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-md hover:bg-neutral-100'
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comprehension Tab */}
      {activeTab === 'comprehension' && (
        <div className='flex flex-col gap-4'>
          {!showComprehensionForm ? (
            <button
              onClick={() => setShowComprehensionForm(true)}
              className='flex items-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all w-full justify-center'
            >
              <LuUpload className='w-5 h-5' />
              <span className='font-medium'>Add Comprehension Passage</span>
            </button>
          ) : (
            <div className='flex flex-col gap-3 p-4 border border-neutral-200 rounded-lg bg-neutral-50'>
              <label htmlFor='comp-title' className='sr-only'>
                Passage Title
              </label>
              <input
                id='comp-title'
                type='text'
                placeholder='Passage Title'
                value={compTitle}
                onChange={(e) => setCompTitle(e.target.value)}
                className='px-3 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white'
              />
              <label htmlFor='comp-text' className='sr-only'>
                Comprehension Passage
              </label>
              <textarea
                id='comp-text'
                placeholder='Paste or type the comprehension passage here...'
                value={compText}
                onChange={(e) => setCompText(e.target.value)}
                rows={8}
                className='px-3 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white resize-none'
              />
              <div className='flex gap-2'>
                <Button
                  type='button'
                  disabled={createComprehensionMutation.isPending}
                  onClick={handleAddComprehension}
                >
                  {createComprehensionMutation.isPending
                    ? 'Saving...'
                    : 'Save Passage'}
                </Button>
                <button
                  type='button'
                  onClick={() => {
                    setShowComprehensionForm(false);
                    setCompTitle('');
                    setCompText('');
                  }}
                  className='px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Comprehension List */}
          {comprehensions.length > 0 && (
            <div className='flex flex-col gap-3'>
              {comprehensions.map((comp) => (
                <div
                  key={comp.id}
                  className='flex items-start justify-between p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow group'
                >
                  <div className='flex-1'>
                    <h3 className='font-semibold text-foreground mb-1'>
                      {comp.title}
                    </h3>
                    <p className='text-sm text-neutral-600 line-clamp-2'>
                      {comp.text}
                    </p>
                  </div>
                  <div className='flex gap-1 ml-4'>
                    <button
                      onClick={() => {
                        setCompEditTarget(comp);
                        setCompEditTitle(comp.title);
                        setCompEditText(comp.text);
                      }}
                      className='p-2 rounded-md hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity'
                      title='Edit'
                    >
                      <LuPencil className='w-4 h-4 text-neutral-700' />
                    </button>
                    <button
                      onClick={() => setPreviewResource(comp)}
                      className='p-2 rounded-md hover:bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity'
                      title='Preview'
                    >
                      <LuEye className='w-4 h-4 text-neutral-700' />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteResource(comp.id, 'comprehension')
                      }
                      disabled={deleteComprehensionMutation.isPending}
                      className='p-2 rounded-md hover:bg-error-50 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed'
                      title='Delete'
                    >
                      <LuX
                        className={`w-4 h-4 ${
                          deleteComprehensionMutation.isPending
                            ? 'text-neutral-400'
                            : 'text-error-600'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* {comprehensions.length === 0 && !showComprehensionForm && ( */}

          {compEditTarget && (
            <div className='border border-primary-200 bg-primary-50 rounded-lg p-4 flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='text-sm font-semibold text-primary-800'>
                    Edit comprehension
                  </h4>
                  <p className='text-xs text-neutral-700'>
                    Update the title or content.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    setCompEditTarget(null);
                    setCompEditTitle('');
                    setCompEditText('');
                  }}
                  className='p-1.5 rounded-full hover:bg-primary-100'
                  title='Close edit'
                >
                  <LuX className='w-4 h-4 text-primary-700' />
                </button>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='comp-edit-title'
                  className='text-sm font-medium text-neutral-800'
                >
                  Title
                </label>
                <input
                  id='comp-edit-title'
                  type='text'
                  value={compEditTitle}
                  onChange={(e) => setCompEditTitle(e.target.value)}
                  className='px-3 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white'
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='comp-edit-text'
                  className='text-sm font-medium text-neutral-800'
                >
                  Content
                </label>
                <textarea
                  id='comp-edit-text'
                  rows={6}
                  value={compEditText}
                  onChange={(e) => setCompEditText(e.target.value)}
                  className='px-3 py-2 border border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white resize-none'
                />
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  disabled={updateComprehensionMutation.isPending}
                  onClick={() => {
                    if (!compEditTarget) return;
                    if (!compEditTitle.trim() || !compEditText.trim()) {
                      toast.error('Please provide both title and content');
                      return;
                    }

                    updateComprehensionMutation.mutate(
                      {
                        comprehensionId: compEditTarget.id,
                        payload: {
                          title: compEditTitle.trim(),
                          content: compEditText.trim(),
                        },
                      },
                      {
                        onSuccess: (res) => {
                          const updated = mapComprehension(res.data);
                          setComprehensions((prev) => {
                            const next = prev.map((c) =>
                              c.id === compEditTarget.id ? updated : c,
                            );
                            onResourcesChange?.([...diagrams, ...next]);
                            return next;
                          });
                          setCompEditTarget(null);
                          setCompEditTitle('');
                          setCompEditText('');
                          queryClient.invalidateQueries({
                            queryKey: ['questionBankResources', bankId],
                          });
                        },
                      },
                    );
                  }}
                >
                  {updateComprehensionMutation.isPending
                    ? 'Saving...'
                    : 'Save changes'}
                </Button>
                <button
                  type='button'
                  onClick={() => {
                    setCompEditTarget(null);
                    setCompEditTitle('');
                    setCompEditText('');
                  }}
                  className='px-3 py-2 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-md hover:bg-neutral-100'
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {comprehensions.length === 0 &&
            !showComprehensionForm &&
            !compEditTarget &&
            !isResourcesLoading && (
              <div className='text-center py-8 text-neutral-500'>
                No comprehension passages added yet
              </div>
            )}
        </div>
      )}

      {/* Preview Modal */}
      {previewResource && (
        <div
          className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4'
          onClick={() => setPreviewResource(null)}
        >
          <div
            className='bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-xl font-semibold'>
                {previewResource.type === 'diagram'
                  ? 'Diagram Preview'
                  : 'Comprehension Passage'}
              </h3>
              <button
                onClick={() => setPreviewResource(null)}
                className='p-2 hover:bg-neutral-100 rounded-full'
                aria-label='Close preview'
              >
                <LuX className='w-5 h-5' />
              </button>
            </div>
            {previewResource.type === 'diagram' ? (
              <div>
                <div className='relative w-full min-h-[300px]'>
                  <Image
                    src={previewResource.url}
                    alt={previewResource.name}
                    width={800}
                    height={600}
                    className='w-full h-auto rounded-lg'
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <p className='text-sm text-neutral-600 mt-2'>
                  {previewResource.name}
                </p>
              </div>
            ) : (
              <div>
                <h4 className='text-lg font-medium mb-3'>
                  {previewResource.title}
                </h4>
                <p className='text-neutral-700 whitespace-pre-wrap'>
                  {previewResource.text}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceUploadSection;
