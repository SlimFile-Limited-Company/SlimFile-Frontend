export default function StepsBuild() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-20">
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
        <iframe
          src="https://www.stepsbuild.com"
          className="w-full h-full border-0"
          title="StepsBuild"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}