import { forwardRef, useId } from 'react'
import type React from 'react'
import './Input.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const id = providedId ?? generatedId
    const errorId = error ? `${id}-error` : undefined
    const effectiveHint = hint || helperText
    const hintId = effectiveHint && !error ? `${id}-hint` : undefined

    return (
      <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
        <label htmlFor={id} className="input-group__label input-label">
          {label}
          {props.required && (
            <span className="input-group__required input-required" aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>

        <div className="input-group__wrapper input-wrapper">
          {leftIcon && (
            <span className="input-group__icon input-group__icon--left input-icon input-icon--left" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            className={`input-group__input input-field ${leftIcon ? 'input-group__input--with-icon input-field--with-icon' : ''} ${rightIcon ? 'input-group__input--with-right-icon input-field--with-right-icon' : ''}`}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={errorId ?? hintId}
            {...props}
          />

          {rightIcon && (
            <span className="input-group__icon input-group__icon--right input-icon input-icon--right">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} className="input-group__error input-error" role="alert">
            {error}
          </p>
        )}
        {effectiveHint && !error && (
          <p id={hintId} className="input-group__hint input-hint">
            {effectiveHint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
