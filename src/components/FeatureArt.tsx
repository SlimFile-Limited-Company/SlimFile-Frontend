import type { LucideIcon } from 'lucide-react';

/**
 * Brand artwork for feature cards, drawn in code rather than as images: the
 * SlimFile red gradient with soft rings and a white icon tile. Sharp at any
 * size and adds nothing to download.
 */
export default function FeatureArt({ icon: Icon, size = 'large' }: { icon: LucideIcon; size?: 'large' | 'small' }) {
  if (size === 'small') {
    return (
      <span className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#f04343] via-[#dc2626] to-[#b91c1c] flex items-center justify-center shadow-[0_2px_8px_rgba(220,38,38,0.25)]">
        <span aria-hidden className="absolute -top-3 -right-3 w-8 h-8 rounded-full border border-white/25" />
        <Icon className="relative w-5 h-5 text-white" strokeWidth={1.9} />
      </span>
    );
  }

  return (
    <div className="relative w-full aspect-[16/10] rounded-[22px] overflow-hidden bg-gradient-to-br from-[#f04343] via-[#dc2626] to-[#b91c1c]">
      {/* Soft light and rings, as in the SlimFile post artwork */}
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.22),transparent_55%)]" />
      <span aria-hidden className="absolute -top-[30%] -right-[18%] w-[70%] aspect-square rounded-full border border-white/20" />
      <span aria-hidden className="absolute -top-[18%] -right-[6%] w-[46%] aspect-square rounded-full border border-white/10" />
      <span aria-hidden className="absolute -bottom-[38%] -left-[16%] w-[62%] aspect-square rounded-full border border-white/15" />

      {/* Icon tile */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[30%] max-w-[104px] aspect-square rounded-[26%] bg-white shadow-[0_18px_40px_-12px_rgba(80,0,0,0.55),inset_0_-2px_0_rgba(0,0,0,0.06)] flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04]">
          <span aria-hidden className="absolute inset-0 rounded-[26%] bg-gradient-to-b from-white to-[#f5f5f7]" />
          <Icon className="relative w-[46%] h-[46%] text-red-600" strokeWidth={1.6} />
        </div>
      </div>
    </div>
  );
}
