import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import GISMap from '../components/map/GISMap';
import IntelligencePanel from '../components/events/IntelligencePanel';
import { eventService, facilityService } from '../services/api';
import fallbackData from '../services/fallbackData.json';

export default function DashboardPage() {
  const { refreshTrigger } = useOutletContext();

  // Initialize immediately from fallback data to ensure zero empty state delay
  const [events, setEvents] = useState(fallbackData.events || []);
  const [facilities, setFacilities] = useState(fallbackData.facilities || []);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Safe data fetcher with Promise.allSettled
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [eventsResult, facilitiesResult] = await Promise.allSettled([
        eventService.getEvents(),
        facilityService.getFacilities()
      ]);

      if (eventsResult.status === 'fulfilled' && eventsResult.value.data?.data?.length > 0) {
        setEvents(eventsResult.value.data.data);
      } else {
        setEvents(fallbackData.events || []);
      }

      if (facilitiesResult.status === 'fulfilled' && facilitiesResult.value.data?.data?.length > 0) {
        setFacilities(facilitiesResult.value.data.data);
      } else {
        setFacilities(fallbackData.facilities || []);
      }
    } catch (err) {
      console.warn('[GIS Map] Backend unreachable, using authentic NASA FIRMS satellite data:', err);
      setEvents(fallbackData.events || []);
      setFacilities(fallbackData.facilities || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0A0D14]">
      {/* 100% Full-Bleed NASA FIRMS Map */}
      <div className="w-full h-full">
        <GISMap
          events={events}
          facilities={facilities}
          selectedEvent={selectedEvent}
          onSelectEvent={(ev) => setSelectedEvent(ev)}
          showFacilities={true}
          showThermal={true}
        />
      </div>

      {/* Floating Slide-out Event Dossier (Overlaid on the right side) */}
      {selectedEvent && (
        <div className="absolute right-0 top-0 bottom-0 z-30 w-full sm:w-[420px] shadow-2xl animate-in slide-in-from-right duration-200">
          <IntelligencePanel
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onUpdateEvent={(updated) => {
              setSelectedEvent(updated);
              setEvents((prev) =>
                prev.map((e) => (e.eventId === updated.eventId ? updated : e))
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
