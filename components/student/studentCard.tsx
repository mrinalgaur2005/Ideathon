export default function StudentCard({
  name,
  student_id,
  profile,
}: {
  name: string;
  student_id: string;
  profile: string;
}) {
  return (
    <>
      <div className="flex flex-row items-center justify-start mt-5 p-4 h-3/6 w-fit border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 bg-[#1F2833]">
        <img
          src={profile || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"}
          alt="Student Profile"
          className="w-12 h-12 border-2 rounded-full border-cyan-300 shadow-md shadow-cyan-300/50"
        />
        <div className="flex flex-col ml-4 text-white">
          <div className="text-lg font-bold">{name}</div>
          <div className="text-sm">{student_id}</div>
        </div>
      </div>
    </>
  );
}
