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

interface EditClub {
    clubName: string;
    clubLogo: string;
    clubIdSecs: string[];
    clubMembers: string[];
    clubEvents: mongoose.Types.ObjectId[];
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

interface Friends {
    _id: mongoose.Types.ObjectId;
    friends: {
        _id: mongoose.Types.ObjectId;
        name: string;
        student_id: string;
        profile: string;
    } [];
}

interface ModelStore {
    friends: Friends|null;
    editClub: EditClub|null;
    singleClub: SingleClub|null;
    allClubs: Club[];
    profile: Profile|null;
    allEvents: Event[];
    singleEvent:SingleEvent|null;
    isLoading: boolean;
    setFriends: (friends: Friends) => void;
    setProfile:(profile:Profile) => void;
    setSingleClub:(club:SingleClub) => void;
    setAllClub:(clubs:Club[])=>void;
    setEditClub:(club:EditClub) => void;
    setSingleEvent:(event:SingleEvent)=>void;
    setAllEvents: (events: Event[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useModel = create<ModelStore>((set) => ({
    friends: null,
    allEvents: [],
    singleEvent:null,
    singleClub:null,
    allClubs: [],
    editClub:null,
    profile: null,
    isLoading: false,
    setFriends: ((friends) => set({friends: friends})),
    setProfile :((profile)=>set({profile:profile})),
    setSingleClub:((club)=> set({singleClub:club})),
    setAllClub:((clubs)=> set({allClubs:clubs})),
    setEditClub:((club)=> set({editClub:club})),
    setSingleEvent:((event)=>set({singleEvent:event})),
    setAllEvents: (events) => set({ allEvents: events }),
    setLoading: (loading) => set({ isLoading: loading }),
}));

