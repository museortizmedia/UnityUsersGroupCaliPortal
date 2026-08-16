import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="border-b border-black/10 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border border-black/10 font-bold">
            Legal & Convivencia
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-black tracking-tight">
          Términos del Servicio
        </h1>
        <p className="font-['Inter'] text-xs font-['JetBrains_Mono'] text-[#45464d] mt-1">
          Última actualización: Agosto 2026 • Unity Users Group Cali
        </p>
      </div>

      {/* Contenido de Términos */}
      <div className="font-['Inter'] text-[#45464d] space-y-6 leading-relaxed text-sm">
        <p>
          Al acceder y utilizar el portal <strong>UUG Cali (Developer Lab)</strong>, aceptas compartir recursos, código y contenido educativo bajo los estándares de respeto, colaboración y ética de nuestra comunidad de desarrolladores.
        </p>

        {/* Sección 1 */}
        <div className="bg-white p-6 rounded-xl border border-black/5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-black">
            <span className="material-symbols-outlined text-xl">folder_shared</span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold">
              Uso de Código Abierto y Licencias de Assets
            </h3>
          </div>
          <p className="text-xs text-[#45464d]">
            Los paquetes de Unity (UPM), prefabs, scripts y proyectos alojados o enlazados en este registro deben indicar explícitamente su modelo de licencia (MIT, CC-BY, Apache 2.0 o Propietaria). Respeta los derechos de autor y las directrices de atribución al utilizar assets de terceros en tus propios proyectos.
          </p>
        </div>

        {/* Sección 2 */}
        <div className="bg-white p-6 rounded-xl border border-black/5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-black">
            <span className="material-symbols-outlined text-xl">groups</span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold">
              Código de Conducta en la Comunidad
            </h3>
          </div>
          <p className="text-xs text-[#45464d]">
            Nos comprometemos a mantener un entorno inclusivo, libre de acoso y enfocado en el aprendizaje continuo. No se permite la publicación de contenido malicioso, virus, scripts dañinos ni recursos con derechos de autor vulnerados sin autorización.
          </p>
        </div>

        {/* Sección 3 */}
        <div className="bg-white p-6 rounded-xl border border-black/5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-black">
            <span className="material-symbols-outlined text-xl">gavel</span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold">
              Descargo de Responsabilidad
            </h3>
          </div>
          <p className="text-xs text-[#45464d]">
            Los recursos y guías compartidos en este laboratorio se proporcionan "tal cual". UUG Cali y sus colaboradores no se hacen responsables de fallos en producción, pérdida de datos o incompatibilidades resultantes de la integración de código de terceros en proyectos externos.
          </p>
        </div>
      </div>
    </div>
  );
}