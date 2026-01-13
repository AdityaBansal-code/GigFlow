export default function SkeletonLoader({ count = 3, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white border border-black p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-gray-300 w-3/4"></div>
            <div className="h-6 bg-gray-300 w-16"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300"></div>
            <div className="h-4 bg-gray-300 w-5/6"></div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 bg-gray-300 w-20"></div>
            <div className="h-4 bg-gray-300 w-24"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-300 flex-1"></div>
            <div className="h-10 bg-gray-300 flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
