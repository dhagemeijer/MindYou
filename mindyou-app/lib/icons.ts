import {
  Sun,
  Bed,
  ShowerHead,
  Shirt,
  Utensils,
  Coffee,
  Backpack,
  Bus,
  BookOpen,
  Brush,
  Droplets,
  Sparkles,
  Dumbbell,
  Dog,
  Bike,
  Clock,
  CheckCircle2,
  Pill,
  Milk,
  Sandwich,
  type LucideIcon,
} from "lucide-react";

export interface IconOption {
  key: string;
  label: string;
  icon: LucideIcon;
}

// Vaste set voor v1 — eigen afbeeldingen uploaden komt later.
export const ICON_OPTIONS: IconOption[] = [
  { key: "sun", label: "Opstaan", icon: Sun },
  { key: "bed", label: "Bed opmaken", icon: Bed },
  { key: "shower", label: "Douchen", icon: ShowerHead },
  { key: "shirt", label: "Aankleden", icon: Shirt },
  { key: "brush", label: "Tanden poetsen", icon: Brush },
  { key: "droplets", label: "Wassen", icon: Droplets },
  { key: "utensils", label: "Ontbijten", icon: Utensils },
  { key: "sandwich", label: "Lunch inpakken", icon: Sandwich },
  { key: "milk", label: "Drinken", icon: Milk },
  { key: "coffee", label: "Koffie/thee", icon: Coffee },
  { key: "pill", label: "Medicatie", icon: Pill },
  { key: "backpack", label: "Tas inpakken", icon: Backpack },
  { key: "book", label: "Huiswerk", icon: BookOpen },
  { key: "bus", label: "Naar school/werk", icon: Bus },
  { key: "bike", label: "Fietsen", icon: Bike },
  { key: "dumbbell", label: "Sporten", icon: Dumbbell },
  { key: "dog", label: "Huisdier", icon: Dog },
  { key: "sparkles", label: "Opruimen", icon: Sparkles },
  { key: "clock", label: "Op tijd", icon: Clock },
  { key: "check", label: "Overig", icon: CheckCircle2 },
];

export function getIcon(key: string): LucideIcon {
  return ICON_OPTIONS.find((o) => o.key === key)?.icon ?? CheckCircle2;
}
