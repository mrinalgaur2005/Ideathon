"use client"
import EventCard from "../../components/events/card"
import FilterBox from "../../components/events/filterbox"

export default function EventsPage() {


  return (
    <>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-4/5 items-center">
          <EventCard/>
          <EventCard />
          <EventCard />
          <EventCard/>
          <EventCard />
          <EventCard />
        </div>
        <div className="flex flex-col w-1/5 items-center mt-8">
          <button className="text-xl font-bold bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-36 rounded-3xl mb-8 mt-2">
            Add Event
          </button>
          <FilterBox />
        </div>
      </div>
    </>
  )
}