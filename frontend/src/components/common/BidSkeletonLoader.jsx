export default function BidSkeletonLoader({ count = 3, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white border border-black p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="h-5 bg-gray-300 w-32 mb-2"></div>
              <div className="h-4 bg-gray-300 w-48"></div>
            </div>
            <div className="h-6 bg-gray-300 w-20"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300"></div>
            <div className="h-4 bg-gray-300 w-4/5"></div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="h-3 bg-gray-300 w-16 mb-1"></div>
              <div className="h-6 bg-gray-300 w-24"></div>
            </div>
            <div className="h-8 bg-gray-300 w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
