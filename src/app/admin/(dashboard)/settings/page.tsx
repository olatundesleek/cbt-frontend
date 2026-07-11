'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/input';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm, Resolver, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { useRef } from 'react';
import {
  useAllBackups,
  useCreateBackup,
  useDeleteBackupFile,
  useDownloadBackupFile,
  useRestoreFromBackup,
  useSystemSettings,
  useUpdateSystemSettings,
  useUpdateSystemSettingsWithFiles,
  useUploadAndRestoreBackup,
} from '@/features/settings/hooks/useSettings';
import { useEffect, useState } from 'react';
import SpinnerMini from '@/components/ui/SpinnerMini';
import type { Backup, SystemSettings } from '@/types/settings.types';
import toast from 'react-hot-toast';
import getErrorDetails from '@/utils/getErrorDetails';
import Modal from '@/components/modal';
import {
  MdOutlineCancel,
  MdOutlineDelete,
  MdOutlineDownload,
  MdOutlineRestore,
} from 'react-icons/md';
import { CiWarning } from 'react-icons/ci';
import { ButtonIcon } from '@/components/ui';

const schema = Yup.object({
  appName: Yup.string().required('App Name is required'),
  institutionName: Yup.string().required('Institution Name is required'),
  shortName: Yup.string().required('Short Name is required'),
  supportEmail: Yup.string().required('Email is required'),
  primaryColor: Yup.string().optional(),
  systemStatus: Yup.string().optional(),
});

type FormProps = Yup.InferType<typeof schema>;

//Dummy data for backup and restore section, to be replaced with actual implementation when ready

export default function AdminSettingsPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm<FormProps>({
    defaultValues: {
      appName: '',
      institutionName: '',
      shortName: '',
      supportEmail: '',
      primaryColor: '#2563eb',
      systemStatus: 'active',
    },
    resolver: yupResolver(schema) as Resolver<FormProps>,
  });

  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    error: settingsError,
  } = useSystemSettings();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [loginBannerFile, setLoginBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [loginBannerPreview, setLoginBannerPreview] = useState<string | null>(
    null,
  );
  const [uploadBackupFile, setUploadBackupFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const loginBannerInputRef = useRef<HTMLInputElement | null>(null);
  const uploadBackupInputRef = useRef<HTMLInputElement | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    modalContent: Backup[] | File | null;
    type: 'backup' | 'upload' | null;
  }>({
    isOpen: false,
    modalContent: null,
    type: null,
  });

  const updateModalState = ({
    key,
    value,
  }: {
    key: keyof typeof modalState;
    value: (typeof modalState)[typeof key];
  }) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (settingsError) toast.error(getErrorDetails(settingsError));
  }, [settingsError]);

  useEffect(() => {
    if (!settingsData?.data) return;
    const settings = settingsData.data;
    reset({
      appName: settings.appName ?? '',
      institutionName: settings.institutionName ?? '',
      shortName: settings.shortName ?? '',
      supportEmail: settings.supportEmail ?? '',
      primaryColor: settings.primaryColor ?? '#2563eb',

      systemStatus: (settings.systemStatus as string | undefined)
        ? (settings.systemStatus as string).toLowerCase()
        : 'active',
    });

    // set previews only if provided (defer to avoid sync setState warnings)
    if (settings.logoUrl) {
      setTimeout(() => setLogoPreview(settings.logoUrl ?? null), 0);
    }
    if (settings.faviconUrl) {
      setTimeout(() => setFaviconPreview(settings.faviconUrl ?? null), 0);
    }

    if (settings.loginBannerUrl) {
      setTimeout(
        () => setLoginBannerPreview(settings.loginBannerUrl ?? null),
        0,
      );
    }
  }, [settingsData, reset, getValues, setValue]);

  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateSystemSettings();
  const { mutate: updateWithFilesMutate } = useUpdateSystemSettingsWithFiles();

  const updateSettings: SubmitHandler<FormProps> = async (data) => {
    const normalizeStatus = (
      s?: string,
    ): SystemSettings['systemStatus'] | undefined => {
      const v = s?.toUpperCase();
      if (v === 'ACTIVE' || v === 'MAINTENANCE') return v;
      return undefined;
    };

    const payload: Partial<SystemSettings> & {
      logoUrl?: string | null;
      faviconUrl?: string | null;
      loginBannerUrl?: string | null;
    } = {
      appName: data.appName,
      institutionName: data.institutionName,
      shortName: data.shortName,
      supportEmail: data.supportEmail,
      primaryColor: data.primaryColor,
      systemStatus: normalizeStatus(data.systemStatus),
    };
    // If user removed an existing image (no preview and no new file),
    // include an explicit empty value in payload and use the multipart
    // mutation so the backend receives the instruction to clear it.
    const origLogoUrl = settingsData?.data?.logoUrl ?? null;
    const origFaviconUrl = settingsData?.data?.faviconUrl ?? null;
    const origLoginBannerUrl = settingsData?.data?.loginBannerUrl ?? null;

    const wantsDeleteLogo = !!origLogoUrl && !logoPreview && !logoFile;
    const wantsDeleteFavicon =
      !!origFaviconUrl && !faviconPreview && !faviconFile;
    const wantsDeleteLoginBanner =
      !!origLoginBannerUrl && !loginBannerPreview && !loginBannerFile;

    if (wantsDeleteLogo) payload.logoUrl = null;
    if (wantsDeleteFavicon) payload.faviconUrl = null;
    if (wantsDeleteLoginBanner) payload.loginBannerUrl = null;

    // If files are present or user requested deletion, send multipart PATCH to /system-settings
    if (
      logoFile ||
      faviconFile ||
      loginBannerFile ||
      wantsDeleteLogo ||
      wantsDeleteFavicon ||
      wantsDeleteLoginBanner
    ) {
      updateWithFilesMutate({
        payload,
        logoFile: logoFile ?? undefined,
        faviconFile: faviconFile ?? undefined,
        loginBannerFile: loginBannerFile ?? undefined,
      });
      return;
    }

    // no files - simple JSON PATCH
    updateMutate(payload);
  };

  //Get all backups for backup and restore section
  const {
    data: allBackupsData,
    refetch: refetchAllBackups,
    isFetching: isFetchingAllBackups,
    isPending: isPendingAllBackups,
  } = useAllBackups(modalState.isOpen && modalState.type === 'backup');

  if (isSettingsLoading) return <SpinnerMini />;

  return (
    <section className='flex flex-col gap-4 w-full'>
      <h1 className='text-4xl text-foreground font-bold'>System Settings</h1>

      <form
        onSubmit={handleSubmit(updateSettings)}
        className='flex flex-col gap-3 w-full'
      >
        <Controller
          control={control}
          name='appName'
          defaultValue={''}
          render={({ field }) => (
            <Input
              label='App Name'
              {...field}
              errorText={
                (errors.appName && (errors?.appName.message as string)) ||
                undefined
              }
            />
          )}
        />

        <Controller
          control={control}
          name='institutionName'
          defaultValue={''}
          render={({ field }) => (
            <Input
              label='Institution Name'
              {...field}
              errorText={
                (errors.institutionName &&
                  (errors?.institutionName.message as string)) ||
                undefined
              }
            />
          )}
        />

        <Controller
          control={control}
          name='shortName'
          defaultValue={''}
          render={({ field }) => (
            <Input
              label='Short Name'
              {...field}
              errorText={
                (errors.shortName && (errors?.shortName.message as string)) ||
                undefined
              }
            />
          )}
        />

        <Controller
          control={control}
          name='supportEmail'
          defaultValue={''}
          render={({ field }) => (
            <Input
              label='Support Email'
              {...field}
              errorText={
                (errors.supportEmail &&
                  (errors?.supportEmail.message as string)) ||
                undefined
              }
            />
          )}
        />

        {/* Logo & Favicon uploads */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-700'>Upload Logo</label>
            <input
              ref={logoInputRef}
              type='file'
              accept='image/*'
              aria-label='upload-logo'
              className='hidden'
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setLogoFile(f);
                if (f) setLogoPreview(URL.createObjectURL(f));
              }}
            />
            <div className='flex items-center gap-4 border border-neutral-300 py-2 px-4 rounded'>
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt='logo preview'
                  className='h-10 object-contain'
                />
              ) : (
                <div className='h-10 w-40 bg-neutral-100 flex items-center justify-center text-sm text-neutral-500 border border-dashed border-neutral-400 rounded'>
                  No logo
                </div>
              )}

              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => logoInputRef.current?.click()}
                  className='border border-neutral-400 py-1 px-4 rounded cursor-pointer text-neutral-600 text-sm'
                >
                  {logoPreview ? 'Change' : 'Choose File'}
                </button>
                {logoPreview && (
                  <button
                    type='button'
                    className='border border-neutral-400 py-1 px-4 rounded cursor-pointer text-red-600 text-sm'
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                      if (logoInputRef.current) logoInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-700'>Upload Favicon</label>
            <input
              ref={faviconInputRef}
              type='file'
              accept='image/*'
              aria-label='upload-favicon'
              className='hidden'
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFaviconFile(f);
                if (f) setFaviconPreview(URL.createObjectURL(f));
              }}
            />
            <div className='flex items-center gap-4 border border-neutral-300 py-2 px-4 rounded'>
              {faviconPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={faviconPreview}
                  alt='favicon preview'
                  className='h-10 w-12 object-contain'
                />
              ) : (
                <div className='h-10 w-40 bg-neutral-100 flex items-center justify-center text-sm text-neutral-500 border border-dashed border-neutral-400 rounded'>
                  No favicon
                </div>
              )}

              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => faviconInputRef.current?.click()}
                  className='border border-neutral-400 py-1 px-4 rounded cursor-pointer text-neutral-600 text-sm'
                >
                  {faviconPreview ? 'Change' : 'Upload'}
                </button>
                {faviconPreview && (
                  <button
                    type='button'
                    className='border border-neutral-400 py-1 px-4 rounded cursor-pointer text-red-600 text-sm'
                    onClick={() => {
                      setFaviconFile(null);
                      setFaviconPreview(null);
                      if (faviconInputRef.current)
                        faviconInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-700'>
              Upload Login Banner
            </label>
            <input
              ref={loginBannerInputRef}
              type='file'
              accept='image/*'
              aria-label='upload-login-banner'
              className='hidden'
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setLoginBannerFile(f);
                if (f) setLoginBannerPreview(URL.createObjectURL(f));
              }}
            />
            <div className='flex items-center gap-4 border border-neutral-300 py-2 px-4 rounded'>
              {loginBannerPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={loginBannerPreview}
                  alt='login banner preview'
                  className='h-10 w-12 object-contain'
                />
              ) : (
                <div className='h-10 w-40 bg-neutral-100 flex items-center justify-center text-sm text-neutral-500 border border-dashed border-neutral-400 rounded'>
                  No login banner
                </div>
              )}

              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => loginBannerInputRef.current?.click()}
                  className='border border-neutral-400 py-1 px-4 rounded cursor-pointer text-neutral-600 text-sm'
                >
                  {loginBannerPreview ? 'Change' : 'Upload'}
                </button>
                {loginBannerPreview && (
                  <button
                    type='button'
                    className='border border-neutral-400 py-1 px-4 rounded cursor-pointer text-red-600 text-sm'
                    onClick={() => {
                      setLoginBannerFile(null);
                      setLoginBannerPreview(null);
                      if (loginBannerInputRef.current)
                        loginBannerInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Backup Implementation */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm text-neutral-700'>
              Backup And Restore
            </label>

            <div className='flex items-center gap-4 border border-neutral-300 py-2 px-4 rounded'>
              <div className='flex gap-4 items-end'>
                <>
                  <input
                    type='file'
                    ref={uploadBackupInputRef}
                    accept='.sql, text/x-sql, application/sql, text/sql'
                    name='sql_file'
                    className='hidden'
                    onChange={(e) => {
                      const backupFile = e.target.files?.[0] ?? null;
                      setUploadBackupFile(backupFile);

                      if (backupFile) {
                        setModalState((prev) => ({
                          ...prev,
                          isOpen: true,
                          modalContent: backupFile,
                          type: 'upload',
                        }));
                      }
                    }}
                  />
                  {uploadBackupFile ? (
                    <div className='flex items-center gap-2 border border-neutral-400 py-1 px-2 rounded text-neutral-600 text-sm'>
                      <span>{uploadBackupFile.name.slice(0, 10)}...</span>
                      <ButtonIcon
                        ariaLabel='remove-file'
                        onClick={() => {
                          toast.success('Deleting');
                          if (uploadBackupInputRef.current?.value)
                            uploadBackupInputRef.current.value = '';
                          setUploadBackupFile(null);
                        }}
                      >
                        <MdOutlineCancel className=' ml-1 font-extrabold text-2xl text-error-500/50 hover:text-error-500' />
                      </ButtonIcon>
                    </div>
                  ) : (
                    <button
                      type='button'
                      onClick={() => {
                        uploadBackupInputRef.current?.click();
                      }}
                      className='border border-neutral-400 py-1 px-4 rounded cursor-pointer text-neutral-600 text-sm'
                    >
                      Upload and Restore Backup
                    </button>
                  )}
                </>

                <button
                  type='button'
                  className='border border-neutral-400 py-1 px-4 rounded cursor-pointer text-primary-600 text-sm'
                  onClick={() => {
                    updateModalState({
                      key: 'isOpen',
                      value: true,
                    });

                    updateModalState({
                      key: 'modalContent',
                      value: allBackupsData?.data.backups ?? [],
                    });

                    updateModalState({
                      key: 'type',
                      value: 'backup',
                    });

                    refetchAllBackups();
                  }}
                >
                  Backup
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Color picker and toggles */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-end'>
          <div className='flex flex-col'>
            <label className='text-sm text-neutral-700'>Primary Color</label>
            <div className='border border-neutral-300 rounded'>
              <Controller
                control={control}
                name='primaryColor'
                defaultValue={'#2563eb'}
                render={({ field }) => (
                  <input
                    aria-label='primary-color'
                    type='color'
                    {...field}
                    className='h-10 w-20 mt-1 cursor-pointer'
                  />
                )}
              />
            </div>
          </div>

          <div className='flex flex-col'>
            <label className='text-sm text-neutral-700'>System Status</label>
            <div className='flex gap-3 h-12 items-center border border-neutral-300 rounded px-2 py-4'>
              <label className='flex items-center gap-1'>
                <Controller
                  control={control}
                  name='systemStatus'
                  defaultValue={'active'}
                  render={({ field }) => (
                    <input
                      aria-label='status-active'
                      type='radio'
                      value='active'
                      checked={field.value === 'active'}
                      onChange={() => field.onChange('active')}
                    />
                  )}
                />
                <span className='text-sm'>Active</span>
              </label>
              <label className='flex items-center gap-1'>
                <Controller
                  control={control}
                  name='systemStatus'
                  defaultValue={'active'}
                  render={({ field }) => (
                    <input
                      aria-label='status-maintenance'
                      type='radio'
                      value='maintenance'
                      checked={field.value === 'maintenance'}
                      onChange={() => field.onChange('maintenance')}
                    />
                  )}
                />
                <span className='text-sm'>Maintenance</span>
              </label>
            </div>
          </div>
        </div>

        <Button type='submit' disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Save'}
        </Button>
      </form>

      <Modal
        modalIsOpen={modalState.isOpen}
        setModalIsOpen={(v) =>
          updateModalState({ key: 'isOpen', value: v as boolean })
        }
      >
        {modalState.type === 'backup' ? (
          <Backup
            initialBackupData={allBackupsData?.data.backups ?? []}
            isPending={isPendingAllBackups}
            isFetching={isFetchingAllBackups}
          />
        ) : (
          <UploadAndRestoreBackup
            initialBackupData={(modalState.modalContent as File) ?? null}
            onCancel={() => {
              setUploadBackupFile(null);
              if (uploadBackupInputRef.current?.value)
                uploadBackupInputRef.current.value = '';
              setModalState((prev) => ({
                ...prev,
                isOpen: false,
                modalContent: null,
              }));
            }}
            onUpload={() => {
              setUploadBackupFile(null);
              if (uploadBackupInputRef.current?.value)
                uploadBackupInputRef.current.value = '';
            }}
          />
        )}
      </Modal>
    </section>
  );
}

function Backup({
  initialBackupData,
  isPending,
  isFetching,
}: {
  initialBackupData: Backup[];
  isPending: boolean;
  isFetching: boolean;
}) {
  const { mutate: restoreFromBackup, isPending: isRestoringFromBackup } =
    useRestoreFromBackup();
  const downloadBackupFile = useDownloadBackupFile();
  const { mutate: deleteBackupFile, isPending: isDeletingBackup } =
    useDeleteBackupFile();
  const { mutate: createBackup, isPending: isCreatingBackup } =
    useCreateBackup();

  const handleDownloadBackup = (filename: string) => {
    if (!initialBackupData) {
      toast.error('No backup file selected');
      return;
    }

    // Call the service function to download the backup file
    downloadBackupFile(filename);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='mt-4 mb-2 text-lg font-semibold'>Backup</h2>
        <div>
          <Button onClick={() => createBackup()} disabled={isCreatingBackup}>
            {isCreatingBackup ? 'Creating...' : 'Create Backup'}
          </Button>
        </div>
      </div>

      {isPending || isFetching ? (
        <div className='flex items-center justify-center h-40'>
          <SpinnerMini color='text-primary-500' />
        </div>
      ) : (
        <div className='space-y-4'>
          {initialBackupData.length > 0 ? (
            initialBackupData.map((backup) => (
              <div
                key={backup.filename}
                className='border border-neutral-300 p-4 shadow-lg rounded flex gap-2 items-center justify-between'
              >
                <div>
                  <p>{backup.filename}</p>
                  <p className='text-sm text-neutral-500'>
                    Created At: {new Date(backup.createdAt).toLocaleString()}
                  </p>
                  <p className='text-sm text-neutral-500'>
                    Size: {(backup.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className='flex gap-4 mt-2'>
                  <ButtonIcon
                    onClick={() =>
                      restoreFromBackup({ filename: backup.filename })
                    }
                    ariaLabel='restore'
                    disabled={isRestoringFromBackup}
                  >
                    <MdOutlineRestore className='inline-block ml-1 font-extrabold text-2xl text-primary-600' />
                  </ButtonIcon>
                  <ButtonIcon
                    onClick={() => handleDownloadBackup(backup.filename)}
                    ariaLabel='download'
                  >
                    <MdOutlineDownload className='inline-block ml-1 font-extrabold text-2xl text-primary-600' />
                  </ButtonIcon>

                  <ButtonIcon
                    // className='text-red-600 cursor-pointer'ss
                    onClick={() => deleteBackupFile(backup.filename)}
                    ariaLabel='delete'
                    disabled={isDeletingBackup}
                  >
                    <MdOutlineDelete className='inline-block ml-1 font-extrabold text-2xl text-error-500' />
                  </ButtonIcon>
                </div>
              </div>
            ))
          ) : (
            <span className='text-sm text-nuetral-500 mb-4'>
              No backup data
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function UploadAndRestoreBackup({
  initialBackupData,
  onUpload,
  onCancel,
}: {
  initialBackupData: File | null;
  onUpload?: () => void;
  onCancel?: () => void;
}) {
  const { mutate: uploadAndRestoreBackup, isPending: isUploadingAndRestoring } =
    useUploadAndRestoreBackup();

  const handleUploadBackup = () => {
    if (!initialBackupData) {
      toast.error('No backup file selected');
      return;
    }

    uploadAndRestoreBackup(
      { backupFile: initialBackupData },
      {
        onSuccess: (data) => {
          toast.success(
            data.message ||
              'Backup uploaded and restore initiated successfully',
          );
          onUpload?.();
        },
        onError: (error) => {
          toast.error(
            `Failed to upload and restore backup: ${getErrorDetails(error)}`,
          );
        },
      },
    );
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-cente justify-between'>
        <h2 className='mb-2 text-lg font-semibold'>
          Upload and Restore Backup
        </h2>
        <CiWarning className='inline-block ml-1 font-extrabold text-3xl text-error-500' />
      </div>

      <p className='text-sm text-error-500 mb-4'>
        Upload a backup file to restore the system to a previous state. Please
        ensure that you have a valid backup file before proceeding. This action
        will overwrite existing data and cannot be undone.
      </p>

      <div className='flex items-center gap-2 border border-neutral-400 py-4 px-2 rounded text-neutral-600 text-md'>
        <span>{initialBackupData ? initialBackupData.name : ''}</span>
      </div>
      <div className='flex gap-4 justify-end'>
        <div>
          <Button
            variant='danger'
            onClick={() => {
              onCancel?.();
            }}
          >
            Cancel
          </Button>
        </div>

        <div>
          <Button
            onClick={() => {
              handleUploadBackup();
            }}
            disabled={isUploadingAndRestoring}
          >
            {isUploadingAndRestoring ? 'Uploading...' : 'Upload Backup'}
          </Button>
        </div>
      </div>
    </div>
  );
}
