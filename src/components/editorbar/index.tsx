import { EditorAction, EditorIcons } from '@/types/dashboard.types';
import { BsTypeBold } from 'react-icons/bs';
import { ImItalic } from 'react-icons/im';
import { FaUnderline } from 'react-icons/fa';
import { AiOutlineFontColors } from 'react-icons/ai';
import { PiFunction, PiTextT } from 'react-icons/pi';
import { MdOutlineFormatStrikethrough } from 'react-icons/md';
import { IoMdColorPalette } from 'react-icons/io';
import { useRef } from 'react';

const editorIcons: EditorIcons[] = [
  {
    label: 'Bold',
    icon: BsTypeBold,
    action: 'bold',
  },
  {
    label: 'Italic',
    icon: ImItalic,
    action: 'italic',
  },
  {
    label: 'Underline',
    icon: FaUnderline,
    action: 'underline',
  },
  {
    label: 'Accent Color',
    icon: AiOutlineFontColors,
    action: 'color',
  },
  {
    label: 'Strikethrough',
    icon: MdOutlineFormatStrikethrough,
    action: 'strike',
  },
  {
    label: 'Text',
    icon: PiTextT,
    action: 'text',
  },
  {
    label: 'Background',
    icon: IoMdColorPalette,
    action: 'background',
  },
  {
    label: 'Math',
    icon: PiFunction,
    action: 'math',
  },
];

export default function EditorBar({
  applyFormat,
  activeTab,
}: {
  applyFormat: (action: EditorAction, value?: string) => void;
  activeTab: Record<EditorAction, boolean>;
}) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const backgroundColorInputRef = useRef<HTMLInputElement>(null);

  const handleAction = (action: EditorAction) => {
    if (action === 'color' || action === 'background') {
      // Handle color picking logic here, e.g., open a color picker and get the selected color
      const inputRef =
        action === 'color' ? colorInputRef : backgroundColorInputRef;
      inputRef.current?.click();
      return;
    }
    applyFormat(action);
  };

  return (
    <div className='hidden md:flex shadow-inner px-4 py-2 rounded-2xl bg-surface lg:w-full justify-between'>
      {/* Custom Toolbar */}
      <div className='flex items-center gap-2 p-1'>
        {editorIcons.map(({ label, icon: Icon, action }) => (
          <button
            aria-label={label}
            key={label}
            type='button'
            className={`cursor-pointer flex items-center gap-1 px-2 py-1 text-lg font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none  ${activeTab[action] ? 'bg-gray-200 ring-2 ring-blue-500' : ''}`}
            onClick={() => {
              handleAction(action);
            }}
          >
            <Icon className='w-4 h-4' />
          </button>
        ))}
        <input
          aria-label='Color'
          type='color'
          name='color'
          id='color'
          ref={colorInputRef}
          hidden
          onChange={(e) => applyFormat('color', e.target.value as string)}
        />
        <input
          aria-label='Background Color'
          type='color'
          name='background'
          id='background'
          ref={backgroundColorInputRef}
          hidden
          onChange={(e) => applyFormat('background', e.target.value as string)}
        />
      </div>
    </div>
  );
}
