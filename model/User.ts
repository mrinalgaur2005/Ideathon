import mongoose, { Schema, Document, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid'

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isStudent:boolean
    isTeacher: boolean;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@pec\.edu\.in$/, 'please use college email id'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isStudent: {
        type: Boolean,
        default: false,
    },
    isTeacher: {
        type: Boolean,
        default: false, // Default to false, only true if admin updates the field
    },
});

UserSchema.post("save", async function (this: User) {
    if (this.isStudent) {
        
        try {
            const existingStudent = await StudentModel.findOne({ user_id: this._id });
            if (existingStudent) {
                console.log(`Student with user_id ${this._id} already exists.`);
                return; 
            }
            const studentId = `S-${uuidv4()}`;
            const newStudent = new StudentModel({
                user_id: this._id,
                name: this.username,
                student_id: studentId,
                semester: 1,
                branch: "Unknown",
                sid_verification: false,
                enrolledSubjectId: [],
                teacherSubjectMap: {},
                attendanceSubjectMap: {},
                marksStudentMap: {},
                clubsPartOf: [],
                interestedEvents: [],
                clubsHeadOf: [],
            });

            await newStudent.save();
        } catch (error) {
            console.error("Error creating student:", error);
        }
    }

    if (this.isTeacher) {
        try {
            const teacherId = `T-${uuidv4()}`;
            const newTeacher = new TeacherModel({
                user_id: this._id,
                teacher_id: teacherId,
                admin_verification: false,
                subjectTeaching: [],
                // StudentsMarksMap: {},
            });

            await newTeacher.save();
        } catch (error) {
            console.error("Error creating teacher:", error);
        }
    }
});


export interface MarksEntry {
    midsem?: number;
    endsem?: number;
    quiz1?: number;
    quiz2?: number;
    quiz3?: number;
    quiz4?: number;
    labquiz1?: number;
    labquiz2?: number;
}

export interface Student extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    name: string;
    student_id?: string;
    semester: number;
    phoneNumber?: number;
    branch: string;
    sid_verification: boolean;
    enrolledSubjectId: string[];
    teacherSubjectMap: Record<string, mongoose.Schema.Types.ObjectId>;
    attendanceSubjectMap: Record<number, string>;
    marksStudentMap: Record<string, MarksEntry>;
    clubsPartOf: mongoose.Schema.Types.ObjectId[];
    interestedEvents: mongoose.Schema.Types.ObjectId[];
    clubsHeadOf: mongoose.Schema.Types.ObjectId[];
    profile?: string;
}

const MarksEntrySchema = new Schema({
    midsem: { type: Number, required: true },
    endsem: { type: Number, required: true },
    quiz1: { type: Number, required: true },
    quiz2: { type: Number,required:false },
    quiz3: { type: Number ,required:false },
    quiz4: { type: Number ,required:false },
    labquiz1: { type: Number, required: true },
    labquiz2: { type: Number ,required:false },
});

const StudentSchema: Schema<Student> = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    student_id: { type: String, unique: true },
    semester: { type: Number, required: true },
    phoneNumber: { type: Number },
    branch: { type: String, required: true },
    sid_verification: { type: Boolean, default: false },
    enrolledSubjectId: [{ type: String }],
    teacherSubjectMap: {
        type: Map,
        of: Schema.Types.ObjectId,
    },
    attendanceSubjectMap: {
        type: Map,
        of: String,
    },
    marksStudentMap: {
        type: Map,
        of: MarksEntrySchema,
    },
    clubsPartOf: [{ type: Schema.Types.ObjectId, ref: "Club" }],
    interestedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    clubsHeadOf: [{ type: Schema.Types.ObjectId, ref: "Club" }],
    profile: {
        type: String,
        required: false,
    }
});


export interface Teacher extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    teacher_id: string;
    admin_verification: boolean;
    subjectTeaching: string[];
    // StudentsMarksMap: Record<string, MarksStudentMap>;
}

const TeacherSchema: Schema<Teacher> = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    teacher_id: { type: String, required: true, unique: true },
    admin_verification: { type: Boolean, default: false },
    subjectTeaching: [{ type: String }],
    // StudentsMarksMap: {
    //     type: Map,
    //     of: {
    //         midsem: {
    //             type: Map,
    //             of: Number,
    //         },
    //         endsem: {
    //             type: Map,
    //             of: Number,
    //         },
    //     },
    //
    // },
});

export interface Club extends Document {
    clubName: string;
    clubLogo?: string;
    clubIdSecs: mongoose.Schema.Types.ObjectId[];
    clubMembers: mongoose.Schema.Types.ObjectId[];
    clubEvents: mongoose.Schema.Types.ObjectId[];
}

const ClubSchema: Schema<Club> = new Schema({
    clubName: { type: String, required: true, unique: true },
    clubLogo: { type: String },
    clubIdSecs: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    clubMembers: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    clubEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});
export interface Event extends Document {
    eventHostedBy: mongoose.Schema.Types.ObjectId;
    eventVenue: string;
    eventTime: Date;
    interestedMembersArr: mongoose.Schema.Types.ObjectId[];
    eventAttachments?: string[];
    poster: string;
    heading: string;
    description: string;
    tags: string[];
}

const EventSchema: Schema<Event> = new Schema({
    eventHostedBy: {
        type: Schema.Types.ObjectId,
        ref:"Club"
    },
    eventVenue: { type: String, required: true },
    eventTime: { type: Date, required: true },
    interestedMembersArr: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    eventAttachments: [{ type: String }],
    poster: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
});

interface Marks {
subjects: {
  [subjectId: string]: {
    [studentId: string]: Array<{
      [examName: string]: number;
    }>;
  };
};
}

const MarksSchema: Schema<Marks> = new Schema({
subjects: {
  type: Map,
  of: {
    type: Map,
    of: [
      {
        type: Map,
        of: { type: Number },
        default: {},
      },
    ],
    default: {},
  },
},
});
  

  

const UserModel: Model<User> =
    mongoose.models.User || mongoose.model<User>("User", UserSchema);

const StudentModel: Model<Student> =
    mongoose.models.Student || mongoose.model<Student>("Student", StudentSchema);

const TeacherModel: Model<Teacher> =
    mongoose.models.Teacher || mongoose.model<Teacher>("Teacher", TeacherSchema);

const ClubModel: Model<Club> =
    mongoose.models.Club|| mongoose.model<Club>("Club", ClubSchema);

const EventModel: Model<Event> =
    mongoose.models.Event || mongoose.model<Event>("Event", EventSchema);

const MarksModel : Model<Marks> =
  mongoose.models.Marks||  mongoose.model<Marks>("Marks",MarksSchema);

export {
    UserModel,
    StudentModel,
    TeacherModel,
    ClubModel,
    EventModel,
    MarksModel
};
