export default function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} border-4 border-gray-300 border-t-black animate-spin`}
      />
    </div>
  );
}
