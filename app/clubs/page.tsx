'use client'
import { useRouter } from "next/navigation";
import { useModel } from "../../hooks/user-model-store";
import { useEffect } from "react";
import axios from "axios";
import ClubPageCard from "../../components/club/clubPageCard";

export default function ClubsPage() {
  const {allClubs,setAllClub, setLoading } = useModel();
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
  }, [setAllClub, setLoading]);

  if (!allClubs) {
    return <div>Loading...</div>;
  }
  console.log(allClubs);
  return (
    <div>
    {allClubs.map((club)=>{
      return (<div key={club._id.toString()} className="flex flex-col h-full w-full items-center">
        <ClubPageCard _id ={club._id.toString()} clubLogo={club.clubLogo} clubName={club.clubName}/>
      </div>
    )})}
    </div>
  )
}