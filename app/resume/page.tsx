"use client";

export default function Resume() {
  return (
    <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Resume</h1>
        </div>
        
        <div className="w-full aspect-[8.5/11] bg-zinc-800 rounded-lg overflow-hidden">
          <iframe
            src="/ResumeLatest.pdf"
            className="w-full h-full border-none"
            title="Spencer Presley's Resume"
          />
        </div>
      </div>
    </div>
  );
} 
