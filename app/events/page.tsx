"use client"
import EventCard from "../../components/events/card"
import FilterBox from "../../components/events/filterbox"
import {useEffect, useState} from "react";
import axios from "axios";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {eventsState} from "../../store/atoms/event";
import {redirect} from "next/navigation";
import {filteredEventsState} from "../../store/atoms/filteredEvents";


export default function EventsPage() {
  const [page, setPage] = useState(1);
  const setEvents = useSetRecoilState(eventsState);
  const events = useRecoilValue(filteredEventsState);
  const selectedEvents = events.slice((page-1)*10, page*10);

  useEffect(() => {
    async function getEvents() {
      await axios.get(`${process.env.BACKEND_URL}/api/events`)
        .then((res) => {
          if (res.status == 200) {
            setEvents(res.data);
          } else {
            redirect("/");
          }
        }).catch((err) => console.log(err));
    }

    setEvents([])
    getEvents();
  })

  return (
    <>
      <div className="flex flex-row h-screen w-full">
        <div className="flex flex-col w-4/5 h-full items-center mt-12">
          <div className="flex flex-col w-full h-5/6 items-center overflow-y-auto">
            {selectedEvents.map((event) =>
              <EventCard key={event.heading} _id={event._id} poster={event.poster} heading={event.heading} eventHostedBy={event.eventHostedBy} description={event.description} tags={event.tags} eventTime={event.eventTime.toString()} eventVenue={event.eventVenue} isInterested={event.isInterested}/>
            )}
          </div>
          <div className="flex flex-row items-center justify-around w-1/3 h-20">
            <button
              onClick={() => {if (page > 1) setPage(page-1)}}
              className="text-xl font-bold h-12 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4"
            >
              Prev
            </button>
            <div>
              {page}
            </div>
            <button
              onClick={() => {
                if (page*10 < events.length) {
                  setPage(page + 1)
                }
              }}
              className="text-xl font-bold h-12 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4"
            >
              Next
            </button>
          </div>
        </div>
        <div className="flex flex-col w-1/5 items-center mt-8">
          <button
            className="text-xl font-bold bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-36 rounded-3xl mb-8 mt-2">
            Add Event
          </button>
          <FilterBox />
        </div>
      </div>
    </>
  )
}