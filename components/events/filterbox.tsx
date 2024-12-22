"use client"

import {useSetRecoilState} from "recoil";
import {eventFilterState} from "../../store/atoms/eventFilter";
import {ChangeEvent} from "react";
import {pageState} from "../../store/atoms/event";

export default function FilterBox() {
  const setPage = useSetRecoilState(pageState);
  const setEventFilter = useSetRecoilState(eventFilterState);

  function handleChange(e: ChangeEvent<HTMLInputElement>, value: string) {
    setPage(1);
    if (e.target.checked) {
      setEventFilter((oldState) => {
        return {
          date: oldState.date,
          tags: [...oldState.tags, value],
        }
      })
    } else {
      setEventFilter((oldState) => {
        return {
          date: oldState.date,
          tags: oldState.tags.filter((tag) => tag !== value),
        }
      })
    }
  }

  return (
    <>
      <div className="flex flex-col w-4/5 h-96 pl-4 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50">
        <div className="text-2xl font-bold text-center mt-4 mb-4">
          Filter Options
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={(e)=> handleChange(e, "Tech")}
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Tech
          </div>
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={(e)=> handleChange(e, "Coding")}
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Coding
          </div>
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={(e)=> handleChange(e, "Robotics")}
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Robotics
          </div>
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={(e)=> handleChange(e, "Music")}
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Music
          </div>
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={(e)=> handleChange(e, "dance")}
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Dance
          </div>
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={(e)=> handleChange(e, "Art")}
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Art
          </div>
        </div>
        <div className="text-lg font-bold flex flex-row w-full mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="hidden peer"
              onChange={(e)=> handleChange(e, "Comedy")}
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-500 peer-checked:bg-cyan-500 peer-checked:border-cyan-500"></div>
          </label>
          <div className="ml-2">
            Comedy
          </div>
        </div>
      </div>
    </>
  )
}