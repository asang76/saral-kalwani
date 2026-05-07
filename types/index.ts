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
  icon: any;
  title: string;
  description: string;
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

// Which dropdown inside CreateRewardModal is currently open
export type DropdownId = 'event' | 'reward';

export interface UIState {
  notifications: number;
  modalOpen: ModalType | null;
  /** Tracks which reward-modal dropdown is open — null means all closed */
  activeDropdown: DropdownId | null;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}