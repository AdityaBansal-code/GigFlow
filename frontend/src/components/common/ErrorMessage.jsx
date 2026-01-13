export default function ErrorMessage({ message, className = '' }) {
  if (!message) return null;
  
  return (
    <div className={`bg-white border border-black text-black px-4 py-3 ${className}`}>
      {message}
    </div>
  );
}
