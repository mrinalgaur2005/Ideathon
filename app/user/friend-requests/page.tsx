"use client"
import {useModel} from "../../../hooks/user-model-store";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";

export default function FriendRequests() {
  const { currentRequests, setCurrentRequests, setLoading } = useModel()
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/current-requests`);
        if (res.status === 200) {
          setCurrentRequests(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching current requests:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setCurrentRequests, setLoading, router]);

  if (!currentRequests) {
    return <DotsLoader />;
  }

  async function rejectRequest (to: string, from: string) {
    setLoading(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/reject-friend/${to}/${from}`)

      if (res.status === 200) {
        setCurrentRequests(currentRequests.filter((request)=> request.from._id.toString() !== from));
      }
    } catch (error) {
      console.error("Failed to reject request", error);
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest (to: string, from: string) {
    setLoading(true);
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/accept-friend/${to}/${from}`)

      if (res.status === 200) {
        setCurrentRequests(currentRequests.filter((request)=> request.from._id.toString() !== from));
      }
    } catch (error) {
      console.error("Failed to accept request", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <div className="flex flex-col items-center h-screen w-full bg-gray-800">
        {currentRequests.map((request) =>
          <div key={request._id.toString()}
               className="flex flex-row w-2/3 h-24 bg-gray-950 mt-12 rounded-full items-center justify-around text-white text-lg font-bold">
            <img src={request.from.profile} className="w-16 h-16 rounded-full object-contain bg-white"/>
            <div>
              {request.from.name}
            </div>
            <div>
              {request.from.student_id}
            </div>
            <button
              className="bg-red-700 text-white h-14 w-32 rounded-full"
              onClick={() => rejectRequest(request.to.toString(), request.from._id.toString())}
            >
              Reject
            </button>
            <button
              className="bg-white text-gray-950 h-14 w-32 rounded-full"
              onClick={() => acceptRequest(request.to.toString(), request.from._id.toString())}
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </>
  )
}