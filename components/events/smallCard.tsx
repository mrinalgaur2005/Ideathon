import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Props {
  heading: string,
  isInterested: boolean,
  eventTime: Date,
  eventVenue: string,
  _id: string
}
export default function SmallEventCard({ heading, isInterested, eventTime, eventVenue, _id }: Props) {
  const [interested, setInterested] = useState<boolean>(isInterested);

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

  const router = useRouter();
  return (
    <>
      <div className="flex flex-col w-4/5 h-1/3 mt-8 border-2 rounded-xl border-[#45A29E] shadow-md shadow-[#66FCF1]/50 bg-gradient-to-b from-[#1F2833] to-[#0B0C10] p-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
        <div className="flex flex-row justify-between w-full h-1/2 items-center">
          <div className="ml-4 text-xl font-bold text-[#C5C6C7]">
            {heading}
          </div>
          <button
            className={`text-lg font-bold h-3/5 w-1/4 rounded-3xl mr-4 text-white transition-all duration-300 ${
              interested
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-br from-[#45A29E] to-[#66FCF1] hover:from-[#66FCF1] hover:to-[#45A29E]"
            }`}
            onClick={handleInterested}
          >
            {interested ? "Interested" : "Not Interested"}
          </button>
        </div>
        <div className="flex flex-row text-lg justify-between w-full h-1/2 items-center text-[#C5C6C7]">
          <div className="ml-4">
            <div>
              Date: <span className="ml-2">{new Date(eventTime).toLocaleString()}</span>
            </div>
            <div>
              Venue: <span className="ml-2">{eventVenue}</span>
            </div>
          </div>
          <button
            className="text-lg font-bold h-3/5 w-1/4 rounded-3xl mr-4 text-[#0B0C10] bg-gradient-to-br from-[#45A29E] to-[#66FCF1] hover:from-[#66FCF1] hover:to-[#45A29E] transition-all duration-300"
            onClick={() => router.push(`/events/${_id}`)}
          >
            Show Details
          </button>
        </div>
      </div>
    </>
  );
}
