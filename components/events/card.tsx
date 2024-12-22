import mongoose from "mongoose";
import axios from "axios";

interface EventCardProps {
  _id: mongoose.Types.ObjectId;
  poster: string;
  heading: string;
  eventHostedBy: mongoose.Types.ObjectId;
  description: string;
  tags: string[];
  eventTime: Date | string;
  eventVenue: string;
  interestedArr: mongoose.Types.ObjectId[];
  userId: string;
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
  interestedArr=[],
  userId,
}: EventCardProps) {
  const isInterested = interestedArr.some((id) => id.toString() === userId);

  async function handleInterested() {
    try {
      const res = await axios.patch(
        `${process.env.BACKEND_URL || "http://localhost:3000"}/api/events/interested/${_id}`
      );
      if (res.status === 200) {
        console.log("Interest status updated");
        // Update local interestedArr state or trigger a re-fetch
      }
    } catch (error) {
      console.error("Error updating interest status:", error);
    }
  }
  
  return (
    <div className="flex flex-row w-3/5 h-52 mt-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
      <img src={poster} alt={heading} className="h-full w-1/3 object-cover" />
      <div className="flex flex-col ml-4 w-2/3 h-full">
        <div className="flex flex-row justify-between w-full h-1/5 items-center">
          <div className="text-3xl font-bold">{heading}</div>
        </div>
        <div className="w-full h-2/5 pl-2">{description}</div>
        <div className="flex flex-row w-full h-1/5 items-center font-bold">
          <div className="text-xl font-bold">Tags:</div>
          {tags.map((tag) => (
            <span
              key={tag}
              className="ml-2 text-cyan-600 bg-cyan-200 rounded-full px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-row justify-between items-center w-full h-1/5">
          <div className="text-xl font-bold">
            Time: {new Date(eventTime).toLocaleString()}
          </div>
          <div className="text-xl font-bold">Venue: {eventVenue}</div>
          <button
            onClick={handleInterested}
            className={`text-xl font-bold h-4/5 ${
              isInterested
                ? "bg-red-600"
                : "bg-gradient-to-br from-cyan-600 to-cyan-400"
            } text-white w-1/4 rounded-3xl mr-4`}
          >
            {isInterested ? "Interested" : "Not Interested"}
          </button>
        </div>
      </div>
    </div>
  );
}
