export default function HeadCard() {

  return (
    <>
      <div
        className="flex flex-row h-1/3 w-4/5 items-center justify-around border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 flex-shrink-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfXKzxBrv-nr-V2w6n-Hf14w-Mw-p4tD_f6GPvjOCW4CoikavWniBoh4rNfKid-VyUwH4&usqp=CAU"
          className="flex flex-col items-center w-16 h-16 border-2 rounded-full border-cyan-300 shadow-md shadow-cyan-300/50"
        />
        <div className="text-xl font-bold">
          Name
        </div>
        <div className="text-xl font-bold">
          SID
        </div>
      </div>
    </>
  )
}