"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {useSession} from "next-auth/react";

export default function HomePage() {
  const session= useSession();

  console.log(session);

  if (session.data && !session.data.user.isStudent) {
    if (session.data.user.isAdmin) {
      return (
        <>
          <div>
            admin
          </div>
        </>
      )
    } else if (session.data.user.isTeacher) {
      return (
        <>
          <div>
            teacher
          </div>
        </>
      )
    } else {
      return (
        <>
          <div>
            wait for admin verification
          </div>
        </>
      )
    }
  }

  const [adminAnnouncements, setAdminAnnouncements] = useState<{announcementText: string, department: string, createdAt: Date, updatedAt: Date}[]>([]);
  const [teacherAnnouncements, setTeacherAnnouncements] = useState<{announcementText: string, subjectCode: string, createdAt: Date, updatedAt: Date}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/announcements`);
        if (res.status === 200) {
          setAdminAnnouncements(res.data.adminAnnouncements);
          setTeacherAnnouncements(res.data.classAnnouncements);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Announcements Section */}
      <section className="max-w-7xl mx-auto pt-10 px-4 space-y-16">
        {/* Admin Announcements */}
        <div>
          <h2 className="text-4xl font-bold text-blue-400 mb-6">Admin Announcements</h2>
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : adminAnnouncements.length === 0 ? (
            <p className="text-gray-400">No announcements from the admin.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {adminAnnouncements.map((announcement, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-white">{announcement.department}</h3>
                  <p className="text-sm text-gray-300 mt-2">{announcement.announcementText}</p>
                  <p className="text-xs text-gray-500 mt-4">
                    Posted on: {moment(announcement.createdAt).format("MMMM Do YYYY, h:mm A")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teacher Announcements */}
        <div>
          <h2 className="text-4xl font-bold text-green-400 mb-6">Teacher Announcements</h2>
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : teacherAnnouncements.length === 0 ? (
            <p className="text-gray-400">No announcements from teachers.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherAnnouncements.map((announcement, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-white">
                    Subject: {announcement.subjectCode}
                  </h3>
                  <p className="text-sm text-gray-300 mt-2">{announcement.announcementText}</p>
                  <p className="text-xs text-gray-500 mt-4">
                    Posted on: {moment(announcement.createdAt).format("MMMM Do YYYY, h:mm A")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Features Section */}
      <div className="py-16">
        <h2 className="text-4xl font-bold text-blue-500 text-center mb-12">
          Explore Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto">
          {/* Clubs */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">Clubs</h3>
            <p className="text-gray-300">
              Join clubs to connect with like-minded peers. Share ideas, collaborate
              on projects, and build your network.
            </p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
              Explore Clubs
            </button>
          </div>

          {/* Events */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-400 mb-4">Events</h3>
            <p className="text-gray-300">
              Stay updated with all upcoming events and workshops happening across the
              campus.
            </p>
            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
              View Events
            </button>
          </div>

          {/* Marks */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Marks</h3>
            <p className="text-gray-300">
              Track your academic performance and review your scores in various
              subjects with detailed breakdowns.
            </p>
            <button className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg">
              View Marks
            </button>
          </div>

          {/* Resources */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">Resources</h3>
            <p className="text-gray-300">
              Access study materials, previous question papers, and helpful guides
              curated by your professors.
            </p>
            <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
              Access Resources
            </button>
          </div>

          {/* Friends */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-pink-400 mb-4">Friends</h3>
            <p className="text-gray-300">
              Discover and connect with your classmates and peers. See their live
              location on campus.
            </p>
            <button className="mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg">
              Find Friends
            </button>
          </div>

          {/* Study Together */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-teal-400 mb-4">Study Together</h3>
            <p className="text-gray-300">
              Post study requests or teach others. Collaborate with fellow students
              to learn and grow together.
            </p>
            <button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg">
              Study Together
            </button>
          </div>

          {/* Issues Page */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-red-400 mb-4">Issues</h3>
            <p className="text-gray-300">
              Report campus-related issues like maintenance problems or academic
              concerns. Get timely resolutions.
            </p>
            <button className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">
              Report Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
