export default function Textarea({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-black mb-1">
          {label}
          {required && <span className="text-black ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black ${
          error ? 'border-black' : 'border-black'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-black">{error}</p>}
    </div>
  );
}
