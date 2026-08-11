import { RoutineDetailView } from "@/components/RoutineDetailView";

export default function ActiviteitDetailPage({ params }: { params: { id: string } }) {
  return <RoutineDetailView id={params.id} />;
}
