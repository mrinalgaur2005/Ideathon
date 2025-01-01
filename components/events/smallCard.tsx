import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Props {
  heading: string;
  isInterested: boolean;
  eventTime: Date;
  eventVenue: string;
  _id: string;
  isSecy: boolean;
}

export default function SmallEventCard({ heading, isInterested, eventTime, eventVenue, _id, isSecy }: Props) {
  const [interested, setInterested] = useState<boolean>(isInterested);
  const router = useRouter();

  async function handleInterested() {
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id}`);
      if (res.status === 200) {
        console.log("Interest status updated");
        setInterested(!interested);
      }
    } catch (error) {
      console.log("Error updating interest status:", error);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${_id}`);
      if (res.status === 200) {
        console.log("Event deleted");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-3xl h-auto mt-8 border rounded-xl border-[#45A29E] shadow-md bg-gradient-to-b from-[#1F2833] to-[#0B0C10] p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#C5C6C7] mb-2 sm:mb-0">{heading}</h2>
        <button
          className={`text-lg font-bold py-2 px-6 rounded-full transition-all duration-300 ${
            interested
              ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
              : "bg-gradient-to-br from-[#45A29E] to-[#66FCF1] hover:from-[#66FCF1] hover:to-[#45A29E] text-[#0B0C10]"
          }`}
          onClick={handleInterested}
        >
          {interested ? "Interested" : "Not Interested"}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center text-[#C5C6C7]">
        <div className="text-lg">
          <p>
            <span className="font-semibold">Date:</span> {new Date(eventTime).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Venue:</span> {eventVenue}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center mt-4 sm:mt-0">
          <button
            className="text-lg font-bold py-2 px-6 rounded-full bg-gradient-to-br from-[#45A29E] to-[#66FCF1] hover:from-[#66FCF1] hover:to-[#45A29E] text-[#0B0C10] transition-all duration-300 shadow-md"
            onClick={() => router.push(`/events/${_id}`)}
          >
            Show Details
          </button>
          {isSecy && (
            <div className="flex flex-row mt-2 sm:mt-0 sm:ml-4">
              <button
                className="text-lg font-bold py-2 px-4 rounded-full bg-blue-500 hover:bg-blue-700 text-white transition-all duration-300 shadow-md"
                onClick={() => router.push(`/events/edit-event/${_id}`)}
              >
                Edit
              </button>
              <button
                className="text-lg font-bold py-2 px-4 rounded-full bg-red-500 hover:bg-red-700 text-white transition-all duration-300 shadow-md ml-2"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
