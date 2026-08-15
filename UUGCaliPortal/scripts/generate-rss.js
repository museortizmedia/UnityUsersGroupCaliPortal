import fs from 'fs';
import path from 'path';

// Definición de variables del sitio
const SITE_URL = 'https://museortizmedia.github.io/UnityUsersGroupCaliPortal';
const RSS_URL = `${SITE_URL}/feed.xml`;

// Rutas de entrada y salida
const eventsPath = path.resolve('public/events.json');
const outputPath = path.resolve('public/feed.xml');

function generateRSS() {
  try {
    // 1. Leer y parsear el arreglo de eventos en public/events.json
    if (!fs.existsSync(eventsPath)) {
      console.error(`❌ No se encontró el archivo: ${eventsPath}`);
      process.exit(1);
    }

    const eventsRaw = fs.readFileSync(eventsPath, 'utf-8');
    const events = JSON.parse(eventsRaw);

    // 2. Construir los items del feed XML
    const itemsXml = events.map((event) => {
      const eventTitle = event.title || 'Evento Unity Users Group Cali';
      const eventLocation = event.location || 'Cali, Colombia';
      const eventTime = event.time || '';
      const eventDate = event.date || '';
      const eventId = event.id ? String(event.id) : `${eventTitle.toLowerCase().replace(/\s+/g, '-')}`;
      const eventLink = event.rsvpUrl || event.url || SITE_URL;

      const descriptionText = `Fecha: ${eventDate} | Hora: ${eventTime} | Lugar: ${eventLocation}`;

      return `    <item>
      <title><![CDATA[${eventTitle}]]></title>
      <link>${eventLink}</link>
      <guid isPermaLink="false">uugc-event-${eventId}</guid>
      <description><![CDATA[${descriptionText}]]></description>
      <pubDate>${eventDate}</pubDate>
    </item>`;
    }).join('\n');

    // 3. Estructura estándar RSS 2.0
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

    // 4. Guardar el resultado en public/feed.xml
    fs.writeFileSync(outputPath, rssXml, 'utf-8');
    console.log(`✅ feed.xml generado exitosamente en: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error al generar el feed RSS:', error);
    process.exit(1);
  }
}

generateRSS();