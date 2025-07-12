
"use client";

import * as React from 'react';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, LayoutGrid, ToggleRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [showConfetti, setShowConfetti] = React.useState(false);

  const handleConfettiClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
  };

  return (
    <div className="flex flex-col items-center justify-center">
        {showConfetti && (
             <Confetti
                recycle={false}
                numberOfPieces={200}
                tweenDuration={3000}
            />
        )}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Swap. Share. Sustain.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join the community clothing exchange where your pre-loved items find new homes and you discover amazing pieces from others.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                 <Button asChild size="lg" onClick={handleConfettiClick}>
                    <Link href="/explore">Get Started 🎉</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/explore">Explore</Link>
                </Button>
              </div>
            </div>
            <img
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
              alt="Hero"
              data-ai-hint="abstract design"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
