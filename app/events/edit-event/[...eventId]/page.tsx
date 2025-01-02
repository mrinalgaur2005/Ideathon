"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { useModel } from "../../../../hooks/user-model-store";
import NavigatorButton from "../../../../components/general/navigator"; // Import the NavigatorButton component

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
      const resolvedParams = await params;
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

  const dropdownItems = [
    { label: "Events", href: "/events" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Home", href: "/" },
  ];

  

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-900 text-gray-300">
      {/* Navigator Button */}
      <div className="absolute top-6 right-6">
        <NavigatorButton buttonText="Navigate" dropdownItems={dropdownItems} />
      </div>

      <div className="flex flex-col w-full max-w-4xl mx-auto h-auto justify-evenly items-center border border-blue-900 shadow-lg shadow-gray-700/60 text-lg rounded bg-gradient-to-br from-gray-800 to-gray-900 p-8 mt-12 sm:mt-24">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">Edit Event</h1>

        {/* Club Selection */}
        <div className="w-full mb-6">
          <label className="block text-lg font-medium mb-2">Select Club</label>
          <select
            value={eventHostedBy}
            onChange={(e) => setEventHostedBy(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {allClubs.map((club) => (
              <option key={club._id} value={club.clubName}>
                {club.clubName}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Selection */}
        <div className="w-full mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[tag1, tag2, tag3].map((tag, index) => (
            <div key={index}>
              <label className="block text-lg font-medium mb-2">Tag {index + 1}</label>
              <select
                value={tag}
                onChange={(e) => {
                  if (index === 0) setTag1(e.target.value);
                  else if (index === 1) setTag2(e.target.value);
                  else setTag3(e.target.value);
                }}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Tag1</option>
                <option>Tag2</option>
                <option>Tag3</option>
              </select>
            </div>
          ))}
        </div>

        {/* Poster Upload */}
        <div className="w-full mb-6">
          <label className="block text-lg font-medium mb-2">Upload Poster</label>
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
            onSuccess={handlePosterUpload}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
          >
            Upload Poster
          </CldUploadButton>
        </div>

        {/* Attachments Upload */}
        <div className="w-full mb-6">
          <label className="block text-lg font-medium mb-2">Upload Attachments</label>
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
            onSuccess={handleEventAttachmentsUpload}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
          >
            Upload Attachments
          </CldUploadButton>
        </div>

        {/* Event Details Inputs */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-lg font-medium mb-2">Event Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Event Venue</label>
            <input
              type="text"
              value={eventVenue}
              onChange={(e) => setEventVenue(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Event Date and Time */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-lg font-medium mb-2">Event Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Event Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="w-full mb-6">
          <label className="block text-lg font-medium mb-2">Event Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="w-full flex justify-center">
          <button
            onClick={handleSaveEvent}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-gray-400 hover:text-white font-bold rounded transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

