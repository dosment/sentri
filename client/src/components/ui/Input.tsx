import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'block w-full px-3 py-2 border rounded-lg shadow-sm text-sm',
            'focus:outline-none focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue',
            'placeholder:text-gray-400',
            error ? 'border-alert' : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-alert">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
