'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';
import SpinnerMini from '@/components/ui/SpinnerMini';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface LoginFormData {
  id: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { replace } = useRouter();

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
      replace('/dashboard');
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col lg:flex-row'>
      {/* Image Section - Hidden on mobile */}
      <div className='hidden lg:flex lg:w-1/2 relative'>
        <Image
          src='/images/studentloginimage.png'
          alt='Student Login'
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Form Section */}
      <div className='flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-background'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-foreground'>
            Student Login
          </h2>
          <p className='mt-2 text-center text-sm text-neutral-600'>
            Welcome back! Please enter your details to continue.
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-foreground'
              >
                Student ID
              </label>
              <div className='mt-1'>
                <input
                  id='id'
                  type='text'
                  autoComplete='off'
                  placeholder='1a209s97s655'
                  required
                  className='block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm 
                           focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                           bg-background text-foreground'
                  {...register('id', {
                    required: 'ID is required',
                    // pattern: {
                    //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    //   message: 'Invalid email address',
                    // },
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
              <Button type='submit' disabled={isLoading}>
                {isLoading ? (
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

          <p className='mt-8 text-center text-sm text-neutral-600'>
            Not a student?{' '}
            <Link
              href='/admin/login'
              className='font-medium text-primary-600 hover:text-primary-500'
            >
              Login as admin/teacher
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
