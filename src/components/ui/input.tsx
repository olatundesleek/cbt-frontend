"use client";

import { InputHTMLAttributes } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  hookFormRegister?: UseFormRegister<T>;
  errorText?: string;
  label?: string;
}

const Input = <T extends FieldValues>({
  type = "text",
  id,
  errorText,
  label,
  name,
  hookFormRegister,
  ...rest
}: InputProps<T>) => {
  return (
    <div className='flex flex-col gap-1 w-full'>
      <label htmlFor={id}>
        {label && <span className='text-sm text-neutral-600'>{label}</span>}
        <input
          type={type}
          autoFocus
          autoCapitalize='characters'
          autoComplete='off'
          {...hookFormRegister?.(name as Path<T>)}
          {...rest}
          className='block w-full rounded-md border border-neutral-300 p-1 h-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground'
        />
      </label>
      {errorText && <small className='text-error-500'>{errorText}</small>}
    </div>
  );
};

export default Input;
