"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigation } from "../components/nav";

export default function Resume() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-12 md:pt-24 lg:pt-32">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Resume</h1>
          <a 
            href="/RESUME_SpencerPresley.pdf" 
            download
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg text-zinc-100"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download PDF</span>
          </a>
        </div>
        
        {isMobile ? (
          <div className="flex flex-col items-center justify-center mt-4">
            <p className="text-zinc-400 text-sm mb-4">For the best experience, download the PDF version</p>
            <a 
              href="/RESUME_SpencerPresley.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View PDF
            </a>
          </div>
        ) : (
          <div className="w-full aspect-[8.5/11] bg-zinc-800 rounded-lg overflow-hidden">
            <iframe
              src="/RESUME_SpencerPresley.pdf"
              className="w-full h-full border-none"
              title="Spencer Presley's Resume"
            />
          </div>
        )}
      </div>
    </div>
  );
} 
