import React from 'react'
import Input from '../Input'

interface FormGroupProps {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}

export const FormGroup = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  inputRef,
}: FormGroupProps) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <Input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      inputRef={inputRef}
    />
  </div>
)
