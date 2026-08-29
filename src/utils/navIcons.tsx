import React from 'react';
import {
  BookOpen,
  Sparkles,
  Award,
  Trophy,
  FileText,
  LayoutDashboard,
  Home,
  Target,
  Globe,
  HelpCircle,
  Phone,
  Share2,
  CheckCircle2,
  Flame,
  Folder,
  User,
  Search,
  Compass,
  FileSpreadsheet,
  Download,
  Bell,
  Shield,
  ExternalLink,
  MessageSquare,
  Calendar,
  GraduationCap,
  TrendingUp,
  Zap,
  Star,
  Bookmark,
  BarChart3,
  Layers,
  LucideIcon
} from 'lucide-react';

export const NAV_ICON_MAP: Record<string, { label: string; icon: LucideIcon }> = {
  BookOpen: { label: 'खुली किताब (BookOpen)', icon: BookOpen },
  Sparkles: { label: 'चमक / स्टार्स (Sparkles)', icon: Sparkles },
  Award: { label: 'मेडल / पुरस्कार (Award)', icon: Award },
  Trophy: { label: 'ट्रॉफी / लीडरबोर्ड (Trophy)', icon: Trophy },
  FileText: { label: 'दस्तावेज़ / नोट्स (FileText)', icon: FileText },
  LayoutDashboard: { label: 'डैशबोर्ड (LayoutDashboard)', icon: LayoutDashboard },
  Home: { label: 'होम / मुख्य पृष्ठ (Home)', icon: Home },
  Target: { label: 'लक्ष्य (Target)', icon: Target },
  GraduationCap: { label: 'परीक्षा / डिग्री (GraduationCap)', icon: GraduationCap },
  Flame: { label: 'आग / स्ट्रीक (Flame)', icon: Flame },
  Globe: { label: 'ग्लोब / वेब (Globe)', icon: Globe },
  Star: { label: 'तारा (Star)', icon: Star },
  Zap: { label: 'बिजली / तेज़ (Zap)', icon: Zap },
  TrendingUp: { label: 'ट्रेंडिंग / प्रगति (TrendingUp)', icon: TrendingUp },
  BarChart3: { label: 'ग्राफ / एनालिटिक्स (BarChart3)', icon: BarChart3 },
  Bell: { label: 'घंटी / सूचना (Bell)', icon: Bell },
  Phone: { label: 'फ़ोन / संपर्क (Phone)', icon: Phone },
  HelpCircle: { label: 'सहायता (HelpCircle)', icon: HelpCircle },
  Share2: { label: 'साझा करें (Share2)', icon: Share2 },
  CheckCircle2: { label: 'सत्यापित (CheckCircle2)', icon: CheckCircle2 },
  Folder: { label: 'फ़ोल्डर (Folder)', icon: Folder },
  User: { label: 'यूज़र / प्रोफाइल (User)', icon: User },
  MessageSquare: { label: 'चैट / संदेश (MessageSquare)', icon: MessageSquare },
  Bookmark: { label: 'बुकमार्क (Bookmark)', icon: Bookmark },
  Download: { label: 'डाउनलोड (Download)', icon: Download },
  ExternalLink: { label: 'बाहरी लिंक (ExternalLink)', icon: ExternalLink },
  Shield: { label: 'सुरक्षा / शील्ड (Shield)', icon: Shield },
  Layers: { label: 'लेयर्स (Layers)', icon: Layers },
};

export const AVAILABLE_ICON_NAMES = Object.keys(NAV_ICON_MAP);
export type NavIconKey = keyof typeof NAV_ICON_MAP;

interface DynamicNavIconProps {
  name: string;
  className?: string;
  fallback?: LucideIcon;
}

export const DynamicNavIcon: React.FC<DynamicNavIconProps> = ({
  name,
  className = 'w-4 h-4',
  fallback = Compass
}) => {
  const IconComponent = NAV_ICON_MAP[name]?.icon || fallback;
  return <IconComponent className={className} />;
};
