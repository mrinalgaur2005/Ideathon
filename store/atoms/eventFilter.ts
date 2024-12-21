import {atom} from "recoil";

interface EventFilter {
  tags: string[],
  date: string,
}

export const eventFilterState = atom<EventFilter>({
  key: "eventFilterState",
  default: {
    tags: [],
    date: "",
  }
})