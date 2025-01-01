"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { useModel } from "../../../../hooks/user-model-store";

interface Event {
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

export default function EditEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { allClubs, setSingleEvent, singleEvent, setAllEvents } = useModel();
  
  const [eventHostedBy, setEventHostedBy] = useState<string>("");
  const [tag1, setTag1] = useState<string>("");
  const [tag2, setTag2] = useState<string>("");
  const [tag3, setTag3] = useState<string>("");
  const [heading, setHeading] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [poster, setPoster] = useState<string>("");
  const [eventAttachments, setEventAttachments] = useState<string[]>([]);
  const [eventVenue, setEventVenue] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const getEventId = async () => {
      const resolvedParams = await params; // Await the params Promise
      if (resolvedParams.eventId) {
        fetchEventDetails(resolvedParams.eventId);
      }
    };

    getEventId();
  }, [params]);

  const fetchEventDetails = async (eventId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${eventId}`);
      const event = response.data.data;
      setSingleEvent(event);

      // Pre-fill form with the fetched event details
      setEventHostedBy(event.eventHostedBy);
      setHeading(event.heading);
      setDescription(event.description);
      setPoster(event.poster);
      setEventVenue(event.eventVenue);
      setEventAttachments(event.eventAttachments);
      setDate(event.eventTime.slice(0, 10));
      setTime(event.eventTime.slice(11, 16));
      setTag1(event.tags[0] || "");
      setTag2(event.tags[1] || "");
      setTag3(event.tags[2] || "");
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  function handlePosterUpload(result: any) {
    if (result.event === "success") {
      setPoster(result.info.secure_url);
    }
  }

  function handleEventAttachmentsUpload(result: any) {
    if (result.event === "success") {
      setEventAttachments((prev) => [...prev, result.info.secure_url]);
    }
  }

  async function handleSaveEvent() {
    if (!poster || !date || !time || !eventHostedBy || !description || !eventVenue) {
      return;
    }

    const tags = [];
    if (tag1 !== "") tags.push(tag1);
    if (tag2 !== "") tags.push(tag2);
    if (tag3 !== "") tags.push(tag3);

    const eventTime = new Date(`${date}T${time}`);

    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/edit-event/${(await params).eventId}`, {
        eventHostedBy,
        poster,
        heading,
        tags,
        description,
        eventAttachments,
        eventVenue,
        eventTime,
      });

      if (res.status === 200) {
        setSingleEvent(res.data.data);
        redirect(`/events/${res.data._id}`);
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  }

  if (!singleEvent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="flex flex-col w-2/5 h-4/5 justify-evenly items-center border-4 border-solid rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 text-lg bg-gradient-to-br from-gray-200/60 to-gray-50/60">
        <div className="text-3xl font-bold">Edit Event</div>
        <div className="flex flex-row justify-between items-center w-4/5 h-1/4">
          <div className="flex flex-col items-center w-2/5 h-5/6 bg-gradient-to-br from-cyan-700 to-cyan-500 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <label className="text-white text-xl font-bold text-center mt-2">Select Club</label>
            <select
              value={eventHostedBy}
              onChange={(e) => setEventHostedBy(e.target.value)}
              className="mt-4 w-3/4 pl-2"
            >
              {/* Clubs dropdown */}
              {allClubs.map((club) => (
                <option key={club._id.toString()} value={club.clubName}>
                  {club.clubName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center w-2/5 h-5/6 bg-gradient-to-br from-cyan-700 to-cyan-500 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <label className="text-white text-xl font-bold text-center mt-2">Select Tags</label>
            <select value={tag1} onChange={(e) => setTag1(e.target.value)} className="mt-4 w-3/4 pl-2">
              <option>Tag1</option>
              <option>Tag2</option>
              <option>Tag3</option>
            </select>
            <select value={tag2} onChange={(e) => setTag2(e.target.value)} className="mt-4 w-3/4 pl-2">
              <option>Tag1</option>
              <option>Tag2</option>
              <option>Tag3</option>
            </select>
            <select value={tag3} onChange={(e) => setTag3(e.target.value)} className="mt-4 w-3/4 pl-2">
              <option>Tag1</option>
              <option>Tag2</option>
              <option>Tag3</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSaveEvent}
          className="text-xl font-bold bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-36 rounded-3xl h-12"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
