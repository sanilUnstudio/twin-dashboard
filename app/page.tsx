import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shirt } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Shirt className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Garments Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your garments and categories with this powerful admin dashboard.
        </p>
        <div className="pt-4 flex items-center gap-2 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/user">
              User
            </Link>
          </Button>
          
        </div>
      </div>
    </div>
  );
}