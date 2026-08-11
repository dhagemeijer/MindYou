import { Suspense } from "react";
import { RoutineDetailView } from "@/components/RoutineDetailView";

export default function ActiviteitDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={null}>
      <RoutineDetailView id={params.id} />
    </Suspense>
  );
}
