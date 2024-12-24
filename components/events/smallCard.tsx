import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

interface Props {
  heading: string,
  isInterested: boolean,
  eventTime: Date,
  eventVenue: string,
  _id: string
}
export default function SmallEventCard({heading, isInterested, eventTime, eventVenue, _id}: Props) {
  const [interested, setInterested] = useState<boolean>(isInterested)

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
      <div className="flex flex-col w-4/5 h-1/3 mt-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 flex-shrink-0 ml-6">
        <div className="flex flex-row justify-between w-full h-1/2 items-center">
          <div className="ml-4 text-xl font-bold">
            {heading}
          </div>
          <button
            className={`text-lg font-bold h-3/5 ${
              interested
                ? "bg-red-600"
                : "bg-gradient-to-br from-cyan-600 to-cyan-400"
            } text-white w-1/4 rounded-3xl mr-4`}
            onClick={handleInterested}
          >
            {interested ? "Interested" : "Not Interested"}
          </button>
        </div>
        <div className="flex flex-row text-lg justify-between w-full h-1/2 items-center">
          <div className="ml-4">
            <div className="">
              Date: <span className="ml-2">{new Date(eventTime).toLocaleString()}</span>
            </div>
            <div className="">
              Venue: <span className="ml-2">{eventVenue}</span>
            </div>
          </div>
          <button
            className={`text-lg font-bold h-3/5 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4`}
            onClick={() => router.push(`/events/${_id}`)}
          >
            Show Details
          </button>
        </div>
      </div>
    </>
  );
}