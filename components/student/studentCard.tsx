export default function StudentCard({name, student_id, profile}: {name: string, student_id: string, profile: string}) {

  return (
    <>
      <div className="flex flex-row h-20 items-center justify-around w-4/5 border-2 mt-4 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
        <img
          src={profile}
          className="flex flex-col items-center w-16 h-16 border-2 rounded-full border-cyan-300 shadow-md shadow-cyan-300/50"
        />
        <div className="text-xl font-bold">
          {name}
        </div>
        <div className="text-xl font-bold">
          {student_id}
        </div>
      </div>
    </>
  )
}