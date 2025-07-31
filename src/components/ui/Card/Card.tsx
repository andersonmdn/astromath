import React from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Card = ({
  children,
  className = '',
  fullWidth = false,
  onClick,
}: CardProps) => {
  return (
    <div
      className={`${styles.card} ${className} ${fullWidth ? styles['card--fullwidth'] : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
