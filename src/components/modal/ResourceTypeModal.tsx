'use client';

import React, { useState } from 'react';
import Modal from './index';
import { LuImage, LuFileText, LuCheck } from 'react-icons/lu';

export interface DiagramResource {
  id: string;
  type: 'diagram';
  url: string;
  name: string;
}

export interface ComprehensionResource {
  id: string;
  type: 'comprehension';
  title: string;
  text: string;
}

export type Resource = DiagramResource | ComprehensionResource;

interface ResourceTypeModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectResource: (resource: Resource) => void;
  availableResources: {
    diagrams: DiagramResource[];
    comprehensions: ComprehensionResource[];
  };
}

/**
 * Modal component for selecting existing resources from the question bank
 * Shows uploaded diagrams and comprehension passages that can be attached to questions
 */
const ResourceTypeModal = ({
  isOpen,
  setIsOpen,
  onSelectResource,
  availableResources,
}: ResourceTypeModalProps) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'comprehension'>(
    'diagram',
  );
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  const handleConfirmSelection = () => {
    if (selectedResource) {
      onSelectResource(selectedResource);
      setSelectedResource(null);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setSelectedResource(null);
    setIsOpen(false);
  };

  const hasDiagrams = availableResources.diagrams.length > 0;
  const hasComprehensions = availableResources.comprehensions.length > 0;

  return (
    <Modal modalIsOpen={isOpen} setModalIsOpen={setIsOpen}>
      <div className='flex flex-col gap-4 p-6 max-h-[80vh]'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Select Resource
          </h2>
          <p className='text-sm text-neutral-600'>
            Choose a resource from your question bank to attach to this question
          </p>
        </div>

        {!hasDiagrams && !hasComprehensions ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4'>
              <LuImage className='w-8 h-8 text-neutral-400' />
            </div>
            <h3 className='text-lg font-medium text-foreground mb-2'>
              No Resources Available
            </h3>
            <p className='text-sm text-neutral-600 max-w-md'>
              Upload diagrams or add comprehension passages in the resources
              section first before attaching them to questions.
            </p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className='flex gap-2 border-b border-neutral-200'>
              {hasDiagrams && (
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
                    Diagrams ({availableResources.diagrams.length})
                  </div>
                </button>
              )}
              {hasComprehensions && (
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
                    Passages ({availableResources.comprehensions.length})
                  </div>
                </button>
              )}
            </div>

            {/* Content */}
            <div className='flex-1 overflow-auto'>
              {/* Diagram Tab */}
              {activeTab === 'diagram' && hasDiagrams && (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                  {availableResources.diagrams.map((diagram) => (
                    <button
                      key={diagram.id}
                      onClick={() => setSelectedResource(diagram)}
                      className={`relative border-2 rounded-lg overflow-hidden hover:shadow-md transition-all ${
                        selectedResource?.id === diagram.id
                          ? 'border-primary-500 ring-2 ring-primary-200'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <img
                        src={diagram.url}
                        alt={diagram.name}
                        className='w-full h-24 object-cover'
                      />
                      <div className='p-2 bg-white'>
                        <p className='text-xs text-neutral-600 truncate'>
                          {diagram.name}
                        </p>
                      </div>
                      {selectedResource?.id === diagram.id && (
                        <div className='absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center'>
                          <LuCheck className='w-4 h-4 text-white' />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Comprehension Tab */}
              {activeTab === 'comprehension' && hasComprehensions && (
                <div className='flex flex-col gap-3'>
                  {availableResources.comprehensions.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedResource(comp)}
                      className={`text-left p-4 border-2 rounded-lg hover:shadow-md transition-all ${
                        selectedResource?.id === comp.id
                          ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex-1'>
                          <h3 className='font-semibold text-foreground mb-1 flex items-center gap-2'>
                            {comp.title}
                            {selectedResource?.id === comp.id && (
                              <LuCheck className='w-4 h-4 text-primary-600' />
                            )}
                          </h3>
                          <p className='text-sm text-neutral-600 line-clamp-2'>
                            {comp.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className='flex justify-end gap-2 pt-4 border-t border-neutral-200'>
          <button
            onClick={handleClose}
            type='button'
            className='px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors'
          >
            Cancel
          </button>
          {(hasDiagrams || hasComprehensions) && (
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedResource}
              className='px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Attach Resource
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ResourceTypeModal;
