export default function SuccessMessage({ message, className = '' }) {
  if (!message) return null;
  
  return (
    <div className={`bg-black text-white border border-black px-4 py-3 ${className}`}>
      {message}
    </div>
  );
}
