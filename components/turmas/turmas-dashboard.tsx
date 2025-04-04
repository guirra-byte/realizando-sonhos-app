"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CalendarCheck } from "lucide-react";
import { ClassData } from "./chamada-system";

interface ClassesDashboardProps {
  classes: ClassData[];
  onViewClass: (classId: string) => void;
}

export function ClassesDashboard({
  classes,
  onViewClass,
}: ClassesDashboardProps) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Turmas</h2>
      </div>

      {classes.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/20">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma Classe Cadastrada</h3>
          <p className="text-muted-foreground mb-4">
            Crie uma nova Turma e comece a gerenciar a presença dos Alunos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            // Calculate attendance for today
            const todayRecord = classItem.attendanceRecords.find(
              (r) => r.date === today
            );
            const presentToday = todayRecord
              ? todayRecord.presentStudentsNames.length
              : 0;
            const attendanceRate =
              classItem.students.length > 0
                ? Math.round((presentToday / classItem.students.length) * 100)
                : 0;

            return (
              <Card
                key={classItem.id}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <CardTitle>{classItem.name}</CardTitle>
                  <CardDescription>{classItem.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        {classItem.students.length} Alunos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        {presentToday} presentes hoje ({attendanceRate}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t">
                  <Button
                    onClick={() => onViewClass(classItem.id)}
                    className="w-full mt-3"
                  >
                    Visualizar Turma
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
