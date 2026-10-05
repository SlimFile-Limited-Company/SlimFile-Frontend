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
    badge: 'bg-blue-50 text-blue-600 border-blue-100',
    text: 'text-blue-500',
    bgSoft: 'bg-blue-50',
    bgIcon: 'bg-gradient-to-br from-blue-400 to-blue-500',
    btn: 'bg-blue-500 hover:bg-blue-600 text-white',
    border: 'border-blue-400 bg-blue-50',
    chip: 'text-blue-500',
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
    badge: 'bg-purple-50 text-purple-600 border-purple-100',
    text: 'text-purple-500',
    bgSoft: 'bg-purple-50',
    bgIcon: 'bg-gradient-to-br from-purple-400 to-purple-500',
    btn: 'bg-purple-500 hover:bg-purple-600 text-white',
    border: 'border-purple-400 bg-purple-50',
    chip: 'text-purple-500',
  },
};

export const accent = (key: string): Accent => ACCENTS[key] ?? ACCENTS.orange;
