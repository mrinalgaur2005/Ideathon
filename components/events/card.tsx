export default function EventCard() {
  return (
    <>
      <div className="flex flex-row w-3/5 h-56 mt-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
        <div className="h-56 w-80 " >
          <img
            src="https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75"
            alt=""

          />
        </div>
        <div className="flex flex-col ml-4 w-3/5">
          <div className="flex flex-row justify-between w-full h-11 mt-4">
            <div className="text-3xl font-bold">
              Heading
            </div>
            <div className="text-3xl font-bold">
              Club
            </div>
          </div>
          <div className="w-full mt-2 h-20 p-1 ">
            The sun dipped below the horizon, painting the sky with hues of orange and pink. A gentle breeze carried the
            scent of blooming flowers, while leaves rustled softly in the tree. while leaves rustled softly in the tree.
          </div>
          <div className="flex flex-row w-full font-bold mt-2">
            <div className="">
              Tags:
            </div>
            <div
              className="ml-6 min-w-fit w-16 rounded-2xl text-center bg-gradient-to-br from-cyan-600 to-cyan-400 text-white">
              Tag1
            </div>
            <div
              className="ml-6 min-w-fit w-16 rounded-2xl text-center bg-gradient-to-br from-cyan-600 to-cyan-400 text-white">
              Tag2
            </div>
          </div>
          <div className="flex flex-row justify-between w-full h-11 mt-2">
            <div className="text-xl font-bold">
              Time:
            </div>
            <div className="text-xl font-bold">
              Venue:
            </div>
            <button
              className="text-xl font-bold mb-3 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-32 rounded-3xl">
              Interested
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
