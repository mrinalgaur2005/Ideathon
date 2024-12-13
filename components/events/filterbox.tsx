export default function FilterBox() {

  return (
    <>
      <div className="flex flex-col w-4/5 h-1/6 pl-4 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
        <div className="text-2xl font-bold text-center mt-4 mb-4">
          Filter Options
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input type="checkbox" className="hidden peer"/>
            <div className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Option 1
          </div>
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input type="checkbox" className="hidden peer"/>
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Option 2
          </div>
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input type="checkbox" className="hidden peer"/>
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Option 3
          </div>
        </div>
      </div>
    </>
  )
}