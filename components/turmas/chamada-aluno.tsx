"use client";

import { useState } from "react";
import { CheckCircle2, UserCheck, UserX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "../../utils/badge";
import { useCadastro } from "@/lib/context";

// Sample student data - in a real app, this would come from a database
const initialStudents = [
  {
    id: 1,
    name: "Alex Johnson",
    present: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Jamie Smith",
    present: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Taylor Brown",
    present: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Morgan Wilson",
    present: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Casey Davis",
    present: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function StudentAttendance() {
  const { students: allStudents } = useCadastro();
  const [students, setStudents] = useState(allStudents);
  useEffect(() => {}, []);

  const [date, setDate] = useState(new Date());
  const [attendance, setAttendance] = useState();

  // Toggle student attendance status
  const toggleAttendance = (name: string) => {
    setStudents(
      students.map((student) =>
        student.name === name
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  // Calculate attendance statistics
  const presentCount = students.filter((student) => student.present).length;
  const totalStudents = students.length;
  const attendanceRate = Math.round((presentCount / totalStudents) * 100);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-primary">
              Student Attendance
            </CardTitle>
            <CardDescription>
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-1 text-sm">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span className="font-medium">{presentCount}</span>
              <span className="text-muted-foreground">present</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-1 text-sm">
              <UserX className="h-4 w-4 text-red-500" />
              <span className="font-medium">
                {totalStudents - presentCount}
              </span>
              <span className="text-muted-foreground">absent</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
            <StatusBadge
              children={`${attendanceRate}%`}
              type={attendanceRate > 70 ? "success" : "danger"}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {students.map((student) => (
            <li
              key={student.id}
              className={`flex items-center justify-between p-4 ${
                student.present ? "bg-green-50 dark:bg-green-950/20" : ""
              } transition-colors duration-200`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-muted">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.present ? (
                      <span className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Present
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Not checked in
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => toggleAttendance(student.id)}
                variant={student.present ? "outline" : "default"}
                size="sm"
                className={`transition-all ${
                  student.present
                    ? "border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                    : ""
                }`}
              >
                {student.present ? "Checked In" : "Check In"}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
