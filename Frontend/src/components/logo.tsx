
import { Mountain } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold">
      <Mountain className="h-6 w-6" />
      <span className="text-lg font-headline">ReWear</span>
    </Link>
  );
}
