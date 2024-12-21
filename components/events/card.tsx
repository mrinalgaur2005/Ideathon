import Tag from "./tag";
import mongoose from "mongoose";
import axios from "axios";

interface EventCardProps {
  _id: mongoose.Types.ObjectId,
  poster: string,
  heading: string,
  eventHostedBy: string,
  description: string,
  tags: string[],
  eventTime: string,
  eventVenue: string,
  isInterested: boolean,
}

export default function EventCard({_id, poster, heading, eventHostedBy, description, tags, eventTime, eventVenue, isInterested} : EventCardProps) {

  async function handleInterested() {
    try {
      await axios.patch(`${process.env.BACKEND_URL}/api/events/interested/${_id}`)
        .then(res => {
          if (res.status === 200) {
            console.log(res.data);
            isInterested = !isInterested;
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        className="flex flex-row w-3/5 h-52 mt-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50"
      >
        <img
          src={poster}
          alt=""
          className="h-full w-1/3 object-cover"
        />
        <div className="flex flex-col ml-4 w-2/3 h-full">
          <div className="flex flex-row justify-between w-full h-1/5 items-center">
            <div className="text-3xl font-bold">
              {heading}
            </div>
            <div className="text-3xl font-bold mr-4">
              {eventHostedBy}
            </div>
          </div>
          <div className="w-full h-2/5 pl-2">
            {description}
          </div>
          <div className="flex flex-row w-full h-1/5 items-center font-bold ">
            <div className="text-xl font-bold">
              Tags:
            </div>
            {tags.map((tag) =>
              <Tag tag={tag} key={tag} />
            )}
          </div>
          <div className="flex flex-row justify-between items-center w-full h-1/5">
            <div className="text-xl font-bold">
              Time: {eventTime}
            </div>
            <div className="text-xl font-bold">
              Venue: {eventVenue}
            </div>
            <button
              className="text-xl font-bold h-4/5 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4"
              onClick={handleInterested}
            >
              {isInterested ? "Interested" : "Not Interested"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
