import {selector} from "recoil";
import {eventsState} from "./event";
import {eventFilterState} from "./eventFilter";

export const filteredEventsState = selector({
  key: "filteredEventsState",
  get: ({ get }) => {
    const events = get(eventsState)
    const filters = get(eventFilterState)

    return events.filter((event) => event.tags.some((tag) => filters.tags.includes(tag)));
  }
})