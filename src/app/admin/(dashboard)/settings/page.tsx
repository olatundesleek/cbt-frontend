"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, Resolver } from 'react-hook-form';
import * as Yup from 'yup';
import { useRef } from 'react';
import {
  useSystemSettings,
  useUpdateSystemSettings,
  useUpdateSystemSettingsWithFiles,
} from '@/features/settings/hooks/useSettings';
import { useEffect, useState } from 'react';
import { errorLogger } from '@/lib/axios';
import SpinnerMini from '@/components/ui/SpinnerMini';
import type { SystemSettings } from '@/types/settings.types';

const schema = Yup.object({
  appName: Yup.string().required('App Name is required'),
  institutionName: Yup.string().required('Institution Name is required'),
  shortName: Yup.string().required('Short Name is required'),
  supportEmail: Yup.string().required('Email is required'),
  primaryColor: Yup.string().optional(),
  systemStatus: Yup.string().optional(),
});

type FormProps = Yup.InferType<typeof schema>;

export default function AdminSettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (settingsError) errorLogger(settingsError);
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
      systemStatus: (settings.systemStatus as string) ?? 'active',
    });
    // set previews only if provided (defer to avoid sync setState warnings)
    if (settings.logoUrl) {
      setTimeout(() => setLogoPreview(settings.logoUrl ?? null), 0);
    }
    if (settings.faviconUrl) {
      setTimeout(() => setFaviconPreview(settings.faviconUrl ?? null), 0);
    }
  }, [settingsData, reset]);

  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateSystemSettings();
  const { mutate: updateWithFilesMutate } = useUpdateSystemSettingsWithFiles();

  const updateSettings: SubmitHandler<FormProps> = async (data) => {
    const payload: Partial<SystemSettings> = {
      appName: data.appName,
      institutionName: data.institutionName,
      shortName: data.shortName,
      supportEmail: data.supportEmail,
      primaryColor: data.primaryColor,
      systemStatus: data.systemStatus?.toUpperCase(),
    };
    // If files are present, send multipart PATCH to /system-settings
    if (logoFile || faviconFile) {
      updateWithFilesMutate({
        payload,
        logoFile: logoFile ?? undefined,
        faviconFile: faviconFile ?? undefined,
      });
      return;
    }

    // no files - simple JSON PATCH
    updateMutate(payload);
  };

  if (isSettingsLoading) return <SpinnerMini />;

  return (
    <section className='flex flex-col gap-4 w-full'>
      <h1 className='text-4xl text-foreground font-bold'>System Settings</h1>

      <form
        onSubmit={handleSubmit(updateSettings)}
        className='flex flex-col gap-3 w-full'
      >
        <Input
          label='App Name'
          hookFormRegister={register}
          name='appName'
          errorText={
            (errors.appName && (errors?.appName.message as string)) || undefined
          }
        />

        <Input
          label='Institution Name'
          hookFormRegister={register}
          name='institutionName'
          errorText={
            (errors.institutionName &&
              (errors?.institutionName.message as string)) ||
            undefined
          }
        />

        <Input
          label='Short Name'
          hookFormRegister={register}
          name='shortName'
          errorText={
            (errors.shortName && (errors?.shortName.message as string)) ||
            undefined
          }
        />

        <Input
          label='Support Email'
          hookFormRegister={register}
          name='supportEmail'
          errorText={
            (errors.supportEmail && (errors?.supportEmail.message as string)) ||
            undefined
          }
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
            <div className='flex items-center gap-4'>
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt='logo preview'
                  className='h-20 object-contain'
                />
              ) : (
                <div className='h-20 w-40 bg-neutral-100 flex items-center justify-center text-sm text-neutral-500'>
                  No logo
                </div>
              )}

              <div className='flex flex-col'>
                <Button
                  type='button'
                  onClick={() => logoInputRef.current?.click()}
                >
                  {logoPreview ? 'Change' : 'Upload'}
                </Button>
                {logoPreview && (
                  <button
                    type='button'
                    className='mt-2 text-sm text-red-600'
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
            <div className='flex items-center gap-4'>
              {faviconPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={faviconPreview}
                  alt='favicon preview'
                  className='h-12 w-12 object-contain'
                />
              ) : (
                <div className='h-12 w-12 bg-neutral-100 flex items-center justify-center text-sm text-neutral-500'>
                  No favicon
                </div>
              )}

              <div className='flex flex-col'>
                <Button
                  type='button'
                  onClick={() => faviconInputRef.current?.click()}
                >
                  {faviconPreview ? 'Change' : 'Upload'}
                </Button>
                {faviconPreview && (
                  <button
                    type='button'
                    className='mt-2 text-sm text-red-600'
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
        </div>

        {/* Color picker and toggles */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-end'>
          <div className='flex flex-col'>
            <label className='text-sm text-neutral-700'>Primary Color</label>
            <input
              aria-label='primary-color'
              type='color'
              {...register('primaryColor')}
              className='h-10 w-20 mt-1'
            />
          </div>

          <div className='flex flex-col'>
            <label className='text-sm text-neutral-700'>System Status</label>
            <div className='flex gap-3 mt-2'>
              <label className='flex items-center gap-1'>
                <input
                  aria-label='status-active'
                  type='radio'
                  value='active'
                  {...register('systemStatus')}
                />
                <span className='text-sm'>Active</span>
              </label>
              <label className='flex items-center gap-1'>
                <input
                  aria-label='status-maintenance'
                  type='radio'
                  value='maintenance'
                  {...register('systemStatus')}
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
    </section>
  );
}
