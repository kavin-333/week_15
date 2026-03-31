export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-t-2 border-[#6C63FF] animate-spin" />
        <div className="absolute inset-2 rounded-full border-r-2 border-[#FF6584] animate-spin animation-delay-150" />
        <div className="absolute inset-4 rounded-full border-b-2 border-white/20 animate-spin animation-delay-300" />
      </div>
      <p className="text-muted-foreground mt-6 text-sm font-medium animate-pulse">Loading ShopZen...</p>
    </div>
  );
}
