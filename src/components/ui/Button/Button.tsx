import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  fullWidth?: boolean
  variant?: 'primary' | 'secondary' | 'logout' | 'confirm'
}

export const Button = ({
  children,
  fullWidth = false,
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const classes = [
    'btn',
    fullWidth ? 'w-100' : '',
    styles.button,
    className,
    styles[`button--${variant}`],
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
