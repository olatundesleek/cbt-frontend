"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, Resolver, Controller } from 'react-hook-form';
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
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const loginBannerInputRef = useRef<HTMLInputElement | null>(null);

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

    const payload: Partial<SystemSettings> = {
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

    if (wantsDeleteLogo) payload.logoUrl = '';
    if (wantsDeleteFavicon) payload.faviconUrl = '';
    if (wantsDeleteLoginBanner) payload.loginBannerUrl = '';

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
    </section>
  );
}
