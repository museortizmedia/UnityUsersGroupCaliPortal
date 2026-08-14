import React from 'react';

export default function SupportPage() {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-black">Soporte de la Comunidad</h1>
        <p className="text-[#45464d] text-sm mt-1">
          ¿Necesitas ayuda con algún error, paquete de assets o proyecto? Ponte en contacto con nosotros o únete a la comunidad.
        </p>
      </div>

      {/* Tarjeta de Liderazgo / Info */}
      <div className="bg-black/5 border border-black/10 rounded-lg p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-['Space_Grotesk'] font-bold shrink-0">
            DO
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] font-bold text-sm text-black">Diego Ortiz</h3>
            <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">Líder de la Comunidad (Unity Users Group Cali)</p>
          </div>
        </div>
        <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold border border-emerald-500/20 shrink-0">
          En línea
        </span>
      </div>

      {/* Opciones de Contacto / Botones */}
      <div className="space-y-4">
        {/* Discord */}
        <div className="p-5 bg-white rounded-xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-black/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl text-black">forum</span>
            </div>
            <div>
              <h4 className="font-['Space_Grotesk'] font-bold text-black">Servidor de Discord</h4>
              <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">Resolución de dudas, feedback y networking directo.</p>
            </div>
          </div>
          <a
            href="https://discord.gg/2GaBTEpZVN"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-black text-white px-5 py-2.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Entrar al Discord</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>

        {/* Correo Electrónico */}
        <div className="p-5 bg-white rounded-xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-black/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl text-black">mail</span>
            </div>
            <div>
              <h4 className="font-['Space_Grotesk'] font-bold text-black">Correo Directo</h4>
              <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">museortiz@gmail.com</p>
            </div>
          </div>
          <a
            href="mailto:museortiz@gmail.com"
            className="shrink-0 bg-white border border-black/10 text-black px-5 py-2.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-widest hover:bg-black/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enviar Mensaje</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </a>
        </div>
      </div>
    </div>
  );
}