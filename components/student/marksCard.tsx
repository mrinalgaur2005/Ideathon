import Marks from "./marks";

export default function MarksCard() {

  return (
    <>
      <div className="flex flex-col h-3/5 w-3/4 border-2 mt-8 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 flex-shrink-0">
        <div className="ml-4 mt-2 font-bold text-xl">
          Subject Code
        </div>
        <div className="flex flex-row items-center h-full w-full overflow-x-auto mt-2">
          <Marks type="quiz" marks="8" />
          <Marks type="midsem" marks="20"/>
          <Marks type="endsem" marks="50"/>
          <Marks type="quiz2" marks="8"/>
          <Marks type="lab quiz" marks="5"/>
          <Marks type="quiz3" marks="8"/>
        </div>
      </div>
    </>
  )
}