import { useState, useEffect } from 'react';

export function useEvents() {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si tu archivo está en public/events.json usa '/events.json'
    // Si lo pusiste en public/api/events.json usa '/api/events.json'
    fetch('/events.json')
      .then((res) => res.json())
      .then((data) => {
        setEventsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando los eventos:', err);
        setLoading(false);
      });
  }, []);

  return { eventsData, loading };
}