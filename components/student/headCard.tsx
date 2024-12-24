interface Props {
  name: string;
  student_id: string;
  profile: string;
}

export default function HeadCard({name, student_id, profile}: Props) {

  return (
    <>
      <div
        className="flex flex-row h-1/3 w-4/5 items-center justify-around border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 flex-shrink-0">
        <img
          src={profile || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"}
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