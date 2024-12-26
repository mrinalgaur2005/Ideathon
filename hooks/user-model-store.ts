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
        _id: mongoose.Types.ObjectId;
        name: string;
        student_id: string;
        profile: string
    } [];
    eventAttachments: string[]
}

interface SingleClub {
    _id: mongoose.Types.ObjectId;
    clubName: string;
    clubLogo: string;
    clubIdSecs: {
        profile: string;
        student_id: string;
        name: string;
    }[];
    clubMembers: {
        profile: string;
        student_id: string;
        name: string;
    }[];
    clubEvents: {
        _id: mongoose.Types.ObjectId;
        heading: string;
        isInterested: boolean;
        eventTime: Date;
        eventVenue: string
    }[];
}

interface Club {
    _id: mongoose.Types.ObjectId;
    clubName: string;
    clubLogo: string;
}

interface Profile {
    _id:mongoose.Types.ObjectId;
    name: string;
    student_id: string;
    semester: number;
    branch: string;
    profile: string;
    subjectMarks: {
        subjectId: string;
        allMarks: {
            examType: string;
            marks: number;
        }[];
    }[],
    clubsPartOf: {
        _id: mongoose.Types.ObjectId;
        clubName: string;
        clubLogo: string;
    }[]
}

interface ModelStore {
    singleClub: SingleClub|null;
    allClubs: Club[];
    profile: Profile|null;
    allEvents: Event[];
    singleEvent:SingleEvent|null;
    isLoading: boolean;
    setProfile:(profile:Profile) => void;
    setSingleClub:(club:SingleClub) => void;
    setAllClub:(clubs:Club[])=>void;
    setSingleEvent:(event:SingleEvent)=>void;
    setAllEvents: (events: Event[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useModel = create<ModelStore>((set) => ({
    allEvents: [],
    singleEvent:null,
    singleClub:null,
    allClubs: [],
    profile: null,
    isLoading: false,
    setProfile :((profile)=>set({profile:profile})),
    setSingleClub:((club)=> set({singleClub:club})),
    setAllClub:((clubs)=> set({allClubs:clubs})),
    setSingleEvent:((event)=>set({singleEvent:event})),
    setAllEvents: (events) => set({ allEvents: events }),
    setLoading: (loading) => set({ isLoading: loading }),
}));

