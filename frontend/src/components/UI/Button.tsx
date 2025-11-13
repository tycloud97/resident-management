import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base = 'inline-flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium focus-visible:outline focus-visible:outline-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }[variant]
  return <button className={`${base} ${styles} ${className}`} {...props} />
}
