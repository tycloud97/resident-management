import { TextareaHTMLAttributes, forwardRef } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string; hint?: string }

const TextArea = forwardRef<HTMLTextAreaElement, Props>(({ label, error, hint, id, className = '', required, ...props }, ref) => {
  const inputId = id || props.name || Math.random().toString(36).slice(2)
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-base font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`block w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        required={required}
        {...props}
      />
      {hint && !error && <p id={`${inputId}-hint`} className="text-sm text-gray-600">{hint}</p>}
      {error && <p id={`${inputId}-error`} className="text-sm text-red-600">{error}</p>}
    </div>
  )
})

export default TextArea
