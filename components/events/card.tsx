// EventCard Component
"use client";
import axios from "axios";
import Tag from "./tag";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EventCardProps {
  _id: string;
  poster: string;
  heading: string;
  eventHostedBy: string;
  description: string;
  tags: string[];
  eventTime: Date;
  eventVenue: string;
  isInterested: boolean;
}

export default function EventCard({
  _id,
  poster,
  heading,
  eventHostedBy,
  description,
  tags,
  eventTime,
  eventVenue,
  isInterested,
}: EventCardProps) {
  const [interested, setInterested] = useState(isInterested);

  async function handleInterested() {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id}`
      );
      if (res.status === 200) {
        console.log("Interest status updated");
        setInterested(!interested);
      }
    } catch (error) {
      console.log("Error updating interest status:", error);
    }
  }

  const router = useRouter();
  return (
    <div
      className="flex flex-col sm:flex-row w-full sm:w-3/5 mt-8 rounded-xl border-[1px] border-[#66FCF1] bg-gradient-to-br from-[#0B0C10] to-[#1F2833] shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Image Section */}
      <div className="w-full sm:w-1/3 h-64 sm:h-[90%]">
        <img
          src={poster}
          alt="event poster"
          className="h-full w-full object-cover rounded-t-xl sm:rounded-l-xl"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between w-full sm:w-2/3 p-6 text-white">
        <div>
          {/* Heading and Hosted By */}
          <div className="flex justify-between items-center">
            <h2
              className="text-3xl font-extrabold tracking-wide text-[#66FCF1] hover:text-[#C5C6C7] transition-colors cursor-pointer"
              onClick={() => router.push(`/events/${_id}`)}
            >
              {heading}
            </h2>
            <span className="text-xl font-semibold text-[#C5C6C7]">
              {eventHostedBy}
            </span>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>

          {/* Description */}
          <p className="mt-4 text-sm text-[#C5C6C7] leading-relaxed max-h-32 overflow-hidden hover:overflow-auto">
            {description}
          </p>
        </div>

        {/* Time and Venue */}
        <div className="mt-6">
          <p className="text-sm">
            <span className="font-bold">Time:</span> {" "}
            {new Date(eventTime).toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-bold">Venue:</span> {" "}
            {eventVenue}
          </p>
        </div>

        {/* Interested Button */}
        <button
          className={`mt-6 px-4 py-2 rounded-full font-bold text-sm w-1/2 self-center transition-all ${
            interested
              ? "bg-[#66FCF1] text-black hover:bg-[#45A29E]"
              : "bg-[#C5C6C7] text-black hover:bg-[#A8C8D2]"
          }`}
          onClick={handleInterested}
        >
          {interested ? "Interested" : "Not Interested"}
        </button>
      </div>
    </div>
  );
}
