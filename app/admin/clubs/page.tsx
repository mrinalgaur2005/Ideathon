'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import {useModel} from "../../../hooks/user-model-store";
import DotsLoader from "../../../components/loading/dotLoader";

export default function ClubsPage() {
  const { allClubs, setAllClub, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clubs`);
        if (res.status === 200) {
          setAllClub(res.data);
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
  }, [router, setAllClub, setLoading]);

  if (!allClubs) {
    return <DotsLoader />;
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-[#1F2833] to-[#0B0C10] min-h-screen p-5 gap-10">
      <h1 className="text-4xl font-bold text-[#66FCF1] mb-6">Clubs</h1>
      {allClubs.map((club) => (
        <div
          key={club._id.toString()}
          className="flex flex-col flex-shrink-0 w-[70%] p-6 border-2 rounded-xl border-[#45A29E] shadow-md shadow-[#66FCF1]/50 bg-gradient-to-r from-[#1F2833] via-[#0B0C10] to-[#45A29E] hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center w-full justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#C5C6C7]">{club.clubName}</h2>
            <button
              className="text-lg font-bold px-6 py-2 rounded-3xl bg-gradient-to-br from-[#45A29E] to-[#66FCF1] text-[#0B0C10] hover:from-[#66FCF1] hover:to-[#45A29E] transition-colors duration-300"
              onClick={() => router.replace(`clubs/edit-club/${club._id.toString()}`)}
            >
              Edit Club
            </button>
          </div>
          <img
            src={club.clubLogo || "https://india.acm.org/images/acm_rgb_grad_pos_diamond.png"}
            alt={`${club.clubName} Logo`}
            className="w-36 h-36 object-cover rounded-full border-2 border-[#66FCF1] shadow-md"
          />
        </div>
      ))}
    </div>
  );
}
