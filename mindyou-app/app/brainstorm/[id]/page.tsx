import { MindmapView } from "@/components/MindmapView";

export default function BrainstormSessionPage({ params }: { params: { id: string } }) {
  return <MindmapView id={params.id} />;
}
