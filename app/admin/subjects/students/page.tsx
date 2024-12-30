"use client"

import {useState} from "react";

export default function StudentsSubjectPage () {
  const [student_id, setStudentId] = useState<string>("");
  const [subject_id, setSubjectId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  async function AddSubject() {
    if (student_id.length < 5) {
      setMessage("Student Id should have at least 5 digits");
      setTimeout(()=> setMessage(""), 5000);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center h-screen w-full bg-gray-800">
        <input
          type="string"
          className="mt-12 w-60 h-14 pl-2 text-gray-950 text-lg font-bold"
          placeholder="First 5 numbers of sid"
          value={student_id}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          className="mt-12 w-60 h-14 pl-2 text-gray-950 text-lg font-bold"
          placeholder="Enter subject code"
          value={subject_id}
          onChange={(e) => setSubjectId(e.target.value)}
        />
        <button className="h-12 w-40 bg-gray-950 text-white mt-10 rounded-full" onClick={AddSubject}>
          Add Subject
        </button>
        <div className="flex flex-col items-center text-2xl font-fond text-white mt-10 w-full">
          {message}
        </div>
      </div>
    </>
  )
}