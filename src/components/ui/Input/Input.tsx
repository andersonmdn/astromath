import React from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputRef?: React.RefObject<HTMLInputElement | null>
}

export const Input = ({ inputRef, className = '', ...props }: InputProps) => {
  return (
    <input
      ref={inputRef}
      className={`form-control ${styles.input} ${className}`}
      {...props}
    />
  )
}
