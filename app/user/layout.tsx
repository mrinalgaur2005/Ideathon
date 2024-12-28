"use client"

export default function Layout({ children }: Readonly<{children: React.ReactNode;}>) {

  return (
    <>
      <div className="flex flex-col items-center w-full h-32 bg-gray-800">
        <div className="flex flex-row w-4/5 h-full justify-around items-center ">
          <button className="h-14 w-48 rounded-full text-xl bg-gray-950 text-white font-bold">
            Friends
          </button>
          <button className="h-14 w-48 rounded-full text-xl bg-gray-950 text-white font-bold">
            Add Friends
          </button>
          <button className="h-14 w-48 rounded-full text-xl bg-gray-950 text-white font-bold">
            Friend Requests
          </button>
          <button className="h-14 w-48 rounded-full text-xl bg-gray-950 text-white font-bold">
            Requests Sent
          </button>
        </div>
      </div>
      {children}
    </>
  )
}