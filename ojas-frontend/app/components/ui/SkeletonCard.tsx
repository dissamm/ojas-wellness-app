// ojas-frontend/app/components/ui/SkeletonCard.tsx
export default function SkeletonCard() {
  return (
    <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
      <div className="h-3 bg-white/5 rounded w-full mb-2"></div>
      <div className="h-3 bg-white/5 rounded w-5/6"></div>
    </div>
  );
}
