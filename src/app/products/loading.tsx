export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse mb-8" />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full md:w-64 shrink-0 space-y-6 hidden md:block border-r border-white/10 pr-6">
          <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-full bg-white/5 rounded-lg animate-pulse" />
          ))}
          <div className="mt-8 h-6 w-24 bg-white/5 rounded-md animate-pulse mb-4" />
          <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-10 w-40 bg-white/5 rounded-xl animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden h-96 flex flex-col items-center">
                <div className="w-full h-56 bg-white/5 animate-pulse" />
                <div className="w-full p-4 space-y-3">
                  <div className="h-4 w-1/3 bg-white/5 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse" />
                  <div className="mt-auto pt-4 h-6 w-1/4 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
