import React, { useState, useEffect, useMemo } from 'react';
import { useHeader } from '../context/HeaderContext';
import { useEvents } from '../hooks/useEvents';
import membersDataRaw from '../data/members.json';

const organicShapes = [
    "rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%]",
    "rounded-[50%_50%_20%_80%_/_25%_80%_20%_75%]",
    "rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]",
    "rounded-[50%_50%_20%_80%_/_25%_80%_20%_75%]"
];

// Mapa para validar mes por texto de 3 letras (en español)
const MONTH_MAP = {
    ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
    JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11
};

const membersData = membersDataRaw.map((member) => ({
    ...member,
    avatar: member.avatar.startsWith('http')
        ? member.avatar
        : `${import.meta.env.BASE_URL}${member.avatar.replace(/^\//, '')}`,
}));

export default function CommunityNetworkPage() {
    const { searchQuery, activeCategory } = useHeader();
    const { eventsData = [], loading } = useEvents();

    const [page, setPage] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [fetchedXml, setFetchedXml] = useState('');

    // Interceptador / Lector de feed.xml estático
    useEffect(() => {
        const checkAndFetchFeed = async () => {
            const pathname = window.location.pathname;
            const hash = window.location.hash;

            const isFeedPath = pathname.endsWith('/feed.xml') || hash === '#/feed.xml' || hash === '#feed.xml';

            try {
                const baseUrl = import.meta.env.BASE_URL.endsWith('/')
                    ? import.meta.env.BASE_URL
                    : `${import.meta.env.BASE_URL}/`;

                const response = await fetch(`${baseUrl}feed.xml`);
                if (response.ok) {
                    const xmlText = await response.text();
                    setFetchedXml(xmlText);

                    // Si la URL apunta explícitamente a feed.xml, reemplaza el documento
                    if (isFeedPath) {
                        document.open();
                        document.write(xmlText);
                        document.close();
                    }
                }
            } catch (error) {
                console.error('Error al cargar feed.xml:', error);
            }
        };

        checkAndFetchFeed();
    }, []);

    // Filtrar eventos únicamente pertenecientes al mes en curso
    const filteredEvents = useMemo(() => {
        const currentMonthIndex = new Date().getMonth();

        return eventsData.filter((event) => {
            if (!event.date) return false;
            const [, monthStr] = event.date.trim().split(' ');
            if (!monthStr) return false;

            const eventMonthIndex = MONTH_MAP[monthStr.toUpperCase()];
            return eventMonthIndex === currentMonthIndex;
        });
    }, [eventsData]);

    const EVENTS_PER_PAGE = 2;
    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_PAGE));

    const handlePrev = () => {
        setPage((prevPage) => Math.max(0, prevPage - 1));
    };

    const handleNext = () => {
        setPage((prevPage) => Math.min(totalPages - 1, prevPage + 1));
    };

    const startIndex = page * EVENTS_PER_PAGE;
    const currentEvents = filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);

    const handleCopyEndpoint = () => {
        const baseUrl = import.meta.env.BASE_URL.endsWith('/')
            ? import.meta.env.BASE_URL
            : `${import.meta.env.BASE_URL}/`;

        const rssEndpoint = `${window.location.origin}${baseUrl}feed.xml`;

        navigator.clipboard.writeText(rssEndpoint);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const featuredMembers = membersData.slice(0, 4);

    // Contenido a mostrar en el bloque de código RSS
    const rssPreviewText = fetchedXml || '-';

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-semibold text-black mb-4">
                    Red de la Comunidad
                </h1>
                <p className="font-['Inter'] text-lg text-[#45464d] max-w-3xl">
                    Conéctate con arquitectos de motores, artistas técnicos e investigadores de laboratorio que están dando forma a la próxima generación de experiencias interactivas.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Colaboradores Principales */}
                <section className="md:col-span-8 bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl p-6 flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b border-black/10 pb-4">
                        <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-black">
                            Colaboradores Principales
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsMembersModalOpen(true)}
                            className="text-black font-['JetBrains_Mono'] text-xs uppercase tracking-wider font-medium hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                        >
                            Ver todos ({membersData.length}){' '}
                            <span className="material-symbols-outlined text-sm">
                                arrow_forward
                            </span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {featuredMembers.map((member, index) => {
                            const shapeClass = organicShapes[index % organicShapes.length];

                            return (
                                <div key={member.id} className="flex flex-col items-center gap-3 group cursor-pointer">
                                    <div className={`w-24 h-24 ${shapeClass} overflow-hidden border border-[#c6c6cd] p-1 group-hover:border-black transition-all duration-300 hover:rounded-full`}>
                                        <div className={`w-full h-full ${shapeClass} overflow-hidden group-hover:rounded-full transition-all duration-800`}>
                                            <img
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                                alt={member.name}
                                                src={member.avatar}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-['Inter'] text-base font-medium text-black">
                                            {member.name}
                                        </h3>
                                        <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Widget de Eventos del Mes */}
                <section className="md:col-span-4 bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-black">
                            Eventos del Mes
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={page === 0 || loading}
                                className="w-8 h-8 rounded border border-[#c6c6cd] flex items-center justify-center text-[#45464d] hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:hover:border-[#c6c6cd] disabled:hover:text-[#45464d] cursor-pointer disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    chevron_left
                                </span>
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={page >= totalPages - 1 || loading}
                                className="w-8 h-8 rounded border border-[#c6c6cd] flex items-center justify-center text-[#45464d] hover:border-black hover:text-black transition-colors disabled:opacity-[#c6c6cd] disabled:hover:text-[#45464d] cursor-pointer disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-rows-2 gap-4 min-h-[160px]">
                        {loading ? (
                            <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
                                Cargando eventos...
                            </p>
                        ) : currentEvents.length > 0 ? (
                            currentEvents.map((event, idx) => {
                                const [day, month] = event.date ? event.date.split(' ') : ['00', 'EVENTO'];

                                return (
                                    <div
                                        key={`${event.id}-${startIndex + idx}`}
                                        className="group flex gap-4 p-3 rounded hover:bg-[#f6f3f5] transition-colors border-l-2 border-transparent hover:border-black cursor-pointer h-[70px] items-center"
                                    >
                                        <div className="flex flex-col items-center justify-center min-w-[3rem]">
                                            <span className="font-['JetBrains_Mono'] text-xs text-[#45464d] font-medium uppercase tracking-wider">
                                                {month || 'EVENTO'}
                                            </span>
                                            <span className="font-['Space_Grotesk'] text-2xl font-semibold text-black leading-none">
                                                {day || '00'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-['Inter'] text-base font-medium text-black group-hover:underline line-clamp-1">
                                                {event.title}
                                            </h4>
                                            <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[14px]">
                                                    schedule
                                                </span>{' '}
                                                {event.location} • {event.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="font-['JetBrains_Mono'] text-xs text-[#45464d]">
                                No hay eventos programados para este mes.
                            </p>
                        )}
                    </div>
                </section>

                {/* Previsualización del RSS Feed Endpoint */}
                <section className="md:col-span-12 bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-black/10 pb-4">
                        <div>
                            <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-black flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">rss_feed</span>
                                RSS Eventos 
                            </h2>
                            <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] mt-1">
                                Suscripción RSS accesible directamente en <code className="bg-[#f6f3f5] px-1 rounded text-black">feed.xml</code>.
                            </p>
                        </div>
                        <button
                            onClick={handleCopyEndpoint}
                            className="px-4 py-2 border border-[#c6c6cd] rounded font-['JetBrains_Mono'] text-xs font-medium uppercase tracking-wider text-black hover:bg-[#f6f3f5] transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">
                                {copied ? 'check' : 'content_copy'}
                            </span>
                            {copied ? '¡URL Copiada!' : 'Copiar URL'}
                        </button>
                    </div>

                    <div className="bg-[#1e1e1e] border border-black/20 rounded-lg p-4 font-['JetBrains_Mono'] text-xs flex flex-col">
                        <div className="text-gray-400 mb-2 border-b border-gray-700 pb-2 flex justify-between items-center text-[10px]">
                            <span>GET /feed.xml</span>
                            <span className="text-emerald-400">200 OK (application/xml)</span>
                        </div>
                        <pre className="m-0 leading-relaxed text-[#d4d4d4] max-h-[300px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
                            <code>{rssPreviewText}</code>
                        </pre>
                    </div>
                </section>
            </div>

            {/* Modal emergente */}
            {isMembersModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-black/10 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-black/10 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="font-['Space_Grotesk'] text-2xl font-semibold text-black">
                                    Todos los Colaboradores Principales
                                </h3>
                                <p className="font-['JetBrains_Mono'] text-xs text-[#45464d] mt-1">
                                    Directorio completo del equipo desde /src/data/members.json
                                </p>
                            </div>
                            <button
                                onClick={() => setIsMembersModalOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f6f3f5] transition-colors text-[#45464d] hover:text-black cursor-pointer border-none bg-transparent"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {membersData.map((member, index) => {
                                const shapeClass = organicShapes[index % organicShapes.length];

                                return (
                                    <div key={member.id} className="flex flex-col items-center gap-3 group">
                                        <div className={`w-20 h-20 ${shapeClass} overflow-hidden border border-[#c6c6cd] p-1 group-hover:border-black transition-all duration-300 hover:rounded-full`}>
                                            <div className={`w-full h-full ${shapeClass} overflow-hidden group-hover:rounded-full transition-all duration-300`}>
                                                <img
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                                    alt={member.name}
                                                    src={member.avatar}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-['Inter'] text-sm font-medium text-black">
                                                {member.name}
                                            </h4>
                                            <p className="font-['JetBrains_Mono'] text-[11px] text-[#45464d]">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}