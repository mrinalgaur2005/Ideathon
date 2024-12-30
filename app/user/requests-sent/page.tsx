"use client"
import {useEffect} from "react";
import {useModel} from "../../../hooks/user-model-store";
import {useRouter} from "next/navigation";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";

export default function RequestsSentPage() {
  const { requestsSent, setRequestsSent, setLoading } = useModel()
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/requests-sent`);
        if (res.status === 200) {
          setRequestsSent(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching requests sent:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [setRequestsSent, setLoading, router]);

  if (!requestsSent) {
    return <DotsLoader />;
  }

  async function withdrawRequest (from: string, to: string) {
    setLoading(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/friends/withdraw-request/${from}/${to}`)

      if (res.status === 200) {
        setRequestsSent(requestsSent.filter((request)=> request.to._id.toString() !== to));
      }
    } catch (error) {
      console.error("Failed to withdraw request", error);
    } finally {
      setLoading(false);
    }

  }

  return (
    <>
      <div className="flex flex-col items-center h-screen w-full bg-gray-800">
        {requestsSent.map((request) =>
          <div key={request._id.toString()} className="flex flex-row w-1/2 h-24 bg-gray-950 mt-12 rounded-full items-center justify-around text-white text-lg font-bold">
            <img src={request.to.profile} className="w-16 h-16 rounded-full object-contain bg-white" />
            <div>
              {request.to.name}
            </div>
            <div>
              {request.to.student_id}
            </div>
            <button
              className="bg-red-700 text-white h-14 w-48 rounded-full"
              onClick={()=> withdrawRequest(request.from.toString(), request.to._id.toString())}
            >
              Withdraw Request
            </button>
          </div>
        )}
      </div>
    </>
  )
}