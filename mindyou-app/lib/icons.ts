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
  Palette,
  Phone,
  Car,
  Music,
  Gamepad2,
  Tv,
  Heart,
  Star,
  Umbrella,
  Glasses,
  Watch,
  Camera,
  Gift,
  ShoppingBag,
  Laptop,
  Headphones,
  Smile,
  Baby,
  Cat,
  type LucideIcon,
} from "lucide-react";

export interface IconOption {
  key: string;
  label: string;
  icon: LucideIcon;
  // Standaard aan/uit als er nog geen IconSetting in de database staat.
  defaultVisible: boolean;
}

// De volledige beschikbare iconenbibliotheek. Welke er zichtbaar zijn in de
// picker bij het aanmaken van activiteiten wordt beheerd via Instellingen →
// Iconen (opgeslagen in de IconSetting-tabel), niet hier vastgelegd.
// Eigen afbeeldingen uploaden komt later.
export const ICON_OPTIONS: IconOption[] = [
  { key: "sun", label: "Opstaan", icon: Sun, defaultVisible: true },
  { key: "bed", label: "Bed opmaken", icon: Bed, defaultVisible: true },
  { key: "shower", label: "Douchen", icon: ShowerHead, defaultVisible: true },
  { key: "shirt", label: "Aankleden", icon: Shirt, defaultVisible: true },
  { key: "brush", label: "Tanden poetsen", icon: Brush, defaultVisible: true },
  { key: "droplets", label: "Wassen", icon: Droplets, defaultVisible: true },
  { key: "utensils", label: "Ontbijten", icon: Utensils, defaultVisible: true },
  { key: "sandwich", label: "Lunch inpakken", icon: Sandwich, defaultVisible: true },
  { key: "milk", label: "Drinken", icon: Milk, defaultVisible: true },
  { key: "coffee", label: "Koffie/thee", icon: Coffee, defaultVisible: true },
  { key: "pill", label: "Medicatie", icon: Pill, defaultVisible: true },
  { key: "backpack", label: "Tas inpakken", icon: Backpack, defaultVisible: true },
  { key: "schoolbag", label: "Schooltas", icon: Backpack, defaultVisible: true },
  { key: "makeup", label: "Makeup", icon: Palette, defaultVisible: true },
  { key: "phone", label: "Telefoon", icon: Phone, defaultVisible: true },
  { key: "book", label: "Huiswerk", icon: BookOpen, defaultVisible: true },
  { key: "bus", label: "Naar school/werk", icon: Bus, defaultVisible: true },
  { key: "bike", label: "Fietsen", icon: Bike, defaultVisible: true },
  { key: "dumbbell", label: "Sporten", icon: Dumbbell, defaultVisible: true },
  { key: "dog", label: "Huisdier", icon: Dog, defaultVisible: true },
  { key: "sparkles", label: "Opruimen", icon: Sparkles, defaultVisible: true },
  { key: "clock", label: "Op tijd", icon: Clock, defaultVisible: true },
  { key: "check", label: "Overig", icon: CheckCircle2, defaultVisible: true },
  // Extra pool — staat standaard uit, aan te zetten via Instellingen → Iconen.
  { key: "car", label: "Auto", icon: Car, defaultVisible: false },
  { key: "music", label: "Muziek", icon: Music, defaultVisible: false },
  { key: "gamepad", label: "Gamen", icon: Gamepad2, defaultVisible: false },
  { key: "tv", label: "Tv", icon: Tv, defaultVisible: false },
  { key: "heart", label: "Gezondheid", icon: Heart, defaultVisible: false },
  { key: "star", label: "Belangrijk", icon: Star, defaultVisible: false },
  { key: "umbrella", label: "Weer", icon: Umbrella, defaultVisible: false },
  { key: "glasses", label: "Bril/lenzen", icon: Glasses, defaultVisible: false },
  { key: "watch", label: "Horloge", icon: Watch, defaultVisible: false },
  { key: "camera", label: "Camera", icon: Camera, defaultVisible: false },
  { key: "gift", label: "Cadeau", icon: Gift, defaultVisible: false },
  { key: "shoppingbag", label: "Boodschappen", icon: ShoppingBag, defaultVisible: false },
  { key: "laptop", label: "Laptop/werk", icon: Laptop, defaultVisible: false },
  { key: "headphones", label: "Koptelefoon", icon: Headphones, defaultVisible: false },
  { key: "smile", label: "Ontspannen", icon: Smile, defaultVisible: false },
  { key: "baby", label: "Baby/kind", icon: Baby, defaultVisible: false },
  { key: "cat", label: "Huisdier (kat)", icon: Cat, defaultVisible: false },
];

export function getIcon(key: string): LucideIcon {
  return ICON_OPTIONS.find((o) => o.key === key)?.icon ?? CheckCircle2;
}
