export default function StudentCard({name, student_id, profile}: {name: string, student_id: string, profile: string}) {

  return (
    <>
      <div className="flex flex-row h-16 items-center justify-around w-5/6 border-2 mt-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
        <img
          src={profile}
          className="flex flex-col items-center w-12 h-12 border-2 rounded-full border-cyan-300 shadow-md shadow-cyan-300/50"
        />
        <div className="">
          {name}
        </div>
        <div className="">
          {student_id}
        </div>
      </div>
    </>
  )
}