import {atom} from "recoil";
import mongoose from "mongoose";

interface Event {
  _id: mongoose.Types.ObjectId
  eventHostedBy: string,
  heading: string,
  eventTime: Date,
  description: string,
  eventVenue: string,
  poster: string,
  tags: string[],
  isInterested: boolean,
}

export const eventsState = atom<Event[]>({
  key: "eventsState",
  default: [],
})

export const pageState = atom<number>({
  key: "pageState",
  default: 1,
})