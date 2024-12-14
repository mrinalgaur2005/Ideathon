'use client'

import { useSession } from "next-auth/react";

const TeacherDashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  const { user } = session;

  if (!user.isTeacher) {
    return <div>Access Denied. Only teachers are allowed here.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Teacher Status: {user.isTeacher ? "Verified Teacher" : "Not a Teacher"}</p>
    </div>
  );
};

export default TeacherDashboard;
