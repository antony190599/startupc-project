import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { programTypes } from "@/lib/enum";
import Link from "next/link";
import React from "react";

interface Program {
  id: string;
  name: string;
  description: string;
  programType: string;
  programStatus: string;
  year: string | null;
  cohortCode: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StepProgramSelectionProps {
  form: any;
  programs: Program[];
  programId: string | undefined;
}

const StepProgramSelection: React.FC<StepProgramSelectionProps> = ({ form, programs, programId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccione el Programa</CardTitle>
        <p className="text-sm text-gray-600">
          Elige el programa que mejor se adapte a la etapa de tu proyecto. Cada programa ofrece diferentes niveles de apoyo y recursos.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="programId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Tipo de Programa</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {programs.map((program) => {
                  const isSelected = field.value === program.id || programId === program.id;
                  const isDisabled = !isSelected && (field.value || programId);

                  return (
                    <div
                      key={program.id}
                      className={`relative rounded-lg border-2 p-6 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 cursor-pointer"
                          : "border-gray-200 opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          field.onChange(program.id);
                        }
                      }}
                      aria-disabled={isDisabled ? true : false}
                      tabIndex={isDisabled ? -1 : 0}
                      role="button"
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="text-3xl">
                          {programTypes.find((p) => p.id === program.programType)?.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{program.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                      {isDisabled && (
                        <div className="absolute inset-0 bg-white opacity-60 rounded-lg pointer-events-none"></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default StepProgramSelection; 