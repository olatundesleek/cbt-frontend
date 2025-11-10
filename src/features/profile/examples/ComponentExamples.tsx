/**
 * Example: Using Profile Components in Other Parts of the App
 * This file demonstrates how to reuse profile components elsewhere
 */

import { ProfilePic } from '@/features/profile/components';
import { Card, Badge, Input } from '@/components/ui';

/**
 * Example 1: Using ProfilePic in a Header/Navbar
 */
export function UserDropdownExample() {
  return (
    <div className='flex items-center gap-3'>
      <ProfilePic size='sm' name='John Doe' imageUrl='/images/avatar.jpg' />
      <div>
        <p className='font-medium'>John Doe</p>
        <p className='text-sm text-neutral-600'>Student</p>
      </div>
    </div>
  );
}

/**
 * Example 2: Student Card Component
 */
export function StudentCardExample() {
  return (
    <Card>
      <div className='flex items-center gap-4'>
        <ProfilePic size='md' name='Jane Smith' />
        <div className='flex-1'>
          <h3 className='font-semibold'>Jane Smith</h3>
          <p className='text-sm text-neutral-600'>Computer Science • ND2</p>
          <div className='flex gap-2 mt-2'>
            <Badge variant='success' size='sm'>
              Active
            </Badge>
            <Badge variant='primary' size='sm'>
              Honor Roll
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Example 3: Quick Edit Form
 */
export function QuickEditFormExample() {
  return (
    <Card padding='lg'>
      <h3 className='text-lg font-semibold mb-4'>Quick Edit</h3>
      <div className='space-y-4'>
        <Input label='Display Name' placeholder='Enter your name' />
        <Input
          label='Email'
          type='email'
          placeholder='your@email.com'
          helperText='Used for notifications'
        />
        <Input label='Phone' type='tel' placeholder='080XXXXXXXX' />
      </div>
    </Card>
  );
}

/**
 * Example 4: Course List with Badges
 */
export function CourseListExample() {
  const courses = ['CSC 202', 'MTH 201', 'PHY 202', 'GST 201'];

  return (
    <Card>
      <h3 className='font-semibold mb-3'>Enrolled Courses</h3>
      <div className='flex flex-wrap gap-2'>
        {courses.map((course) => (
          <Badge key={course} variant='primary'>
            {course}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

/**
 * Example 5: User List Item
 */
export function UserListItemExample() {
  return (
    <div className='flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors'>
      <div className='flex items-center gap-3'>
        <ProfilePic size='md' name='Mike Johnson' />
        <div>
          <p className='font-medium'>Mike Johnson</p>
          <p className='text-sm text-neutral-600'>S98765432</p>
        </div>
      </div>
      <Badge variant='success' size='sm'>
        Online
      </Badge>
    </div>
  );
}

/**
 * Example 6: Settings Section
 */
export function SettingsSectionExample() {
  return (
    <div className='space-y-4'>
      <Card>
        <h3 className='font-semibold mb-4'>Notification Preferences</h3>
        <div className='space-y-3'>
          <label className='flex items-center gap-3'>
            <input type='checkbox' className='rounded' />
            <span>Email notifications</span>
          </label>
          <label className='flex items-center gap-3'>
            <input type='checkbox' className='rounded' />
            <span>SMS notifications</span>
          </label>
        </div>
      </Card>

      <Card>
        <h3 className='font-semibold mb-4'>Privacy</h3>
        <Input
          label='Profile Visibility'
          type='select'
          helperText='Control who can see your profile'
        />
      </Card>
    </div>
  );
}
