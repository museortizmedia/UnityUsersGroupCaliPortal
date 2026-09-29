import fs from 'fs';
import path from 'path';

// Definición de variables del sitio
const SITE_URL = 'https://museortizmedia.github.io/UnityUsersGroupCaliPortal';
const RSS_URL = `${SITE_URL}/feed.xml`;

// Rutas de entrada y salida
const eventsPath = path.resolve('public/events.json');
const outputPath = path.resolve('public/feed.xml');

// Diccionario de meses para parsear la fecha del JSON a objeto Date
const MONTHS_MAP = {
  ENE: '01', FEB: '02', MAR: '03', ABR: '04',
  MAY: '05', JUN: '06', JUL: '07', AGO: '08',
  SEP: '09', OCT: '10', NOV: '11', DIC: '12'
};

/**
 * Parsea textos como "05 NOV 2026" a un objeto Date
 */
function parseEventDate(dateStr) {
  if (!dateStr) return new Date();

  const cleanStr = String(dateStr).trim().toUpperCase();
  const parts = cleanStr.split(/\s+/);

  // Formato "05 NOV 2026"
  if (parts.length === 3 && MONTHS_MAP[parts[1]]) {
    const day = parts[0].padStart(2, '0');
    const month = MONTHS_MAP[parts[1]];
    const year = parts[2];
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
  }

  // Si ya es una fecha estándar ISO
  const standardDate = new Date(dateStr);
  return isNaN(standardDate.getTime()) ? new Date() : standardDate;
}

/**
 * Escapa caracteres especiales en URLs (como &) para evitar XML inválido
 */
function escapeXmlUrl(url) {
  return url.replace(/&/g, '&amp;');
}

function generateRSS() {
  try {
    // 1. Leer y parsear el archivo
    if (!fs.existsSync(eventsPath)) {
      console.error(`❌ No se encontró el archivo: ${eventsPath}`);
      process.exit(1);
    }

    const eventsRaw = fs.readFileSync(eventsPath, 'utf-8');
    const events = JSON.parse(eventsRaw);

    if (!Array.isArray(events)) {
      throw new Error('El archivo events.json debe contener un arreglo de eventos.');
    }

    // 2. Parsear fechas, ordenar descendentemente (último primero) y tomar solo 5
    const latestFiveEvents = events
      .map(event => ({
        ...event,
        parsedDateObj: parseEventDate(event.date)
      }))
      .sort((a, b) => b.parsedDateObj.getTime() - a.parsedDateObj.getTime())
      .slice(0, 5);

    // 3. Construir items XML
    const itemsXml = latestFiveEvents.map((event) => {
      const eventTitle = (event.title || 'Evento Unity Users Group Cali').trim();
      const eventLocation = (event.location || 'Cali, Colombia').trim();
      const eventTime = (event.time || '').trim();
      const rawDate = event.date || ''; // Mantiene el texto original (ej: "05 NOV 2026")
      
      const rfcPubDate = event.parsedDateObj.toUTCString(); // Formato RFC-822 para el tag pubDate
      const eventId = event.id ? String(event.id) : `${eventTitle.toLowerCase().replace(/\s+/g, '-')}`;
      const eventLink = escapeXmlUrl((event.rsvpUrl || event.url || SITE_URL).trim());

      const descriptionText = `Fecha: ${rawDate} | Hora: ${eventTime} | Lugar: ${eventLocation}`;

      return `    <item>
      <title><![CDATA[${eventTitle}]]></title>
      <link>${eventLink}</link>
      <guid isPermaLink="false">uugc-event-${eventId}</guid>
      <description><![CDATA[${descriptionText}]]></description>
      <pubDate>${rfcPubDate}</pubDate>
    </item>`;
    }).join('\n');

    // 4. Estructura estándar RSS 2.0
    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Unity Users Group Cali — Eventos</title>
    <link>${SITE_URL}</link>
    <description>Comunidad de desarrollo de videojuegos, simulaciones e interactivación 3D en Cali, Colombia.</description>
    <language>es-co</language>
    <atom:link href="${RSS_URL}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

    // 5. Guardar en public/feed.xml
    fs.writeFileSync(outputPath, rssXml, 'utf-8');
    console.log(`✅ feed.xml generado exitosamente con los últimos 5 eventos (orden invertido).`);
  } catch (error) {
    console.error('❌ Error al generar el feed RSS:', error);
    process.exit(1);
  }
}

generateRSS();