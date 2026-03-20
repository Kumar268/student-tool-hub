import React from 'react';
import {
  // Academic
  Variable, Sigma, Grid3X3, BarChart3, Target, FlaskConical, Cpu, TrendingUp, Scale, Calculator,
  // Financial
  Banknote, Award, PieChart, Home, Book, Truck,
  // Utility
  GraduationCap, Clock, Calendar, Hash, ClipboardList, Percent,
  // Niche
  ShieldCheck, Binary, Orbit, Music, Utensils, Leaf,
  // Image
  Maximize, FileArchive, ImagePlus, RefreshCw, Eraser, FileImage, Monitor,
  // PDF
  FileStack, Scissors, FileEdit, FileCheck, Unlock,
  // Text
  FileText, CheckSquare, Type, CaseSensitive, FileSearch,
  // Audio
  Mic, Volume2,
  // Developer
  Code, FileCode, Eye, Palette, QrCode
} from 'lucide-react';

const iconMap = {
  // Academic
  'Variable': Variable,
  'Sigma': Sigma,
  'Grid3X3': Grid3X3,
  'BarChart3': BarChart3,
  'Target': Target,
  'FlaskConical': FlaskConical,
  'Cpu': Cpu,
  'TrendingUp': TrendingUp,
  'Scale': Scale,
  'Calculator': Calculator,
  
  // Financial
  'Banknote': Banknote,
  'Award': Award,
  'PieChart': PieChart,
  'Home': Home,
  'Book': Book,
  'Truck': Truck,
  
  // Utility
  'GraduationCap': GraduationCap,
  'Clock': Clock,
  'Calendar': Calendar,
  'Hash': Hash,
  'ClipboardList': ClipboardList,
  'Percent': Percent,
  
  // Niche
  'ShieldCheck': ShieldCheck,
  'Binary': Binary,
  'Orbit': Orbit,
  'Music': Music,
  'Utensils': Utensils,
  'Leaf': Leaf,
  
  // Image
  'Maximize': Maximize,
  'FileArchive': FileArchive,
  'ImagePlus': ImagePlus,
  'RefreshCw': RefreshCw,
  'Eraser': Eraser,
  'FileImage': FileImage,
  'Monitor': Monitor,
  
  // PDF
  'FileStack': FileStack,
  'Scissors': Scissors,
  'FileEdit': FileEdit,
  'FileCheck': FileCheck,
  'Unlock': Unlock,
  
  // Text
  'FileText': FileText,
  'CheckSquare': CheckSquare,
  'Type': Type,
  'CaseSensitive': CaseSensitive,
  'FileSearch': FileSearch,
  
  // Audio
  'Mic': Mic,
  'Volume2': Volume2,
  
  // Developer
  'Code': Code,
  'FileCode': FileCode,
  'Eye': Eye,
  'Palette': Palette,
  'QrCode': QrCode
};

export const ToolIcon = ({ iconName, size = 24, className = '' }) => {
  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) {
    return <div className={className}>?</div>;
  }
  
  return <IconComponent size={size} className={className} />;
};
