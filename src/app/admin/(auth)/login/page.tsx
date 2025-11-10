'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual login logic
      console.log('Login data:', data);
      toast.success('Login successful!');
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col lg:flex-row'>
      {/* Image Section - Hidden on mobile */}
      <div className='hidden lg:flex lg:w-1/2 relative'>
        <Image
          src='/images/adminloginimage.png'
          alt='Admin Login'
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Form Section */}
      <div className='flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-background'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-foreground'>
            Admin/Teacher Login
          </h2>
          <p className='mt-2 text-center text-sm text-neutral-600'>
            Sign in to manage exams and students
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-foreground'
              >
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm 
                           focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                           bg-background text-foreground'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-error-500'>
                    {errors.email.message}
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
                  className='block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm
                           focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                           bg-background text-foreground'
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
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
                  className='h-4 w-4 rounded border-neutral-300 text-primary-600 
                           focus:ring-primary-500'
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
              <button
                type='submit'
                disabled={isLoading}
                className='flex w-full justify-center rounded-md bg-primary-600 px-3 py-2
                         text-sm font-semibold text-white shadow-sm hover:bg-primary-500
                         focus-visible:outline-2 focus-visible:outline-offset-2 
                         focus-visible:outline-primary-600 disabled:opacity-50 
                         disabled:cursor-not-allowed'
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <p className='mt-8 text-center text-sm text-neutral-600'>
            Are you a student?{' '}
            <Link
              href='/'
              className='font-medium text-primary-600 hover:text-primary-500'
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
