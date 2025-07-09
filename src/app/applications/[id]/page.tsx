
import React, { Suspense } from 'react';
import ApplicationDetailClient from './application-detail-client';
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-6 space-y-6">
        <ApplicationDetailClient id={id} />
        {/*
      <Suspense fallback={<ApplicationDetailSkeleton />}>
        <ApplicationDetailClient id={id} />
      </Suspense>
      */}
    </div>
  );
}

function ApplicationDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
      <Skeleton className="h-96" />
    </div>
  );
} 