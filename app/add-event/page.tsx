import dbConnect from "@/lib/connectDb"

export default async function addEventPage() {

  return (

    <>
      <div className="flex flex-col w-full h-screen items-center  justify-center">
        <div className="flex flex-col w-2/5 h-4/5 justify-evenly items-center border-4 border-solid rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 text-lg bg-gradient-to-br from-gray-200/60 to-gray-50/60">
          <div className="text-3xl font-bold">
            Add Event
          </div>
          <div className="flex flex-row justify-between items-center w-4/5 h-1/4">
            <div className="flex flex-col items-center w-2/5 h-5/6 bg-gradient-to-br from-cyan-700 to-cyan-500 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              <label className="text-white text-xl font-bold text-center mt-2">
                Select Club
              </label>
              <select className="mt-4 w-3/4 pl-2">
                <option>Club1</option>
                <option>Club2</option>
                <option>Club3</option>
              </select>
            </div>
            <div className="flex flex-col items-center w-2/5 h-5/6 bg-gradient-to-br from-cyan-700 to-cyan-500 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
              <label className="text-white text-xl font-bold text-center mt-2">
                Select Tags
              </label>
              <select className="mt-4 w-3/4 pl-2">
                <option>Tag1</option>
                <option>Tag2</option>
                <option>Tag3</option>
              </select>
              <select className="mt-4 w-3/4 pl-2">
                <option>Tag1</option>
                <option>Tag2</option>
                <option>Tag3</option>
              </select>
              <select className="mt-4 w-3/4 pl-2">
                <option>Tag1</option>
                <option>Tag2</option>
                <option>Tag3</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col w-4/5 h-2/5 bg-gradient-to-br from-cyan-700 to-cyan-500 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
            <div className="flex flex-row h-1/6 w-full justify-between   items-center">
              <label htmlFor="heading" className="ml-4 text-white font-bold">
                Heading:
              </label>
              <input
                type="text"
                placeholder="Heading"
                className="w-3/4 mr-4 pl-2"
                id="heading"
              />
            </div>
            <div className="flex flex-row h-2/6 w-full justify-between   pt-2 pb-4">
              <label htmlFor="description" className="ml-4 text-white font-bold">
                Description:
              </label>
              <textarea
                placeholder="description"
                className="w-3/4 mr-4 pl-2 h-full"
                id="description"
              />
            </div>
            <div className="flex flex-row h-1/6 w-full justify-between   items-center">
              <label htmlFor="poster" className="ml-4 text-white font-bold">
                Poster:
              </label>
              <input
                type="file"
                className="w-3/4 mr-4 pl-2"
                id="poster"
              />
            </div>
            <div className="flex flex-row h-1/6 w-full justify-between   items-center">
              <label htmlFor="venue" className="ml-4 text-white font-bold">
                Venue:
              </label>
              <input
                type="text"
                placeholder="Venue"
                className="w-3/4 mr-4 pl-2"
                id="venue"
              />
            </div>
            <div className="flex flex-row h-1/6 w-full justify-between  items-center">
              <div className="flex flex-row h-full w-1/2   items-center">
                <label htmlFor="date" className="ml-4 text-white font-bold">
                  Date:
                </label>
                <input
                  type="date"
                  className="w-3/4 ml-3 pl-2"
                  id="date"
                />
              </div>
              <div className="flex flex-row h-full w-1/2  items-center">
                <label htmlFor="time" className="ml-3 text-white font-bold">
                  Time:
                </label>
                <input
                  type="time"
                  className="w-3/4 ml-4 pl-2"
                  id="time"
                />
              </div>
            </div>
          </div>
          <div
            className="flex flex-row justify-between items-center h-12 bg-gradient-to-br from-cyan-600 to-cyan-400 w-4/5">
            <label htmlFor="attachments" className="text-white font-bold text-xl ml-4">
              Attachments:
            </label>
            <input
              type="file"
              className="w-3/4 mr-4 pl-2"
              id="attachments"
            />
          </div>
          <button
            className="text-xl font-bold bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-36 rounded-3xl h-12">
            Add Event
          </button>
        </div>
      </div>
    </>
  )
}