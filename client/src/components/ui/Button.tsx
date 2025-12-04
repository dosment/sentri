import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-small focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          {
            'bg-sentri-blue text-white hover:bg-guardian-navy focus:ring-sentri-blue':
              variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500':
              variant === 'secondary',
            'text-gray-700 hover:bg-gray-100 focus:ring-gray-500':
              variant === 'ghost',
            'bg-alert text-white hover:bg-red-600 focus:ring-alert':
              variant === 'danger',
            'bg-success text-white hover:bg-green-600 focus:ring-success':
              variant === 'success',
          },
          {
            'text-sm px-4 py-2.5 min-h-[44px]': size === 'sm' || size === 'md',
            'text-base px-6 py-3': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
