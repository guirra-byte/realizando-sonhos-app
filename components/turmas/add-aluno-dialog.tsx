"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Student, useCadastro } from "@/lib/context";
import { ClassData } from "./chamada-system";

interface AddStudentDialogProps {
  currentClass: ClassData;
  classStudents: Student[];
  inAgeRangeStudents: Student[]
  onAddStudents: (studentsNames: string[]) => void;
}

export function AddStudentDialog({
  classStudents,
  onAddStudents,
}: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudentsNames, setSelectedStudentsNames] = useState<string[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out students already in the class
  const availableStudents = classStudents.filter(
    (student) => !classStudents.some((cs) => cs.id === student.id)
  );

  // Filter students based on search query
  const filteredStudents = availableStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStudent = (studentName: string) => {
    setSelectedStudentsNames((prev) =>
      prev.includes(studentName)
        ? prev.filter((name) => name !== studentName)
        : [...prev, studentName]
    );
  };

  const handleAddStudents = () => {
    if (selectedStudentsNames.length > 0) {
      onAddStudents(selectedStudentsNames);
      setSelectedStudentsNames([]);
      setSearchQuery("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Adicionar Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar aluno na Turma</DialogTitle>
          <DialogDescription>
            Selecione os Alunos para adicionar nesta Turma. <br />
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procure Alunos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto border rounded-md">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {availableStudents.length === 0
                ? "Todos os Alunos já foram adicionados a esta turma"
                : "Nenhum Aluno encontrado"}
            </div>
          ) : (
            <ul className="divide-y">
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  className="flex items-center p-3 hover:bg-muted/50"
                >
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudentsNames.includes(student.name)}
                    onCheckedChange={() => handleToggleStudent(student.name)}
                    className="mr-3"
                  />
                  <label
                    htmlFor={`student-${student.id}`}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.schoolYear}
                      </p>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedStudentsNames([]);
              setSearchQuery("");
            }}
          >
            Limpar Seleção
          </Button>
          <Button
            onClick={handleAddStudents}
            disabled={selectedStudentsNames.length === 0}
          >
            Adicionar {selectedStudentsNames.length} Aluno
            {selectedStudentsNames.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
