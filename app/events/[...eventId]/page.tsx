'use client'
import {useEffect, useState} from "react";
import { useModel } from "../../../hooks/user-model-store";
import {redirect, useParams, useRouter} from "next/navigation";
import axios from "axios";
import StudentCard from "../../../components/student/studentCard";
import mongoose from "mongoose";

interface InterestedMembers {
  _id: mongoose.Types.ObjectId;
  name: string;
  profile: string;
  student_id: string;
}

export default function Event() {
  const [interested, setInterested] = useState<boolean>(false);
  const [interestedMembers, setInterestedMembers] = useState<InterestedMembers[]>([]);
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId?.[0];
  const { singleEvent, setSingleEvent, setLoading } = useModel();

  useEffect(() => {
    if (!eventId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${eventId}`);
        if (res.status === 200) {
          setSingleEvent(res.data.data);
          setInterested(res.data.data.isInterested);
          setInterestedMembers(res.data.data.interestedMembersArr);
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
  }, [eventId, setSingleEvent, setLoading, router]);

  if (!singleEvent) {
    return <div>Loading...</div>;
  }
  const event = singleEvent;
  console.log("fe")
  console.log(event);

  async function handleInterested() {
    if (!event) {
      return;
    }

    const { _id } = event;
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id.toString()}`);
      if (res.status === 200) {
        if (!interested) {
          setInterestedMembers((prev) => [...prev, res.data.studentInfo]);
        } else {
          setInterestedMembers((prev) => prev.filter((item) => item._id.toString() !== res.data.studentInfo._id.toString()));
        }

        setInterested((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!event) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <>
      <div className="flex flex-col items-center w-full h-screen">
        <div className="flex flex-row items-center w-3/5 h-1/3 mt-12 justify-between ">
          <div className="flex flex-col w-3/5 h-full ">
            <div className="flex flex-row items-center w-full justify-between">
              <div className="text-3xl font-bold">
                {event?.heading}
              </div>
              <button
                className={`text-lg font-bold ${
                  !interested
                    ? "bg-red-600"
                    : "bg-gradient-to-br from-cyan-600 to-cyan-400"
                } text-white w-1/3 rounded-3xl mr-4`}
                onClick={handleInterested}
              >
                {interested ? "Interested" : "Not Interested"}
              </button>
            </div>
            <div className="text-xl font-bold mt-3 mb-2">
              Description
            </div>
            <div
              className="h-full w-full justify-evenly border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              {event?.description}
            </div>
          </div>
          <img
            src={event?.poster}
            className="h-full w-1/3 object-fill"
            alt=""
          />
        </div>
        <div className="flex flex-row w-3/5 h-3/5 mt-10 justify-between">
          <div className="flex flex-col w-3/5 h-full">
            <div className="flex flex-row items-center justify-between w-full h-3/5 ">
              <div className="flex flex-col w-1/2 h-3/4 text-lg font-bold pl-2 justify-around border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
                <div>
                  Venue: <span className="ml-2">{event?.eventVenue}</span>
                </div>
                <div>
                  Date: <span className="ml-2">{new Date(event?.eventTime).toLocaleString()}</span>
                </div>
                <div>
                Hosted By: <span className="ml-2">{event?.eventHostedBy}</span>
                </div>
              </div>
              <div className="flex flex-col w-1/3 h-3/4 items-center text-lg font-bold border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
                <div className="text-xl mt-3 mb-2">
                  Tags
                </div>
                {event?.tags.map((tag) => {
                  return <div key={tag} className="mt-2">{tag}</div>
                })}
              </div>
            </div>
            <div className="flex flex-col w-full h-2/5 border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              <div className="ml-2 text-2xl font-bold">
                Attachments
              </div>
              {/*attachments */}
            </div>
          </div>
          <div className="flex flex-col items-center w-1/3 h-full overflow-y-auto border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <div className="text-2xl font-bold mt-3 mb-2">
              Interested People
            </div>
            {interestedMembers.map((member) => {
              return <StudentCard key={member.student_id} name={member.name} student_id={member.student_id} profile={member.profile} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}