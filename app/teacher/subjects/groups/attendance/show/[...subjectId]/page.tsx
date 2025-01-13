"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {useParams} from "next/navigation";

interface Attendance {
  subjectId: string;
  teacherId: string;
  totalClasses: number;
  dateStudentMap: {
    date: string;
    studentsPresent: string[];
    lectureCount: number;
  }[];
  groupName: string;
  students: string[];
}

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<Attendance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const params = useParams();
  const subjectId = params.subjectId?.[0];
  const groupName = params.subjectId?.[1];

  useEffect(() => {
    async function fetchAttendance() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/groups/attendance/show/${subjectId}/${groupName}`
        );
        if (res.status === 200) {
          setAttendanceData(res.data);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAttendance();
  }, [subjectId, groupName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1>No attendance data available.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">
        Attendance for {attendanceData.groupName}
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-left border border-gray-700 rounded-lg">
          <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 border-b border-gray-600">Student ID</th>
            {attendanceData.dateStudentMap.map((entry) => (
              <th
                key={entry.date}
                className="px-6 py-3 border-b border-gray-600"
              >
                {entry.date} <br />
                <span className="text-sm text-gray-400">
                    {entry.lectureCount} Lectures
                  </span>
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {attendanceData.students.map((studentId, index) => (
            <tr
              key={studentId}
              className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
            >
              <td className="px-6 py-4 border-b border-gray-600 font-medium">
                {studentId}
              </td>
              {attendanceData.dateStudentMap.map((entry) => (
                <td
                  key={`${entry.date}-${studentId}`}
                  className="px-6 py-4 border-b border-gray-600 text-center"
                >
                  {entry.studentsPresent.includes(studentId) ? (
                    <span className="text-green-500">✔</span>
                  ) : (
                    <span className="text-red-500">✘</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
