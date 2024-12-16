import HeadCard from "../student/headCard";
import StudentCard from "../student/studentCard";
import Tag from "./tag";

export default function EventPage() {

  return (
    <>
      <div className="flex flex-col items-center w-full h-screen">
        <div className="flex flex-row items-center w-3/5 h-1/3 mt-12 justify-between ">
          <div className="flex flex-col w-3/5 h-full ">
            <div className="flex flex-row items-center w-full justify-between">
              <div className="text-3xl font-bold">
                Event Name
              </div>
              <button
                className="text-xl font-bold h-4/5 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4">
                Interested
              </button>
            </div>
            <div className="text-xl font-bold mt-3 mb-2">
              Description
            </div>
            <div
              className="h-full w-full justify-evenly border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              description
            </div>
          </div>
          <img
            src=""
            className="h-full w-1/3 object-fill"
          />
        </div>
        <div className="flex flex-row w-3/5 h-3/5 justify-between">
          <div className="flex flex-col w-3/5 h-full">
            <div className="flex flex-row items-center justify-between w-full h-3/5 ">
              <div className="flex flex-col w-1/2 h-3/4 text-xl font-bold pl-2 justify-around border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
                <div>
                  Venue:
                </div>
                <div>
                  Date:
                </div>
                <div>
                  Time:
                </div>
                <div>
                  Hosted By:
                </div>
              </div>
              <div className="flex flex-col w-1/3 h-3/4 items-center text-xl font-bold border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
                <div className="text-2xl mt-4 mb-4">
                  Tags
                </div>
                <div className="mt-4">
                  Tag1
                </div>
                <div className="mt-4">
                  Tag2
                </div>
                <div className="mt-4">
                  Tag3
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full h-2/5 border-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              <div className="ml-2 text-2xl font-bold">
                Attachments
              </div>

            </div>
          </div>
          <div className="flex flex-col items-center w-1/3 h-full overflow-y-auto ">
            <div className="text-2xl font-bold mt-3 mb-2">
              Interested People
            </div>
            <StudentCard/>
            <StudentCard/>
            <StudentCard/>
            <StudentCard/>
            <StudentCard/>
            <StudentCard/>
            <StudentCard/>
            <StudentCard/>
          </div>
        </div>
      </div>
    </>
  )
}