"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import SpinnerMini from "@/components/ui/SpinnerMini";
import Button from "@/components/ui/Button";
import useLogin from "@/hooks/useLogin";
import { useSystemSettingsStore } from '@/store/useSystemSettingsStore';

interface LoginFormData {
  id: string;
  password: string;
}

export default function Login() {
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
              <div className='mt-1'>
                <input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground'
                  {...register('password', {
                    required: 'Password is required',
                    // minLength: { ADMIN PASSWORDS ARE LESS THAN 6
                    //   value: 6,
                    //   message: 'Password must be at least 6 characters',
                    // },
                  })}
                />
                {errors.password && (
                  <p className='mt-1 text-sm text-error-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center justify-between'>
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
            </div>

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
