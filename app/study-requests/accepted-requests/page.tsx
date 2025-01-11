"use client";

import { useEffect } from "react";
import axios from "axios";
import DotsLoader from "../../../components/loading/dotLoader";
import { useRouter } from "next/navigation";
import {useModel} from "@/hooks/user-model-store";

export default function AcceptedRequestsPage() {
  const { isLoading, setLoading, acceptedRequests, setAcceptedRequests} = useModel();
  const router = useRouter();

  useEffect(() => {
    async function fetchAcceptedRequests() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/study-requests/accepted-requests`);
        if (res.status === 200) {
          setAcceptedRequests(res.data);
        } else {
          console.error("Failed to fetch accepted requests");
        }
      } catch (error) {
        console.error("Error fetching accepted requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAcceptedRequests();
  }, [setAcceptedRequests, setLoading]);

  if (isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Page Header */}
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-500 text-center">
          Accepted Requests
        </h1>
      </div>

      {/* Accepted Requests List */}
      <div className="flex flex-col items-center mt-10 px-4">
        {acceptedRequests.length === 0 ? (
          <div className="text-gray-400 text-lg">No accepted requests found.</div>
        ) : (
          <div className="w-full max-w-5xl space-y-6">
            {acceptedRequests.map((request) => (
              <div
                key={request._id.toString()}
                className="bg-gray-800 rounded-lg shadow-xl p-6"
              >
                <div className="text-lg font-semibold text-white">
                  Teacher: {request.teacher.name} ({request.teacher.student_id})
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Semester: {request.teacher.semester}, Branch: {request.teacher.branch}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Subject: <span className="font-semibold text-white">{request.subjectName}</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">{request.description}</p>

                {/* Attachments */}
                {request.studentAttachments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-300 font-semibold">Student Attachments:</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {request.studentAttachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {attachment}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {request.teacherAttachments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-300 font-semibold">Teacher Attachments:</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {request.teacherAttachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {attachment}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  Teacher&#39;s Phone: <span className="font-semibold text-white">{request.teacherPhoneNumber}</span>
                </p>

                {/* Join Room Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => router.push(`/study-room/${request.roomId}`)}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
