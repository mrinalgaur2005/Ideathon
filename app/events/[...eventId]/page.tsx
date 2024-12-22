'use client'
import { useEffect } from "react";
import { useModel } from "../../../hooks/user-model-store";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import StudentCard from "../../../components/student/studentCard";

export default function Event() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;
  const { singleEvent, setSingleEvent, setLoading } = useModel();

  useEffect(() => {
    if (!eventId) return;

    async function fetchData() {
      setLoading(true); // Set loading to true
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${eventId}`);
        if (res.status === 200) {
          setSingleEvent(res.data.data); // Update Zustand state with the fetched event
        } else {
          router.push("/"); // Client-side redirect if response is not successful
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        router.push("/"); // Redirect on error
      } finally {
        setLoading(false); // Set loading to false after the request finishes
      }
    }

    fetchData();
  }, [eventId, setSingleEvent, setLoading]); // Dependencies

  if (!singleEvent) {
    return <div>Loading...</div>; // Show loading state while event data is being fetched
  }
  const event = singleEvent; // Dependency on eventId to trigger re-fetch

  // async function handleInterested() {
  //   if (!event) {
  //     return;
  //   }

  //   const { _id, isInterested } = event;
  //   try {
  //     const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id}`);
  //     if (res.status === 200) {
  //       // Correct state update after toggle
  //       setEvent((prevEvent) => ({
  //         ...prevEvent!,
  //         isInterested: !isInterested,
  //       }));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  if (!event) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <div className="flex flex-col items-center w-full h-screen">
      <div className="flex flex-row items-center w-3/5 h-1/3 mt-12 justify-between">
        <div className="flex flex-col w-3/5 h-full">
          <div className="flex flex-row items-center w-full justify-between">
            <div className="text-3xl font-bold">{event.heading}</div>
            <button
              className="text-xl font-bold h-4/5 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4"
              // onClick={handleInterested}
            >
              {/* {event.isInterested ? "Interested" : "Not Interested"} */}
            </button>
          </div>
          <div className="text-xl font-bold mt-3 mb-2">Description</div>
          <div className="h-full w-full justify-evenly border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            {event.description}
          </div>
        </div>
        <img src={event.poster} className="h-full w-1/3 object-fill" alt="Event Poster" />
      </div>

      <div className="flex flex-row w-3/5 h-3/5 justify-between">
        <div className="flex flex-col w-3/5 h-full">
          <div className="flex flex-row items-center justify-between w-full h-3/5">
            <div className="flex flex-col w-1/2 h-3/4 text-xl font-bold pl-2 justify-around border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              <div>Venue: {event.eventVenue}</div>
              <div>Date: {event.eventTime.toString()}</div>
              <div>Time: {event.eventTime.toString()}</div>
              <div>Hosted By: {event.eventHostedBy.toString()}</div>
            </div>
            <div className="flex flex-col w-1/3 h-3/4 items-center text-xl font-bold border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              <div className="text-2xl mt-4 mb-4">Tags</div>
              {event.tags.map((tag) => (
                <div key={tag} className="mt-4">{tag}</div>
              ))}
            </div>
          </div>

          <div className="flex flex-col w-full h-2/5 border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <div className="ml-2 text-2xl font-bold">Attachments</div>
            {/* {(event.eventAttachments as any).length > 0 ? (
              (event.eventAttachments as any).map((attachment as any, index) => (
                <a key={index} href={attachment} target="_blank" rel="noopener noreferrer" className="text-cyan-600 mt-2">
                  {attachment}
                </a>
              ))
            ) : (
              <div className="text-xl mt-4">No attachments available</div>
            )} */}
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3 h-full overflow-y-auto">
          <div className="text-2xl font-bold mt-3 mb-2">Interested People</div>
          {/* {event.interestedMembersArr.map((member) => (
            // <StudentCard
            //   key={member.student_id}
            //   name={member.name}
            //   student_id={member.student_id}
            //   profile={member.profile}
            // />
          ))} */}
        </div>
      </div>
    </div>
  );
}
