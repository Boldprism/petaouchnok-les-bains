'use client';

interface PixelButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export default function PixelButton({
  children,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
}: PixelButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`pixel-btn pixel-btn--${variant} ${className}`}
    >
      {children}
    </button>
  );
}
