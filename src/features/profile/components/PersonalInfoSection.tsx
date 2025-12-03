import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/features/profile/components/Input';
import Button from '@/components/ui/Button';
import { PersonalInformation } from '@/types/profile.types';

interface PersonalInfoSectionProps {
  data: PersonalInformation;
  onSave?: (data: PersonalInformation) => void;
  isLoading?: boolean;
  isMutating?: boolean;
}

/**
 * PersonalInfoSection Component
 * Displays and allows editing of personal information
 */
export default function PersonalInfoSection({
  data,
  onSave,
  isLoading = false,
  isMutating = false,
}: PersonalInfoSectionProps) {
  const [formData, setFormData] = useState<PersonalInformation>(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof PersonalInformation, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  return (
    <Card>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-neutral-900'>
          Personal Information
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className='text-sm text-primary-600 hover:text-primary-700 font-medium'
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='First Name'
            type='text'
            value={formData.firstname || ''}
            onChange={(e) => handleChange('firstname', e.target.value)}
            disabled={!isEditing}
            placeholder='First name'
          />
          <Input
            label='Last Name'
            type='text'
            value={formData.lastname || ''}
            onChange={(e) => handleChange('lastname', e.target.value)}
            disabled={!isEditing}
            placeholder='Last name'
          />
        </div>
        <Input
          label='Username / Student ID'
          type='text'
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          disabled={!isEditing}
          className={!isEditing ? 'bg-neutral-50' : ''}
        />

        <Input
          label='Email'
          type='email'
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={!isEditing}
          placeholder='Not provided - Add your email'
        />

        <Input
          label='Phone Number'
          type='tel'
          value={formData.phoneNumber || ''}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          disabled={!isEditing}
          placeholder='Not provided - Add your phone'
        />

        {/* <Input
          label='Address'
          type='text'
          value={formData.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          disabled={!isEditing}
          placeholder='Not provided - Add your address'
        /> */}

        {isEditing && (
          <div className='flex gap-3 pt-2'>
            <Button type='submit' disabled={isLoading}>
              {isLoading || isMutating ? 'Saving...' : 'Save Changes'}
            </Button>
            <button
              type='button'
              onClick={handleCancel}
              className='px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-400 transition-colors duration-200 font-medium'
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </Card>
  );
}
