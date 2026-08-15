import { useState, useEffect } from 'react';

export function useEvents() {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // import.meta.env.BASE_URL incluirá '/UnityUsersGroupCaliPortal/'
    fetch(`${import.meta.env.BASE_URL}events.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
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