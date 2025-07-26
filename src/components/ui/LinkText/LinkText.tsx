import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import styles from './LinkText.module.css'

interface LinkTextProps extends LinkProps {
  variant?: 'default' | 'forgot' | 'register'
  children: React.ReactNode
  className?: string
}

export const LinkText = ({
  children,
  to,
  variant = 'default',
  className = '',
  ...rest
}: LinkTextProps) => {
  const variantClass =
    variant === 'forgot'
      ? styles.forgot
      : variant === 'register'
        ? styles.register
        : styles.default

  return (
    <Link to={to} className={`${variantClass} ${className}`} {...rest}>
      {children}
    </Link>
  )
}
