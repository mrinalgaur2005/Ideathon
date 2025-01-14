"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import mongoose from "mongoose";
import DotsLoader from "../../../components/loading/dotLoader";
import { FaMapMarkerAlt, FaClock, FaTags, FaUser } from "react-icons/fa";


interface SingleEvent {
  _id: mongoose.Types.ObjectId;
  poster: string;
  heading: string;
  eventHostedBy: string;
  description: string;
  tags: string[];
  eventTime: Date;
  eventVenue: string;
  isInterested: boolean;
  interestedMembersArr: {
    _id: mongoose.Types.ObjectId;
    name: string;
    student_id: string;
    profile: string
  } [];
  eventAttachments: string[]
}

export default function Event() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId?.[0];
  const [eventData, setEventData] = useState<SingleEvent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${eventId}`);
        if (res.status === 200) {
          setEventData(res.data.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [eventId, setLoading, router]);

  async function toggleInterested() {
    if (!eventData) return;

    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${eventId}`);
      if (res.status === 200) {
        if (eventData.isInterested) {
          setEventData({
            ...eventData,
            isInterested: !eventData.isInterested,
            interestedMembersArr: eventData.interestedMembersArr.filter((member) => member._id.toString() !== res.data.studentInfo._id.toString()),
          });
        } else {
          setEventData({
            ...eventData,
            isInterested: !eventData.isInterested,
            interestedMembersArr: [...eventData.interestedMembersArr, res.data.studentInfo],
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!eventData || loading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        {/* Event Poster */}
        <div className="mb-6">
          <img
            src={eventData.poster}
            alt={eventData.heading}
            className="rounded-lg shadow-md w-full"
          />
        </div>

        {/* Event Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-blue-400">{eventData.heading}</h1>
          <p className="text-lg text-gray-300">{eventData.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg shadow-md">
              <FaUser className="text-yellow-400 text-2xl" />
              <p className="text-gray-300">
                Hosted by: <span className="text-blue-300 font-semibold">{eventData.eventHostedBy}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg shadow-md">
              <FaClock className="text-green-400 text-2xl" />
              <p className="text-gray-300">
                Time:{" "}
                <span className="text-blue-300 font-semibold">
                  {new Date(eventData.eventTime).toLocaleString()}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg shadow-md">
              <FaMapMarkerAlt className="text-red-400 text-2xl" />
              <p className="text-gray-300">
                Venue: <span className="text-blue-300 font-semibold">{eventData.eventVenue}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg shadow-md">
              <FaTags className="text-pink-400 text-2xl" />
              <p className="text-gray-300">
                Tags:{" "}
                {eventData.tags.map((tag, index) => (
                  <span key={index} className="text-blue-300">
                    {tag}
                    {index < eventData.tags.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Interested Button */}
          <button
            onClick={toggleInterested}
            className={`w-full py-3 rounded-lg text-lg font-bold shadow-md ${
              eventData.isInterested
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {eventData.isInterested ? "Not Interested" : "Interested"}
          </button>
        </div>

        {/* Interested Members */}
        {eventData.interestedMembersArr.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Interested Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventData.interestedMembersArr.map((member) => (
                <div
                  key={member._id.toString()}
                  className="bg-gray-900 p-4 rounded-lg shadow-md flex items-center space-x-4"
                >
                  <img
                    src={member.profile}
                    className="w-14 h-14 rounded-full shadow-lg border-2 border-blue-400"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-400">{member.student_id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {eventData.eventAttachments.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-green-400 mb-6">Event Attachments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventData.eventAttachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 p-4 rounded-lg shadow-md hover:bg-gray-700"
                >
                  Attachment {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
