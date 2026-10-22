import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import './Button.css'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary'
  endIcon?: ReactNode
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  endIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`button button--${variant} ${className}`.trim()}
    >
      {children}
      {endIcon && <span className="button__icon" aria-hidden="true">{endIcon}</span>}
    </button>
  )
}
