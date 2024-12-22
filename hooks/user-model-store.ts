import { create } from "zustand";
import { Event } from "../model/User";

interface ModelStore {
    allEvents: Event[];
    filteredEvents: Event[];
    isLoading: boolean;
    setAllEvents: (events: Event[]) => void;
    setFilteredEvents: (events: Event[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useModel = create<ModelStore>((set) => ({
    allEvents: [],
    filteredEvents: [],
    isLoading: false,
    setAllEvents: (events) => set({ allEvents: events }),
    setFilteredEvents: (events) => set({ filteredEvents: events }),
    setLoading: (loading) => set({ isLoading: loading }),
}));

