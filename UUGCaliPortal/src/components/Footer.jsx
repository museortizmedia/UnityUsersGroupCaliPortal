import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-white text-[#1b1b1d] font-['JetBrains_Mono'] text-xs w-full border-t border-[#c6c6cd] relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8 md:py-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-center">
        
        {/* Marca y Copyright */}
        <div className="text-center md:text-left">
          <button
            onClick={() => setActiveTab?.('main')}
            className="font-['Space_Grotesk'] text-2xl font-bold text-black mb-2 hover:opacity-80 transition-opacity cursor-pointer inline-block md:block"
          >
            UUG Cali
          </button>
          <div className="text-[#45464d]">
            © 2026 UUG Cali (Developer Lab). All Rights Reserved.
          </div>
        </div>

        {/* Enlaces Internos del Footer */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">
          <button
            onClick={() => setActiveTab?.('architecture')}
            className="text-[#45464d] hover:text-black hover:underline cursor-pointer py-1"
          >
            Manifiesto
          </button>
          <button
            onClick={() => setActiveTab?.('privacy')}
            className="text-[#45464d] hover:text-black hover:underline cursor-pointer py-1"
          >
            Privacidad
          </button>
          <button
            onClick={() => setActiveTab?.('terms')}
            className="text-[#45464d] hover:text-black hover:underline cursor-pointer py-1"
          >
            Términos
          </button>
        </div>

        {/* Enlaces Redes Sociales / Comunidad Externa */}
        <div className="flex gap-4 justify-center md:justify-end items-center">
          <a
            className="text-[#45464d] hover:text-black hover:underline py-1"
            href="https://discord.gg/2GaBTEpZVN"
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
        </div>

      </div>
    </footer>
  );
}