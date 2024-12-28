"use client"

import {usePathname, useRouter} from "next/navigation";

export default function Layout({ children }: Readonly<{children: React.ReactNode;}>) {
  const router = useRouter();
  const currentPath = usePathname()
  const isActive = (path: string) => currentPath === path;

  return (
    <>
      <div className="flex flex-col items-center w-full h-32 bg-gray-800">
        <div className="flex flex-row w-4/5 h-full justify-around items-center ">
          <button
            className={`h-14 w-48 rounded-full text-xl font-bold ${isActive("/user/friends") ? "bg-gray-950 text-white" : "bg-white text-gray-950"}`}
            onClick={()=> router.push("/user/friends")}
          >
            Friends
          </button>
          <button
            className={`h-14 w-48 rounded-full text-xl font-bold ${isActive("/user/add-friends") ? "bg-gray-950 text-white" : "bg-white text-gray-950"}`}
            onClick={()=> router.push("/user/add-friends")}
          >
            Add Friends
          </button>
          <button
            className={`h-14 w-48 rounded-full text-xl font-bold ${isActive("/user/friend-requests") ? "bg-gray-950 text-white" : "bg-white text-gray-950"}`}
            onClick={()=> router.push("/user/friend-requests")}
          >
            Friend Requests
          </button>
          <button
            className={`h-14 w-48 rounded-full text-xl font-bold ${isActive("/user/requests-sent") ? "bg-gray-950 text-white" : "bg-white text-gray-950"}`}
            onClick={()=> router.push("/user/requests-sent")}
          >
            Requests Sent
          </button>
        </div>
      </div>
      {children}
    </>
  )
}