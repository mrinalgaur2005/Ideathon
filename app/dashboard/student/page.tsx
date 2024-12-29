'use client'
import React, { useEffect } from 'react'
import ClubCard from "../../../components/club/clubCard";
import MarksCard from "../../../components/student/marksCard";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useModel } from '../../../hooks/user-model-store';

const Student = () => {
  const { profile, setProfile, setLoading } = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`);
        if (res.status === 200) {
          setProfile(res.data.data);          
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
  }, [setProfile, setLoading]);

  if (!profile) {
    return <div>Loading...</div>;
  }
  console.log(profile);

  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className="flex flex-row items-center w-2/3 h-80 mt-16 justify-between border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
          <div
            className="flex flex-col items-center w-1/4 h-4/5 ml-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <div className="flex flex-row items-center justify-evenly w-full h-1/4 text-lg font-bold">
              <div>Name:</div>
              <div>{profile.name}</div>
            </div>
            <div className="flex flex-row items-center justify-evenly w-full h-1/4 text-lg font-bold">
              <div>SID:</div>
              <div>{profile.student_id}</div>
            </div>
            <div className="flex flex-row items-center justify-evenly w-full h-1/4 text-lg font-bold">
              <div>Branch:</div>
              <div>{profile.branch}</div>
            </div>
            <div className="flex flex-row items-center justify-evenly w-full h-1/4 text-lg font-bold">
              <div>Semester:</div>
              <div>{profile.semester}</div>
            </div>
          </div>
          <img
            src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
            className="flex flex-col items-center w-1/5 h-4/5 mr-8 border-2 rounded-full border-cyan-300 shadow-md shadow-cyan-300/50"/>
        </div>

        <div className="w-2/3 text-2xl font-bold mt-12">
          Joined Clubs
        </div>
        <div className="flex flex-row w-2/3 h-96 mt-4 border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
          <div className="flex flex-col h-full w-3/4 overflow-y-auto">
            {profile.clubsPartOf.map((club) => (
              <ClubCard key ={(club._id as any) } clubName={club.clubName} clubLogo={club.clubLogo}/>
            ))}
          </div>
          <div className="flex flex-col items-center h-full w-1/4">
            <div className="text-xl font-bold mt-8">Number of Clubs joined:</div>
            <div className="text-3xl font-bold mt-4">{profile.clubsPartOf.length}</div>
          </div>
        </div>

        <div className="w-2/3 text-2xl font-bold mt-12">
          Marks
        </div>
        <div className="flex flex-col w-2/3 h-96 overflow-y-auto items-center mt-4 border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
          <MarksCard subjectMarks={profile.subjectMarks as any} />
        </div>
      </div>
    </>
  )
}

export default Student;
