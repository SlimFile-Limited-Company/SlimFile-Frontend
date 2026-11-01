import type { LucideIcon } from 'lucide-react';

/**
 * Artwork for feature cards, drawn in code rather than as images: a white
 * panel with soft grey rings and a white icon tile carrying the red icon.
 * Sharp at any size and adds nothing to download.
 */
export default function FeatureArt({ icon: Icon, size = 'large' }: { icon: LucideIcon; size?: 'large' | 'small' }) {
  if (size === 'small') {
    return (
      <span className="relative w-10 h-10 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <Icon className="w-5 h-5 text-red-600" strokeWidth={1.9} />
      </span>
    );
  }

  return (
    <div className="relative w-full aspect-[16/10] rounded-[22px] overflow-hidden bg-white">
      {/* Soft rings, as in the SlimFile post artwork */}
      <span aria-hidden className="absolute -top-[30%] -right-[18%] w-[70%] aspect-square rounded-full border border-black/[0.06]" />
      <span aria-hidden className="absolute -top-[18%] -right-[6%] w-[46%] aspect-square rounded-full border border-black/[0.04]" />
      <span aria-hidden className="absolute -bottom-[38%] -left-[16%] w-[62%] aspect-square rounded-full border border-black/[0.05]" />

      {/* Icon tile */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[30%] max-w-[104px] aspect-square rounded-[26%] bg-white shadow-[0_14px_34px_-12px_rgba(0,0,0,0.22),0_0_0_1px_rgba(0,0,0,0.04)] flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04]">
          <Icon className="w-[46%] h-[46%] text-red-600" strokeWidth={1.6} />
        </div>
      </div>
    </div>
  );
}
