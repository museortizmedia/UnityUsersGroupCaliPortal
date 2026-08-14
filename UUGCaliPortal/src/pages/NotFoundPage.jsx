import React from 'react';

export default function NotFoundPage({ setActiveTab }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[450px] text-center p-6">
      <div className="font-['Space_Grotesk'] text-7xl font-bold text-black mb-2">
        404
      </div>
      <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-black mb-2">
        Page Not Found
      </h1>
      <p className="text-xs font-['JetBrains_Mono'] text-[#45464d] max-w-md mb-6">
        The requested view or module does not exist or has been moved.
      </p>
      <button
        onClick={() => setActiveTab?.('main')}
        className="bg-black text-white text-xs font-['JetBrains_Mono'] uppercase tracking-widest px-5 py-3 rounded hover:bg-[#45464d] transition-colors cursor-pointer"
      >
        Return to Home
      </button>
    </div>
  );
}