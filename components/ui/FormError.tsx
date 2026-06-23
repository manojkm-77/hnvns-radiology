'use client';

type FormErrorProps = {
  message: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
      {message}
    </div>
  );
}
