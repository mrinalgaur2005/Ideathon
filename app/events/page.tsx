"use client";
import EventCard from "../../components/events/card";
import FilterBox from "../../components/events/filterbox";
import { useEffect, useState, useMemo } from "react";
import { useModel } from "../../hooks/user-model-store";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const { allEvents, isLoading, setAllEvents, setLoading } = useModel();
  const [page, setPage] = useState(1);
  const router = useRouter();

  const [filterCriteria, setFilterCriteria] = useState<string[]>([]);
  const maxPage = Math.ceil(allEvents.length / 10);

  const filteredEvents = useMemo(() => {
    if (filterCriteria.length === 0) return allEvents;
    return allEvents.filter((event) =>
      filterCriteria.every((filter) =>
        event.tags
          .map((tag) => tag.trim().toLowerCase())
          .includes(filter.trim().toLowerCase())
      )
    );
  }, [allEvents, filterCriteria]);

  const selectedEvents = useMemo(() => {
    const startIndex = (page - 1) * 10;
    return filteredEvents.slice(startIndex, startIndex + 10);
  }, [filteredEvents, page]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events`);
        const events = await response.data;
        setAllEvents(events);
      } catch (error) {
        console.error("Failed to fetch all events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, [setAllEvents, setLoading]);

  return (
    <div className="flex flex-row h-screen w-full bg-gradient-to-b from-[#0B0C10] to-[#1F2833] overflow-auto">
      <div className="flex flex-col w-4/5 h-full items-center mt-12">
        <div className="flex flex-col w-full h-5/6 items-center overflow-y-auto">
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : (
            selectedEvents.map((event) => (
              <EventCard
                key={event._id.toString()}
                _id={event._id.toString()}
                poster={event.poster}
                heading={event.heading}
                eventHostedBy={event.eventHostedBy}
                description={event.description}
                tags={event.tags}
                eventTime={event.eventTime}
                eventVenue={event.eventVenue}
                isInterested={event.isInterested}
              />
            ))
          )}
        </div>
        <div className="flex flex-row items-center justify-around w-1/3 h-20 text-white">
          {/* Prev Button */}
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            className="text-lg font-bold h-12 px-8 bg-gradient-to-br from-[#66FCF1] to-[#45A29E] text-black rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            Prev
          </button>

          <div className="text-white text-xl font-semibold">{page}</div>

          {/* Next Button */}
          <button
            onClick={() => page < maxPage && setPage(page + 1)}
            className="text-lg font-bold h-12 px-8 bg-gradient-to-br from-[#66FCF1] to-[#45A29E] text-black rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex flex-col w-1/5 items-center mt-8">
        <button
          className="text-xl font-bold  bg-gradient-to-br from-[#66FCF1] to-[#45A29E] text-black w-36 rounded-3xl mb-8 mt-2 hover:scale-105 transition-all"
          onClick={() => router.push("/events/add-event")}
        >
          Add Event
        </button>
        <FilterBox
          onFilterChange={(filters) => {
            setFilterCriteria(filters);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
