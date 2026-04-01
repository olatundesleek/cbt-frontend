import { useAdminUpdateAnyProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useForm } from 'react-hook-form';

interface UpdateAnyProfileFormValues {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
}

interface UpdateAnyProfileInitialData {
  id: number;
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

interface UpdateAnyProfileAdminProps {
  initialData?: UpdateAnyProfileInitialData;
  onClose?: () => void;
  //   onSubmit?: (data: UserProfile) => Promise<void>;
  //   isLoading?: boolean;
}

export default function UpdateAnyProfileAdmin({
  initialData = {
    id: 0,
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
  },
  onClose,
}: UpdateAnyProfileAdminProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateAnyProfileFormValues>({
    defaultValues: {
      username: initialData.username ?? '',
      firstname: initialData.firstname ?? '',
      lastname: initialData.lastname ?? '',
      email: initialData.email ?? '',
      phoneNumber: initialData.phoneNumber ?? '',
    },
  });

  const {
    mutate: updateAnyProfile,
    isPending,
    isSuccess,
  } = useAdminUpdateAnyProfile(onClose);

  const onValidSubmit = async (data: UpdateAnyProfileFormValues) => {
    const { username, firstname, lastname, email, phoneNumber } = data;

    updateAnyProfile({
      data: { username, firstname, lastname, email, phoneNumber },
      userId: initialData.id,
    });
    if (!isPending && isSuccess) {
      console.log('running');
      onClose?.();
    }
  };

  const isFormLoading = isPending || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onValidSubmit)}
      className='space-y-4 max-w-md mx-auto p-6'
    >
      <div>
        <label htmlFor='username' className='block text-sm font-medium mb-1'>
          Username
        </label>
        <input
          id='username'
          type='text'
          {...register('username', {
            required: 'Username is required',
          })}
          disabled={isFormLoading}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
        />
        {errors.username && (
          <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='firstname' className='block text-sm font-medium mb-1'>
          First Name
        </label>
        <input
          id='firstname'
          type='text'
          {...register('firstname', {
            required: 'First name is required',
          })}
          disabled={isFormLoading}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
        />
        {errors.firstname && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.firstname.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor='lastname' className='block text-sm font-medium mb-1'>
          Last Name
        </label>
        <input
          id='lastname'
          type='text'
          {...register('lastname', {
            required: 'Last name is required',
          })}
          disabled={isFormLoading}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
        />
        {errors.lastname && (
          <p className='text-red-500 text-sm mt-1'>{errors.lastname.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='email' className='block text-sm font-medium mb-1'>
          Email
        </label>
        <input
          id='email'
          type='email'
          {...register('email')}
          disabled={isFormLoading}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
        />
      </div>

      <div>
        <label htmlFor='phoneNumber' className='block text-sm font-medium mb-1'>
          Phone Number
        </label>
        <input
          id='phoneNumber'
          type='tel'
          {...register('phoneNumber')}
          disabled={isFormLoading}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
        />
      </div>

      <button
        type='submit'
        disabled={isFormLoading}
        className='w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {isFormLoading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
