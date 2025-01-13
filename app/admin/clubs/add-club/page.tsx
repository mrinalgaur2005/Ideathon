"use client"
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddClubPage() {
  const [clubName, setClubName] = useState<string>("");
  const [clubLogo, setClubLogo] = useState<string>("");
  const [secyId, setSecyId] = useState<string>("");
  const [clubIdSecs, setClubIdSecs] = useState<string[]>([]);
  const [studentId, setStudentId] = useState<string>("");
  const [clubMembers, setClubMembers] = useState<string[]>([]);

  const router = useRouter();

  function handleLogoUpload(result: any) {
    if (result.event === "success") {
      setClubLogo(result.info.secure_url);
    }
  }

  function handleAddSecy() {
    setClubIdSecs([...clubIdSecs, secyId]);
    setSecyId("");
  }

  function handleAddMember() {
    setClubMembers([...clubMembers, studentId]);
    setStudentId("");
  }

  async function handleAddClub() {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/clubs/add-club`,
        {
          clubName,
          clubLogo,
          clubIdSecs,
          clubMembers,
        }
      );

      if (res.status === 200) {
        console.log("Club added successfully");
        router.push(`/clubs/${res.data._id.toString()}`);
      }
    } catch (error) {
      console.log("Error adding clubs:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-xl">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create New Club
          </h1>
          <div className="h-1 w-32 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Form */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-12">
          {/* Club Details Section */}
          <div className="space-y-8 mb-12">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <label htmlFor="clubName" className="text-white font-semibold w-48">
                Club Name
              </label>
              <input
                className="flex-1 h-12 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                type="text"
                placeholder="Enter club name"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <label className="text-white font-semibold w-48">
                Club Logo
              </label>
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
                onSuccess={handleLogoUpload}
                className="flex-1 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 border border-gray-600"
              >
                {clubLogo ? "Logo Uploaded" : "Upload Club Logo"}
              </CldUploadButton>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Secretary Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Club Secretaries</h2>
              <div className="flex gap-4">
                <input
                  className="flex-1 h-12 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                  type="text"
                  placeholder="Enter Secretary ID"
                  value={secyId}
                  onChange={(e) => setSecyId(e.target.value)}
                />
                <button
                  className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-semibold"
                  onClick={handleAddSecy}
                >
                  Add
                </button>
              </div>
              <div className="h-96 overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-700">
                {clubIdSecs.map((secId) => (
                  <div
                    key={secId}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 group hover:border-blue-500 transition-all"
                  >
                    <span className="text-white">{secId}</span>
                    <button
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
                      onClick={() => setClubIdSecs(clubIdSecs.filter((id) => id !== secId))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Members Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Club Members</h2>
              <div className="flex gap-4">
                <input
                  className="flex-1 h-12 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                  type="text"
                  placeholder="Enter Member ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
                <button
                  className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-semibold"
                  onClick={handleAddMember}
                >
                  Add
                </button>
              </div>
              <div className="h-96 overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-700">
                {clubMembers.map((student_Id) => (
                  <div
                    key={student_Id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 group hover:border-blue-500 transition-all"
                  >
                    <span className="text-white">{student_Id}</span>
                    <button
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
                      onClick={() => setClubMembers(clubMembers.filter((id) => id !== student_Id))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={handleAddClub}
          >
            Create Club
          </button>
        </div>
      </div>
    </div>
  );
}