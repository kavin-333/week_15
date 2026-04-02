import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="h-24 w-24 bg-[#6C63FF]/10 rounded-3xl flex items-center justify-center mb-8 border border-[#6C63FF]/20">
        <span className="text-4xl font-black text-[#6C63FF]">404</span>
      </div>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <Link href="/">
        <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl h-12 px-8 font-medium shadow-lg shadow-[#6C63FF]/20 transition-all">
          Return to Shop
        </Button>
      </Link>
    </div>
  );
}
