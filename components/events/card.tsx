"use client"
import axios from "axios";
import Tag from "./tag";
import {useRouter} from "next/navigation";
import {useState} from "react";

interface EventCardProps {
  _id: string,
  poster: string,
  heading: string,
  eventHostedBy: string,
  description: string,
  tags: string[],
  eventTime: Date,
  eventVenue: string,
  isInterested: boolean,
}

export default function EventCard({_id, poster, heading, eventHostedBy, description, tags, eventTime, eventVenue, isInterested,}: EventCardProps) {
  const [interested, setInterested] = useState(isInterested);
  async function handleInterested() {
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id}`);
      if (res.status === 200) {
        console.log("Interest status updated");
        // Update local interestedArr state or trigger a re-fetch
        setInterested(!interested);
      }
    } catch (error) {
      console.log("Error updating interest status:", error);
    }
  }

  const router = useRouter();
  return (
    <>
      <div
        className="flex flex-row w-3/5 h-64 mt-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50"
      >
        <img
          src={poster}
          alt=""
          className="h-64 w-1/3 object-cover overflow-hidden"
        />
        <div className="flex flex-col ml-4 w-2/3 h-full">
          <div className="flex flex-row justify-between w-full h-1/5 items-center">
            <div className="text-2xl font-bold" onClick={()=> router.push(`/events/${_id}`)}>
              {heading}
            </div>
            <div className="text-2xl font-bold mr-4">
              {eventHostedBy}
            </div>
          </div>
          <div className="w-full h-2/5 pl-2">
            {description}
          </div>
          <div className="flex flex-row w-full h-1/5 items-center font-bold ">
            <div className="text-lg font-bold">
              Tags:
            </div>
            {tags.map((tag) =>
              <Tag tag={tag} key={tag}/>
            )}
          </div>
          <div className="flex flex-row justify-between items-center w-full h-1/5">
            <div className="flex flex-col w-2/3 h-full">
              <div className=" font-bold">
                Time:   <span className="ml-3">{new Date(eventTime).toLocaleString()}</span>
              </div>
              <div className=" font-bold">
                Venue:   <span className="ml-3">{eventVenue}</span>
              </div>
            </div>
            <button
              className={`text-lg font-bold h-3/5 ${
                isInterested
                  ? "bg-red-600"
                  : "bg-gradient-to-br from-cyan-600 to-cyan-400"
              } text-white w-1/3 rounded-3xl mr-4`}
              onClick={handleInterested}
            >
              {interested ? "Interested" : "Not Interested"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
