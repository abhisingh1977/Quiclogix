import { forwardRef, useId } from 'react'
import type React from 'react'
import './Textarea.css'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, helperText, id: customId, required, className = '', disabled, ...props }, ref) => {
    const generatedId = useId()
    const id = customId || generatedId
    const errorId = `${id}-error`
    const effectiveHint = hint || helperText
    const hintId = `${id}-hint`

    const describedBy = [
      error ? errorId : null,
      effectiveHint ? hintId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className={`textarea-group ${error ? 'textarea-group--error' : ''} ${disabled ? 'textarea-group--disabled' : ''}`}>
        <label htmlFor={id} className="textarea-label">
          {label}
          {required && <span className="textarea-required" aria-hidden="true"> *</span>}
        </label>

        <textarea
          ref={ref}
          id={id}
          className={`textarea-field ${className}`}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          rows={4}
          {...props}
        />

        {error && (
          <p id={errorId} className="textarea-error" role="alert">
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={hintId} className="textarea-hint">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
