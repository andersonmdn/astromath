import React from 'react'
import styles from './Title.module.css'

interface TitleProps {
  children: React.ReactNode
  level?: 'h1' | 'h2' | 'h3'
  className?: string
}

export const Title = ({
  children,
  level = 'h2',
  className = '',
}: TitleProps) => {
  const Tag = level

  return (
    <Tag className={`${styles.title} ${className} fw-bold text-uppercase fs-3`}>
      {children}
    </Tag>
  )
}
