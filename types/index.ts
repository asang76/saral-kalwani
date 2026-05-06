import type { LucideIcon } from 'lucide-react';

// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// ─── Gamification ─────────────────────────────────────────────────────────────
export interface GamificationFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
  outerBg: string;
  innerBg: string;
  active: boolean;
}

export interface GamificationState {
  enabled: boolean;
  features: GamificationFeature[];
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export interface StatItem {
  id: number;
  label: string;
  value: string;
  change: string;
  up: boolean;
}

export interface StatsState {
  items: StatItem[];
}

// ─── UI ───────────────────────────────────────────────────────────────────────
export type ModalType =
  | 'enable-gamification'
  | 'create-reward'
  | 'add-milestone'
  | 'add-incentive';

export interface UIState {
  notifications: number;
  modalOpen: ModalType | null;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}