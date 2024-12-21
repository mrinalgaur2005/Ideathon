"use client"

import {useEffect, useState} from "react";
import axios from "axios";
import {redirect} from "next/navigation";
import {CldUploadButton} from "next-cloudinary";

export default function AddEventPage() {
  const [eventHostedBy, setEventHostedBy] = useState<string>("");
  const [tag1, setTag1] = useState<string>("");
  const [tag2, setTag2] = useState<string>("");
  const [tag3, setTag3] = useState<string>("");
  const [heading, setHeading] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [poster, setPoster] = useState<string>("");
  const [eventAttachments, seteventAttachments] = useState<string[]>([]);
  const [clubs, setClubs] = useState<{clubName: string}[]>([]);
  const [eventVenue, setEventVenue] = useState<string>("");
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  function handlePosterUpload(result) {
    if (result.event === "success") {
      setPoster(result.info.secure_url);
    }
  }

  function handleEventAttachmentsUpload(result) {
    if (result.event === "success") {
      seteventAttachments((prev) => [...prev, result.info.secure_url]);
    }
  }

  async function handleAddEvent() {
    if (!poster || !date || !time || !eventHostedBy || !description || !eventVenue) {
      return;
    }
    const tags = [];
    if (tag1 != "") tags.push(tag1);
    if (tag2 != "") tags.push(tag2);
    if (tag3 != "") tags.push(tag3);

    const eventTime = new Date(`${date}T${time}`);

    const res = await axios.post(`${process.env.BACKEND_URL}/api/events/add-event`, {
      eventHostedBy,
      poster,
      heading,
      tags,
      description,
      eventAttachments,
      eventVenue,
      eventTime
    })

    if (res.status == 200) {
      redirect(`/events/${res.data._id}`);
    }
  }

  useEffect(function () {
    setClubs([]);
    async function fetchClubs() {
      await axios.get(`${process.env.BACKEND_URL}/api/club/head`).then((response) => {
        if (response.status == 403) {
          redirect('/');
        }
        setClubs(response.data)
      }).catch((err) => {
        console.log(err);
        redirect('/');
      })
    }

    fetchClubs();
    if (clubs.length == 0) redirect('/');
  }, [])

  return (
    <>
      <div className="flex flex-col w-full h-screen items-center  justify-center">
        <div className="flex flex-col w-2/5 h-4/5 justify-evenly items-center border-4 border-solid rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 text-lg bg-gradient-to-br from-gray-200/60 to-gray-50/60">
          <div className="text-3xl font-bold">
            Add Event
          </div>
          <div className="flex flex-row justify-between items-center w-4/5 h-1/4">
            <div className="flex flex-col items-center w-2/5 h-5/6 bg-gradient-to-br from-cyan-700 to-cyan-500 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              <label className="text-white text-xl font-bold text-center mt-2">
                Select Club
              </label>
              <select value={eventHostedBy} onChange={(e) => setEventHostedBy(e.target.value)} className="mt-4 w-3/4 pl-2">
                {clubs.map((club: {clubName: string}) => {
                  return (
                  <option value={club.clubName} key={club.clubName}>
                    {club.clubName}
                  </option>
                  )
                })}
              </select>
            </div>
            <div className="flex flex-col items-center w-2/5 h-5/6 bg-gradient-to-br from-cyan-700 to-cyan-500 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              <label className="text-white text-xl font-bold text-center mt-2">
                Select Tags
              </label>
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
          <div className="flex flex-col w-4/5 h-2/5 bg-gradient-to-br from-cyan-700 to-cyan-500 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <div className="flex flex-row h-1/6 w-full justify-between   items-center">
              <label htmlFor="heading" className="ml-4 text-white font-bold">
                Heading:
              </label>
              <input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                type="text"
                placeholder="Heading"
                className="w-3/4 mr-4 pl-2"
                id="heading"
              />
            </div>
            <div className="flex flex-row h-2/6 w-full justify-between   pt-2 pb-4">
              <label htmlFor="description" className="ml-4 text-white font-bold">
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="description"
                className="w-3/4 mr-4 pl-2 h-full"
                id="description"
              />
            </div>
            <div className="flex flex-row h-1/6 w-full items-center">
              <label htmlFor="poster" className="ml-4 text-white font-bold">
                Poster:
              </label>
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
                onSuccess={handlePosterUpload}
                className="w-1/4 ml-12 bg-white rounded-full"
              >
                Upload Poster
              </CldUploadButton>
            </div>
            <div className="flex flex-row h-1/6 w-full justify-between   items-center">
              <label htmlFor="venue" className="ml-4 text-white font-bold">
                Venue:
              </label>
              <input
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                type="text"
                placeholder="Venue"
                className="w-3/4 mr-4 pl-2"
                id="venue"
              />
            </div>
            <div className="flex flex-row h-1/6 w-full justify-between  items-center">
              <div className="flex flex-row h-full w-1/2   items-center">
                <label htmlFor="date" className="ml-4 text-white font-bold">
                  Date:
                </label>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="w-3/4 ml-3 pl-2"
                  id="date"
                />
              </div>
              <div className="flex flex-row h-full w-1/2  items-center">
                <label htmlFor="time" className="ml-3 text-white font-bold">
                  Time:
                </label>
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  type="time"
                  className="w-3/4 ml-4 pl-2"
                  id="time"
                />
              </div>
            </div>
          </div>
          <div
            className="flex flex-row items-center h-12 bg-gradient-to-br from-cyan-600 to-cyan-400 w-4/5">
            <label htmlFor="attachments" className="text-white font-bold text-xl ml-4">
              Attachments:
            </label>
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
              onSuccess={handleEventAttachmentsUpload}
              className="w-1/3 ml-12 bg-white rounded-full"
            >
              Upload Attachments
            </CldUploadButton>
          </div>
          <button
            type={"submit"}
            onChange={handleAddEvent}
            className="text-xl font-bold bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-36 rounded-3xl h-12">
            Add Event
          </button>
        </div>
      </div>
    </>
  )
}