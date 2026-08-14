import React from 'react';

export default function ArchitecturePage() {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Encabezado del Manifiesto */}
      <div className="border-b border-black/10 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-black text-white font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded font-bold">
           Valle del Cauca, Colombia
          </span>
          <span className="bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded font-bold">
            Engine v4.2.1
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-black tracking-tight mb-3">
          Developer Lab <span className='text-1xl'>  </span>
        </h1>
        <p className="font-['Inter'] text-base text-[#45464d] max-w-3xl leading-relaxed">
          Un espacio creado por y para desarrolladores. Centralizamos la producción interactiva de nuestra región y construimos las herramientas con las que creamos el futuro del desarrollo de videojuegos.
        </p>
      </div>

      {/* Cita / Declaración de Principios */}
      <blockquote className="bg-white/80 p-6 rounded-xl border-l-4 border-black border-black/5 text-[#45464d] font-['Space_Grotesk'] text-lg font-medium italic shadow-sm">
        "No solo hacemos juegos desde el Valle del Cauca para el mundo; construimos el ecosistema técnico que hace posible crearlos."
      </blockquote>

      {/* Los Tres Pilares del Manifiesto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pilar 1: Vitrina Regional */}
        <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center text-black mb-4">
              <span className="material-symbols-outlined text-2xl">sports_esports</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-black mb-1">
              1. Vitrina del Valle
            </h3>
            <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] leading-relaxed">
              Un catálogo centralizado para exhibir, impulsar y mapear el talento local. Damos visibilidad a los videojuegos e instalaciones desarrollados en Cali y la región.
            </p>
          </div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-black/40 uppercase tracking-wider block pt-2 border-t border-black/5">
            Identidad & Orgullo Local
          </span>
        </div>

        {/* Pilar 2: Librería de Paquetes */}
        <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center text-black mb-4">
              <span className="material-symbols-outlined text-2xl">extension</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-black mb-1">
              2. Herramientas Propias
            </h3>
            <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] leading-relaxed">
              Librería de paquetes UPM, módulos y utilidades creadas por los mismos miembros del grupo. Un estándar colectivo para no reinventar la rueda en cada proyecto.
            </p>
          </div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-black/40 uppercase tracking-wider block pt-2 border-t border-black/5">
            Módulos & UPM Git
          </span>
        </div>

        {/* Pilar 3: Conocimiento Abierto */}
        <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center text-black mb-4">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-black mb-1">
              3. Red Comunitaria
            </h3>
            <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] leading-relaxed">
              Conectamos a creadores independientes, estudios locales y estudiantes para colaborar en proyectos, compartir código y elevar la vara técnica de la comunidad.
            </p>
          </div>
          <span className="font-['JetBrains_Mono'] text-[10px] text-black/40 uppercase tracking-wider block pt-2 border-t border-black/5">
            Unity Users Group Cali
          </span>
        </div>

      </div>

      {/* Bloque Técnico / Especificaciones de Engine v4.2.1 */}
      <div className="bg-black/5 border border-black/10 rounded-xl p-6 font-['JetBrains_Mono'] space-y-4">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h4 className="font-bold text-black uppercase tracking-wider text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">terminal</span>
            Especificaciones del Motor • Engine v4.2.1
          </h4>
          <span className="text-[10px] text-[#45464d]">Build Status: Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#45464d]">
          <div className="space-y-1">
            <span className="text-black font-bold block">Propósito:</span>
            <p>Centralización, distribución de paquetes UPM y catálogo interactivo regional.</p>
          </div>
          <div className="space-y-1">
            <span className="text-black font-bold block">Integración:</span>
            <p>Soporte directo con Unity Package Manager mediante URLs de Git desatendidas.</p>
          </div>
          <div className="space-y-1">
            <span className="text-black font-bold block">Comunidad:</span>
            <p>Liderado por Unity Users Group Cali para la industria de desarrollo de software del Valle.</p>
          </div>
        </div>
      </div>

    </div>
  );
}