import React, { useState } from 'react';

export default function DocsPage() {
  const [openDoc, setOpenDoc] = useState(null);

  const toggleDoc = (id) => {
    setOpenDoc(openDoc === id ? null : id);
  };

  return (
    <div className="bg-white/40 backdrop-blur-md border border-black/5 rounded-xl p-8 space-y-8 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-black/5 text-black font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded border border-black/10 font-bold">
            Centro de Conocimiento
          </span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-black tracking-tight">
          Documentación & Guías Técnicas
        </h1>
        <p className="font-['Inter'] text-sm text-[#45464d] mt-1 max-w-2xl">
          Estándares de desarrollo, integración de hardware IoT (ESP32) y optimización para los proyectos e iniciativas interactivas del Unity Users Group Cali.
        </p>
      </div>

      {/* Grid de Secciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta 1: Estándares Unity & URP */}
        <div className="bg-white p-6 rounded-xl border border-black/5 flex flex-col justify-between shadow-sm hover:border-black/20 transition-all">
          <div>
            <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl text-black">menu_book</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-2 text-black">
              Configuración Unity & URP
            </h3>
            <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed mb-6">
              Estándares de iluminación, rendimiento gráficos en Render Pipelines Universal y estructura limpia de paquetes en proyectos 3D/AR.
            </p>
          </div>
          <button
            onClick={() => toggleDoc('urp')}
            className="w-full bg-black/5 hover:bg-black hover:text-white border border-black/10 text-black px-4 py-2.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>{openDoc === 'urp' ? 'Cerrar Guía' : 'Ver Guía URP'}</span>
            <span className="material-symbols-outlined text-sm">
              {openDoc === 'urp' ? 'expand_less' : 'east'}
            </span>
          </button>
        </div>

        {/* Tarjeta 2: IoT & ESP32 */}
        <div className="bg-white p-6 rounded-xl border border-black/5 flex flex-col justify-between shadow-sm hover:border-black/20 transition-all">
          <div>
            <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl text-black">sensors</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-2 text-black">
              Sensores IoT & ESP32
            </h3>
            <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed mb-6">
              Integración de hardware, sensores ultrasónicos y comunicación con Unity en redes locales (intranets) mediante repetidores y Wi-Fi.
            </p>
          </div>
          <button
            onClick={() => toggleDoc('iot')}
            className="w-full bg-black/5 hover:bg-black hover:text-white border border-black/10 text-black px-4 py-2.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>{openDoc === 'iot' ? 'Cerrar Guía' : 'Ver Protocolo IoT'}</span>
            <span className="material-symbols-outlined text-sm">
              {openDoc === 'iot' ? 'expand_less' : 'east'}
            </span>
          </button>
        </div>

        {/* Tarjeta 3: WebGL & Despliegue */}
        <div className="bg-white p-6 rounded-xl border border-black/5 flex flex-col justify-between shadow-sm hover:border-black/20 transition-all">
          <div>
            <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl text-black">deployed_code</span>
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-2 text-black">
              Despliegue WebGL & PWA
            </h3>
            <p className="font-['Inter'] text-xs text-[#45464d] leading-relaxed mb-6">
              Compresión de builds, optimización de textura/memoria para navegadores y embebido en aplicaciones interactivas web.
            </p>
          </div>
          <button
            onClick={() => toggleDoc('webgl')}
            className="w-full bg-black/5 hover:bg-black hover:text-white border border-black/10 text-black px-4 py-2.5 rounded font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>{openDoc === 'webgl' ? 'Cerrar Guía' : 'Ver Guía WebGL'}</span>
            <span className="material-symbols-outlined text-sm">
              {openDoc === 'webgl' ? 'expand_less' : 'east'}
            </span>
          </button>
        </div>

      </div>

      {/* Contenido Desplegable Completo / Tutoriales */}
      {openDoc && (
        <div className="bg-white rounded-xl border border-black/10 p-6 md:p-8 space-y-6 animate-fadeIn">
          
          {/* SECCIÓN URP */}
          {openDoc === 'urp' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <span className="material-symbols-outlined text-2xl text-black">menu_book</span>
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black">
                  Guía de Configuración Estándar URP (Universal Render Pipeline)
                </h2>
              </div>
              <p className="font-['Inter'] text-sm text-[#45464d] leading-relaxed">
                Para mantener la consistencia estética y de rendimiento en los proyectos comunitarios, recomendamos la versión LTS de Unity (2022.3+) con las siguientes configuraciones de renderizado:
              </p>

              <div className="bg-black/5 p-4 rounded-lg font-['JetBrains_Mono'] text-xs space-y-3">
                <p className="font-bold text-black">📋 Lista de verificación para el Render Pipeline Assets:</p>
                <ul className="list-disc list-inside space-y-1 text-[#45464d]">
                  <li><strong>Lighting:</strong> Main Light con sombras Hard/Soft habilitadas; habilitar Lightmaps baking para optimizar entornos.</li>
                  <li><strong>Shadow Distance:</strong> Ajustar a un rango máximo de 35m-50m para móviles o WebGL.</li>
                  <li><strong>Post-Processing:</strong> Usar Volume Profile ligero (Bloom sutil + Color Adjustments para contraste equilibrado).</li>
                  <li><strong>Assets 3D:</strong> Utilizar materiales Lit/SimpleLit integrados con PBR básico.</li>
                </ul>
              </div>
            </div>
          )}

          {/* SECCIÓN IOT */}
          {openDoc === 'iot' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <span className="material-symbols-outlined text-2xl text-black">sensors</span>
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black">
                  Arquitectura IoT: Módulos ESP32 + Repetidores Wi-Fi + Unity
                </h2>
              </div>
              <p className="font-['Inter'] text-sm text-[#45464d] leading-relaxed">
                Guía técnica para conectar sensores de proximidad ultrasónicos / movimiento a ejecutables de Unity en exhibiciones e instalaciones locales.
              </p>

              <div className="bg-black/5 p-4 rounded-lg font-['JetBrains_Mono'] text-xs space-y-2 text-[#45464d]">
                <p className="font-bold text-black">📡 Estructura de Red e Intranet Local:</p>
                <p>• <strong>Topología:</strong> Al estar los ESP32 alejados del AP central, se emplean repetidores inalámbricos que amplían la red sin necesidad de segmentación por VLAN.</p>
                <p>• <strong>Protocolo recomendado:</strong> Envío de paquetes UDP livianos o peticiones HTTP POST locales directas al servidor o ejecutable central de Unity.</p>
              </div>

              <div className="bg-black text-white p-4 rounded-lg font-['JetBrains_Mono'] text-xs overflow-x-auto">
                <p className="text-emerald-400 font-bold mb-2">// Ej. C# Receptor UDP en Unity para Sensores Ultrasonido</p>
                <pre>{`using System.Net;
using System.Net.Sockets;
using System.Text;
using UnityEngine;

public class ESP32SensorListener : MonoBehaviour {
    UdpClient udpClient;
    int port = 8080;

    void Start() {
        udpClient = new UdpClient(port);
        udpClient.BeginReceive(OnDataReceived, null);
    }

    void OnDataReceived(System.IAsyncResult result) {
        IPEndPoint remoteEP = new IPEndPoint(IPAddress.Any, port);
        byte[] data = udpClient.EndReceive(result, ref remoteEP);
        string message = Encoding.UTF8.GetString(data);
        Debug.Log("Distancia del sensor: " + message + " cm");
        udpClient.BeginReceive(OnDataReceived, null);
    }
}`}</pre>
              </div>
            </div>
          )}

          {/* SECCIÓN WEBGL */}
          {openDoc === 'webgl' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <span className="material-symbols-outlined text-2xl text-black">deployed_code</span>
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-black">
                  Optimización de Compilación WebGL
                </h2>
              </div>
              <p className="font-['Inter'] text-sm text-[#45464d] leading-relaxed">
                Pautas para empaquetar aplicaciones interactivas en la web minimizando el tiempo de carga y uso de memoria en navegadores de escritorio y móviles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-['JetBrains_Mono'] text-xs">
                <div className="border border-black/10 p-4 rounded-lg bg-black/5">
                  <h4 className="font-bold text-black mb-2">⚙️ Player Settings Recomendados</h4>
                  <p className="text-[#45464d]"> Compression Format: Brotli o Gzip</p>
                  <p className="text-[#45464d]"> Enable Exceptions: None (Reduce el tamaño de build)</p>
                  <p className="text-[#45464d]"> Data Caching: Habilitado</p>
                </div>
                <div className="border border-black/10 p-4 rounded-lg bg-black/5">
                  <h4 className="font-bold text-black mb-2">🖼️ Texturas y Audio</h4>
                  <p className="text-[#45464d]"> Texturas: Máximo 2048px (Compresión ASTC o Crunched)</p>
                  <p className="text-[#45464d]"> Audio: Force to Mono + Compressed In Memory</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}