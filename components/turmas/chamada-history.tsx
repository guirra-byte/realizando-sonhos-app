"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClassData } from "./chamada-system";
import { StatusBadge } from "../../utils/badge";
import { getShift } from "@/utils/get-shift";

interface AttendanceHistoryProps {
  classData: ClassData;
}

export function AttendanceHistory({ classData }: AttendanceHistoryProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedView, setSelectedView] = useState<"calendar" | "list">(
    "calendar"
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get all dates with attendance records
  const attendanceDates = classData.attendanceRecords.map(
    (record) => record.date
  );

  // Get days in current month
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Navigate to previous/next month
  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Get attendance record for a specific date
  const getAttendanceForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return classData.attendanceRecords.find(
      (record) => record.date === dateString
    );
  };

  // Calculate attendance rate for a specific date
  const getAttendanceRateForDate = (date: Date) => {
    const record = getAttendanceForDate(date);
    if (!record) return 0;

    const presentCount = record.presentStudentsNames.length;
    const totalStudents = classData.students.length;
    return totalStudents > 0
      ? Math.round((presentCount / totalStudents) * 100)
      : 0;
  };

  // Get all months with attendance records
  const getMonthsWithRecords = () => {
    const months: Date[] = [];

    attendanceDates.forEach((dateString) => {
      const date = parseISO(dateString);
      const monthStart = startOfMonth(date);

      // Check if this month is already in our array
      if (!months.some((m) => isSameMonth(m, monthStart))) {
        months.push(monthStart);
      }
    });

    // Sort months chronologically
    return months.sort((a, b) => a.getTime() - b.getTime());
  };

  const monthsWithRecords = getMonthsWithRecords();

  // Get student attendance history
  const getStudentAttendanceHistory = (studentId: string) => {
    const history: { date: string; present: boolean }[] = [];

    classData.attendanceRecords.forEach((record) => {
      history.push({
        date: record.date,
        present: record.presentStudentsNames.includes(studentId),
      });
    });

    // Sort by date (newest first)
    return history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  // Calculate attendance percentage for a student
  const getStudentAttendancePercentage = (studentId: string) => {
    if (classData.attendanceRecords.length === 0) return 0;

    let presentCount = 0;

    classData.attendanceRecords.forEach((record) => {
      if (record.presentStudentsNames.includes(studentId)) {
        presentCount++;
      }
    });

    return Math.round(
      (presentCount / classData.attendanceRecords.length) * 100
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
        <CardDescription>View attendance records over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedView}
          onValueChange={(v) => setSelectedView(v as "calendar" | "list")}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Student View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: firstDayOfMonth.getDay() }).map(
                (_, index) => (
                  <div
                    key={`empty-start-${index}`}
                    className="h-20 p-1 border rounded-md bg-muted/20"
                  ></div>
                )
              )}

              {/* Calendar days */}
              {daysInMonth.map((day) => {
                const dateString = format(day, "yyyy-MM-dd");
                const hasAttendance = attendanceDates.includes(dateString);
                const attendanceRate = getAttendanceRateForDate(day);
                const attendanceRecord = hasAttendance
                  ? classData.attendanceRecords.find(
                      (record) => record.date === dateString
                    )
                  : null;

                return (
                  <div
                    key={dateString}
                    className={`h-20 p-1 border rounded-md ${
                      hasAttendance
                        ? "bg-blue-50 dark:bg-blue-950/20 cursor-pointer hover:border-primary"
                        : "bg-muted/20"
                    }`}
                    onClick={() => {
                      if (hasAttendance && attendanceRecord) {
                        setSelectedDate(dateString);
                      }
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="text-xs font-medium">
                        {format(day, "d")}
                      </div>
                      {hasAttendance && (
                        <div className="mt-auto flex flex-col items-center">
                          <StatusBadge
                            children={`${attendanceRate}%`}
                            type={attendanceRate > 70 ? "success" : "danger"}
                          />
                          <div className="text-[10px] mt-1">
                            {attendanceRecord?.presentStudentsNames.length || 0}
                            /{classData.students.length}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Empty cells for days after the last day of month */}
              {Array.from({ length: 6 - lastDayOfMonth.getDay() }).map(
                (_, index) => (
                  <div
                    key={`empty-end-${index}`}
                    className="h-20 p-1 border rounded-md bg-muted/20"
                  ></div>
                )
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {monthsWithRecords.length > 0 && (
                <>
                  <div className="text-sm font-medium mr-2">Jump to:</div>
                  {monthsWithRecords.map((month) => (
                    <Button
                      key={format(month, "yyyy-MM")}
                      variant="outline"
                      size="sm"
                      className={`text-xs ${
                        isSameMonth(month, currentMonth)
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                      onClick={() => setCurrentMonth(month)}
                    >
                      {format(month, "MMM yyyy")}
                    </Button>
                  ))}
                </>
              )}
            </div>

            {/* Day details dialog */}
            {selectedDate && (
              <Dialog
                open={!!selectedDate}
                onOpenChange={(open) => !open && setSelectedDate(null)}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Attendance for{" "}
                      {format(parseISO(selectedDate), "MMMM d, yyyy")}
                    </DialogTitle>
                    <DialogDescription>
                      Students present on this day
                    </DialogDescription>
                  </DialogHeader>

                  <div className="max-h-[400px] overflow-y-auto border rounded-md">
                    {classData.students.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No students in this class
                      </div>
                    ) : (
                      <div className="divide-y">
                        {classData.students.map((student) => {
                          const record = classData.attendanceRecords.find(
                            (r) => r.date === selectedDate
                          );
                          const isPresent =
                            record?.presentStudentsNames.includes(
                              student.name
                            ) || false;

                          return (
                            <div
                              key={student.id}
                              className={`flex items-center justify-between p-3 ${
                                isPresent
                                  ? "bg-green-50 dark:bg-green-950/10"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-medium text-sm">
                                    {student.name}
                                  </p>
                                  {getShift(student.shift) === "MANHÃ" ? (
                                    <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
                                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />{" "}
                                      {getShift(student.shift)}
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
                                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />{" "}
                                      {getShift(student.shift)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div>
                                {isPresent ? (
                                  <StatusBadge
                                    children={
                                      <>
                                        <UserCheck className="h-3 w-3" />
                                        Present
                                      </>
                                    }
                                    type="success"
                                  />
                                ) : (
                                  <StatusBadge
                                    children={
                                      <>
                                        <UserX className="h-3 w-3" />
                                        Absent
                                      </>
                                    }
                                    type="danger"
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button onClick={() => setSelectedDate(null)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          <TabsContent value="list">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {classData.students.map((student) => {
                  const attendanceHistory = getStudentAttendanceHistory(
                    student.name
                  );
                  const attendancePercentage = getStudentAttendancePercentage(
                    student.name
                  );

                  return (
                    <div
                      key={student.name}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            {getShift(student.shift) === "MANHÃ" ? (
                              <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />{" "}
                                {getShift(student.shift)}
                              </Badge>
                            ) : (
                              <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />{" "}
                                {getShift(student.shift)}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <StatusBadge
                          children={<>{attendancePercentage}% Attendance</>}
                          type={
                            attendancePercentage > 70 ? "success" : "danger"
                          }
                        />
                      </div>

                      {attendanceHistory.length > 0 ? (
                        <div className="divide-y">
                          {attendanceHistory.map((record) => (
                            <div
                              key={record.date}
                              className={`flex justify-between items-center p-3 text-sm ${
                                record.present
                                  ? "bg-green-50 dark:bg-green-950/10"
                                  : ""
                              }`}
                            >
                              <div>
                                {format(
                                  parseISO(record.date),
                                  "EEEE, MMMM d, yyyy"
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {record.present ? (
                                  <>
                                    <UserCheck className="h-4 w-4 text-green-500" />
                                    <span className="text-green-600 dark:text-green-400">
                                      Present
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="h-4 w-4 text-red-500" />
                                    <span className="text-red-600 dark:text-red-400">
                                      Absent
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No attendance records for this student
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
