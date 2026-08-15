import fs from 'fs';
import path from 'path';

const eventsPath = path.resolve('public/events.json');
const outputPath = path.resolve('public/feed.xml');

const events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));

const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Eventos de la Comunidad</title>
    <link>https://tu-usuario.github.io/tu-repo</link>
    <description>Próximos eventos y talleres interactivos</description>
    <language>es</language>
${events.map(event => `    <item>
      <title><![CDATA[${event.title || 'Evento'}]]></title>
      <description><![CDATA[${event.description || ''} - Ubicación: ${event.location || ''} (${event.time || ''})]]></description>
      <link>${event.rsvpUrl || 'https://tu-usuario.github.io/tu-repo'}</link>
      <guid isPermaLink="false">${event.id}</guid>
      <pubDate>${event.date}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>`;

fs.writeFileSync(outputPath, rssXml);
console.log('✅ feed.xml generado correctamente');