import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import './Button.css'

type SharedProps = {
  variant?: 'primary' | 'secondary'
  endIcon?: ReactNode
}

export type ButtonProps = SharedProps & (
  | (ComponentPropsWithoutRef<'button'> & { href?: never })
  | (ComponentPropsWithoutRef<'a'> & { href: string })
)

export function Button({
  children,
  className = '',
  variant = 'primary',
  endIcon,
  ...props
}: ButtonProps) {
  const classes = `button button--${variant} ${className}`.trim()
  const content = <>
    {children}
    {endIcon && <span className="button__icon" aria-hidden="true">{endIcon}</span>}
  </>

  if (props.href !== undefined) {
    return <a {...props} className={classes}>{content}</a>
  }

  return <button {...props} type={props.type ?? 'button'} className={classes}>{content}</button>
}
