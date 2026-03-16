export default function Loading() {
  return (
    <div className="space-y-8 max-w-7xl animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-56 bg-slate-800 rounded-lg" />
        <div className="h-4 w-80 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-28 bg-slate-800 rounded" />
              <div className="h-9 w-9 bg-slate-800 rounded-lg" />
            </div>
            <div className="h-8 w-20 bg-slate-800 rounded-lg" />
            <div className="h-3 w-36 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="h-4 w-36 bg-slate-800 rounded" />
            <div className="h-52 bg-slate-800/50 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
