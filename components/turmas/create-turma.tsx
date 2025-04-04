"use client";

import type React from "react";
import { Student, useCadastro } from "@/lib/context";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClassData } from "./chamada-system";
import { isAfter } from "date-fns";

interface CreateClassFormProps {
  onCreateClass: (
    newClass: Omit<ClassData, "id" | "students" | "attendanceRecords">
  ) => void;
}

export function CreateClassForm({ onCreateClass }: CreateClassFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim()) {
      onCreateClass({
        name: name.trim(),
        description: description.trim(),
      });

      // Reset form
      setName("");
      setDescription("");
    }
  };

  const minAge = 0;
  const maxAge = 18;
  const defaultMinAge = 3;
  const defaultMaxAge = 12;

  const [range, setRange] = useState<[number, number]>([
    defaultMinAge,
    defaultMaxAge,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMin: boolean
  ) => {
    const value = Math.max(minAge, Math.min(maxAge, Number(e.target.value)));
    const newRange = isMin
      ? [value, Math.max(value, range[1])]
      : [Math.min(value, range[0]), value];
    setRange(newRange as [number, number]);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Nova Turma</CardTitle>
        <CardDescription>
          Adicionar nova turma para gerenciar a presença dos Alunos
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class-name">Nome da Turma</Label>
            <Input
              id="class-name"
              placeholder="ex: 5° Ano - Turma Verde"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              {["Idade Mínima", "Idade Máxima"].map((label, index) => (
                <div key={index} className="space-y-2 flex-1">
                  <Label>{label}</Label>
                  <Input
                    type="number"
                    min={minAge}
                    max={maxAge}
                    value={range[index]}
                    onChange={(e) => handleInputChange(e, index === 0)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class-description">Descrição (Opcional)</Label>
            <Textarea
              id="class-description"
              placeholder="Descrição da Turma"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setName("");
              setDescription("");
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Criar Turma
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
