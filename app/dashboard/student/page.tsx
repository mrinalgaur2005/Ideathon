'use client'
import React, { useEffect, useState } from 'react';
import ClubCard from "../../../components/club/clubCard";
import MarksCard from "../../../components/student/marksCard";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useModel } from '../../../hooks/user-model-store';
import DotsLoader from "../../../components/loading/dotLoader";

const Student = () => {
  const { profile, setProfile, setLoading } = useModel();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Navigation Button and Dropdown Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-xl transition-all duration-300"
        >
          Navigate
        </button>
        {dropdownOpen && (
          <div className="absolute top-12 right-0 w-48 bg-gray-800 border border-blue-500 rounded-lg shadow-lg">
            <ul className="space-y-2 p-2">
              <li className="text-blue-500 hover:text-white cursor-pointer transition-colors duration-200">Events</li>
              <li className="text-blue-500 hover:text-white cursor-pointer transition-colors duration-200">Map</li>
              <li className="text-blue-500 hover:text-white cursor-pointer transition-colors duration-200">Clubs</li>
            </ul>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide mb-8">
          Student Profile
        </h1>

        {/* Student Profile Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40">
              <img
                src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-lg"
              />
            </div>

            <div className="flex-1 space-y-4">
              {[
                { label: "Name", value: profile.name },
                { label: "SID", value: profile.student_id },
                { label: "Branch", value: profile.branch },
                { label: "Semester", value: profile.semester },
              ].map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-blue-500/30 py-2"
                >
                  <span className="text-blue-500 font-semibold">{field.label}</span>
                  <span className="text-white">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Joined Clubs Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">
            Joined Clubs
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
              {profile.clubsPartOf.map((club) => (
                <ClubCard key={club._id.toString()} clubName={club.clubName} clubLogo={club.clubLogo} />
              ))}
            </div>
            <div className="md:w-48 text-center">
              <div className="text-lg text-white mb-2">Clubs Joined</div>
              <div className="text-3xl font-bold text-blue-500">
                {profile.clubsPartOf.length}
              </div>
            </div>
          </div>
        </div>

        {/* Updated Marks Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">
            Academic Performance
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl bg-gray-900 rounded-xl border-2 border-blue-500 shadow-lg shadow-blue-500/20 p-6">
              <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
                <MarksCard subjectMarks={profile.subjectMarks as any} />
              </div>
              <div className="mt-4 pt-4 border-t border-blue-500/30 flex justify-between items-center text-sm text-gray-400">
                <span>Scroll to view all subjects</span>
                <span className="text-blue-400">Semester {profile.semester}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;