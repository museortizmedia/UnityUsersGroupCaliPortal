import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="border-b border-black/10 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border border-black/10 font-bold">
            Transparencia & Seguridad
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-black tracking-tight">
          Política de Privacidad
        </h1>
        <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] mt-1">
          Última actualización: Agosto 2026 • Unity Users Group Cali
        </p>
      </div>

      {/* Contenido */}
      <div className="font-['Inter'] text-[#45464d] space-y-6 leading-relaxed text-sm">
        <p>
          En el <strong>UUG Cali (Developer Lab)</strong>, respetamos tu privacidad y procesamos la información personal estrictamente para facilitar el networking entre desarrolladores, la transferencia de assets y el desarrollo de proyectos colaborativos.
        </p>

        {/* Recopilación de Datos */}
        <div className="bg-white p-6 rounded-xl border border-black/5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-black">
            <span className="material-symbols-outlined text-xl">database</span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold">
              Recopilación de Datos
            </h3>
          </div>
          <p className="text-xs text-[#45464d]">
            Únicamente almacenamos los detalles de perfil de usuario, los proyectos y paquetes subidos, así como las métricas de interacción enviadas de forma directa. No utilizamos cookies de rastreo publicitario ni rastreadores de terceros en nuestro laboratorio.
          </p>
        </div>

        {/* Uso de la Información */}
        <div className="bg-white p-6 rounded-xl border border-black/5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-black">
            <span className="material-symbols-outlined text-xl">security</span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold">
              Uso e Integridad de la Información
            </h3>
          </div>
          <p className="text-xs text-[#45464d]">
            Tus datos de contacto o credenciales no serán vendidos ni compartidos con empresas externas. Toda la información recopilada se utiliza exclusivamente para la autenticación en la plataforma y la atribución de autoría en los paquetes UPM compartidos.
          </p>
        </div>
      </div>
    </div>
  );
}