"use client"
import HeadCard from "../../../components/student/headCard";
import SmallEventCard from "../../../components/events/smallCard";
import StudentCard from "../../../components/student/studentCard";
import { redirect, useParams } from "next/navigation";
import { useModel } from "../../../hooks/user-model-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";

export default function Club() {
  const { singleClub, setSingleClub, setLoading } = useModel();
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId?.[0];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clubs/${clubId}`);
        if (res.status === 200) {
          setSingleClub(res.data.data);          
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setSingleClub, setLoading, clubId, router]);

  if (!singleClub) {
    return <DotsLoader />;
  }
  console.log(singleClub);

  return (
    <>
      <div className="flex flex-col items-center h-screen bg-gradient-to-b from-[#1F2833] to-[#0B0C10]">
        <div className="flex flex-row items-center w-4/5 h-1/3 mt-12 justify-between ">
          <div className="flex flex-col w-3/5 h-full text-[#C5C6C7]">
            <div className="text-3xl font-bold">
              Club Name : {singleClub.clubName}
            </div>
            <div className="text-2xl mt-6 mb-3 font-bold">
              Secy :
            </div>

            {singleClub.clubIdSecs.map((secy) => {
              return (
                <div key={secy.student_id}>
                  <HeadCard
                    name={secy.name}
                    student_id={secy.student_id}
                    profile={secy.profile}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex flex-row m-10 "><img
            src={singleClub.clubLogo || "https://india.acm.org/images/acm_rgb_grad_pos_diamond.png"}
            alt=""
            className="h-64 w-64 object-cover rounded-full shadow-lg" /></div>
        </div>
        <div className="flex flex-row justify-between h-1/2 w-4/5 mt-10 ">
          <div className="flex flex-col w-3/5 h-full justify-between text-[#C5C6C7]">
            <div className="flex flex-row justify-between items-center">
              <div className="text-3xl font-bold mb-4">
                Events
              </div>
              <button
                className="text-xl font-bold h-4/5 bg-gradient-to-br from-[#45A29E] to-[#66FCF1] text-[#0B0C10] w-1/4 rounded-3xl mr-4 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  redirect("/events");
                }}
              >
                Show All Events
              </button>
            </div>
            <div className="flex flex-col w-full h-full mt-2 overflow-y-auto scroll-p-2 border-2 rounded-xl border-[#45A29E] shadow-md shadow-[#45A29E]/50 bg-[#1F2833]">
              {singleClub.clubEvents.map((event) => {
                return (
                  <SmallEventCard
                    key={event._id.toString()}
                    heading={event.heading}
                    isInterested={event.isInterested}
                    eventTime={event.eventTime}
                    eventVenue={event.eventVenue}
                    _id={event._id.toString()}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-center w-1/4 h-full overflow-y-auto scroll-m-2 border-2 rounded-xl border-[#45A29E] shadow-md shadow-[#45A29E]/50 bg-[#1F2833]">
            <div className="text-3xl font-bold mt-2 text-[#C5C6C7]">
              Members
            </div>
            {singleClub.clubMembers.map((member) => {
              return (
                <div key={member.student_id}>
                  <StudentCard
                    name={member.name}
                    student_id={member.student_id}
                    profile={member.profile}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
