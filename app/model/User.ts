import mongoose,{Schema,Document} from "mongoose";

type marksStudentMap={midsem:Record<string,number>,endsem:Record<string,number>};


export interface User extends Document {
    email: string;
    password: string;
    is_teacher: boolean;
    is_admin: boolean;
}

export interface Student extends Document{
    user_id:mongoose.Schema.Types.ObjectId;
    name:string;
    student_id:string;
    semester:number;
    phoneNumber?:number;
    branch:string;
    sid_verification:boolean;
    enrolledSubjectId:string[];
    teacherSubjectMap:Record<string, mongoose.Schema.Types.ObjectId>;
    attendaceSubjectMap:Record<number,string>;

    marksStudentMap:marksStudentMap;

    clubsPartOf: Club[];
    interestedEvents:Event[];
    clubsHeadOf:Club[];
}

export interface Teacher extends Document{
    user_id:mongoose.Schema.Types.ObjectId;
    teacher_id:string;
    admin_verification:boolean;
    subjectTeaching:string[];
    StudentsMarksMap:Record<string,marksStudentMap>;
}

export interface Admin{
    user_id:mongoose.Schema.Types.ObjectId;
}

export interface Club extends Document{
    clubName:string;
    clubIdSecs:Student[];
    clubMembers:Student[];
    clubEvents:Event[];
}

export interface Event extends Document{
    eventHostedBy:mongoose.Schema.Types.ObjectId;
    eventVenue:string;
    eventTime:Date;
    interestedMembersArr:Student[];
    eventAttachements?:string;
    heading:string;
    description:string;
    tags:string[];
}
