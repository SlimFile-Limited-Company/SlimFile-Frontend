/** Per-tool accent colours, shared by the scanner pages and their cards. */
export interface Accent {
  key: string;
  badge: string;
  text: string;
  bgSoft: string;
  bgIcon: string;
  btn: string;
  border: string;
  chip: string;
}

export const ACCENTS: Record<string, Accent> = {
  orange: {
    key: 'orange',
    badge: 'bg-orange-50 text-orange-600 border-orange-100',
    text: 'text-orange-500',
    bgSoft: 'bg-orange-50',
    bgIcon: 'bg-gradient-to-br from-orange-400 to-orange-500',
    btn: 'bg-orange-500 hover:bg-orange-600 text-white',
    border: 'border-orange-400 bg-orange-50',
    chip: 'text-orange-500',
  },
  blue: {
    key: 'blue',
    badge: 'bg-gray-50 text-red-600 border-gray-200',
    text: 'text-red-500',
    bgSoft: 'bg-gray-50',
    bgIcon: 'bg-gradient-to-br from-red-400 to-red-500',
    btn: 'bg-red-500 hover:bg-red-600 text-white',
    border: 'border-red-400 bg-gray-50',
    chip: 'text-red-500',
  },
  green: {
    key: 'green',
    badge: 'bg-green-50 text-green-600 border-green-100',
    text: 'text-green-500',
    bgSoft: 'bg-green-50',
    bgIcon: 'bg-gradient-to-br from-green-400 to-green-500',
    btn: 'bg-green-500 hover:bg-green-600 text-white',
    border: 'border-green-400 bg-green-50',
    chip: 'text-green-500',
  },
  purple: {
    key: 'purple',
    badge: 'bg-gray-50 text-red-600 border-gray-200',
    text: 'text-red-500',
    bgSoft: 'bg-gray-50',
    bgIcon: 'bg-gradient-to-br from-red-400 to-red-500',
    btn: 'bg-red-500 hover:bg-red-600 text-white',
    border: 'border-red-400 bg-gray-50',
    chip: 'text-red-500',
  },
};

export const accent = (key: string): Accent => ACCENTS[key] ?? ACCENTS.orange;
