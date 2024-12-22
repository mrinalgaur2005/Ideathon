import { create } from "zustand";
import { Event } from "../model/User";

interface ModelStore {
    allEvents: Event[];
    singleEvent:Event|null;
    filteredEvents: Event[];
    isLoading: boolean;
    setSingleEvent:(event:Event)=>void;
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

