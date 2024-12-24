import Marks from "./marks";
import { subjectMarks } from "../../types/SubjectMakrs";

interface MarksCardProps {
  subjectMarks: subjectMarks;
}

export default function MarksCard({ subjectMarks }: MarksCardProps) {
  return (
    <>
      <div className="flex flex-col h-3/5 w-3/4 border-2 mt-8 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 flex-shrink-0">
        {subjectMarks.map((subject) => {
          return (
            <div key={subject.subjectId}>
              <div className="ml-4 mt-2 font-bold text-xl">
                Subject Code: {subject.subjectId}
              </div>
              {subject.allMarks.map((singleMark, index) => {
                return (
                  <div key={index} className="flex flex-row items-center h-full w-full overflow-x-auto mt-2">
                    <Marks type={singleMark.examType} marks={singleMark.marks} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
