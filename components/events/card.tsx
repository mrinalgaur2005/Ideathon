import Tag from "@/components/events/tag";

export default function EventCard() {
  return (
    <>
      <div className="flex flex-row w-3/5 h-52 mt-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
        <img
          src="https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75"
          alt=""
          className="h-full w-1/3 object-cover"
        />
        <div className="flex flex-col ml-4 w-2/3 h-full">
          <div className="flex flex-row justify-between w-full h-1/5 items-center">
            <div className="text-3xl font-bold">
              Heading
            </div>
            <div className="text-3xl font-bold mr-4">
              Club
            </div>
          </div>
          <div className="w-full h-2/5 pl-2">
            The sun dipped below the horizon, painting the sky with hues of orange and pink. A gentle breeze carried the scent of blooming flowers, while leaves rustled softly in the tree.
          </div>
          <div className="flex flex-row w-full h-1/5 items-center font-bold ">
            <div className="text-xl font-bold">
              Tags:
            </div>
            <Tag />
            <Tag />
            <Tag />
          </div>
          <div className="flex flex-row justify-between items-center w-full h-1/5">
            <div className="text-xl font-bold">
              Time:
            </div>
            <div className="text-xl font-bold">
              Venue:
            </div>
            <button
              className="text-xl font-bold h-4/5 bg-gradient-to-br from-cyan-600 to-cyan-400 text-white w-1/4 rounded-3xl mr-4">
              Interested
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
