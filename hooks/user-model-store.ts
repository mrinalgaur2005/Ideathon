import { create } from "zustand";
import mongoose from "mongoose";

interface Event {
    _id: mongoose.Types.ObjectId,
    poster: string,
    heading: string,
    eventHostedBy: string,
    description: string,
    tags: string[],
    eventTime: Date,
    eventVenue: string,
    isInterested: boolean,
}

interface SingleEvent {
    _id: mongoose.Types.ObjectId;
    poster: string;
    heading: string;
    eventHostedBy: string;
    description: string;
    tags: string[];
    eventTime: Date;
    eventVenue: string;
    isInterested: boolean;
    interestedMembersArr: {
        name: string;
        student_id: string;
        profile: string
    } [];
    eventAttachments: string[]
}


interface ModelStore {
    allEvents: Event[];
    singleEvent:SingleEvent|null;
    filteredEvents: Event[];
    isLoading: boolean;
    setSingleEvent:(event:SingleEvent)=>void;
    setAllEvents: (events: Event[]) => void;
    setFilteredEvents: (events: Event[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useModel = create<ModelStore>((set) => ({
    allEvents: [],
    filteredEvents: [],
    singleEvent:null,
    isLoading: false,
    setSingleEvent:((event)=>set({singleEvent:event})),
    setAllEvents: (events) => set({ allEvents: events }),
    setFilteredEvents: (events) => set({ filteredEvents: events }),
    setLoading: (loading) => set({ isLoading: loading }),
}));

