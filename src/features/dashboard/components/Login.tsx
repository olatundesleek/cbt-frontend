"use client";

import Image from "next/image";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import SpinnerMini from '@/components/ui/SpinnerMini';
import Button from '@/components/ui/Button';
import useLogin from '@/hooks/useLogin';
import { useSystemSettingsStore } from '@/store/useSystemSettingsStore';

interface LoginFormData {
  id: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoginPending } = useLogin();
  const settings = useSystemSettingsStore((store) => store.settings);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async ({ id, password }: LoginFormData) => {
    login({ username: id, password: password });
  };

  return (
    <div className='min-h-screen w-full flex flex-col lg:flex-row'>
      {/* Image Section - Hidden on mobile */}
      <div className='hidden lg:flex lg:w-1/2 relative'>
        <Image
          src={settings?.loginBannerUrl || '/images/studentloginimage.png'}
          alt='Login'
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Form Section */}
      <div className='flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-background'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h1 className='text-center font-black text-3xl text-primary-600'>
            {settings?.institutionName || 'CBT'}
          </h1>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-foreground'>
              Login
            </h2>
            <p className='mt-2 text-center text-sm text-neutral-600'>
              Welcome back! Please enter your details to continue.
            </p>
          </div>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-foreground'
              >
                Username / Student ID
              </label>
              <div className='mt-1'>
                <input
                  id='id'
                  type='text'
                  // autoComplete='off'
                  placeholder='52626263/mike001'
                  className='block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground'
                  {...register('id', {
                    required: 'Username is required',
                    maxLength: {
                      value: 10,
                      message: 'Username cannot be more than 10 characters',
                    },
                  })}
                />
                {errors.id && (
                  <p className='mt-1 text-sm text-error-500'>
                    {errors.id.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-foreground'
              >
                Password
              </label>
              <div className='mt-1 relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  className='block w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground'
                  {...register('password', {
                    required: 'Password is required',
                    // minLength: { ADMIN PASSWORDS ARE LESS THAN 6
                    //   value: 6,
                    //   message: 'Password must be at least 6 characters',
                    // },
                  })}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className='mt-1 text-sm text-error-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-neutral-700'
                >
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a
                  href='#'
                  className='font-medium text-primary-600 hover:text-primary-500'
                >
                  Forgot your password?
                </a>
              </div>
            </div> */}

            <div>
              <Button type='submit' disabled={isLoginPending}>
                {isLoginPending ? (
                  <>
                    <span className=' mr-2'>Signing in</span>
                    <SpinnerMini />
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
