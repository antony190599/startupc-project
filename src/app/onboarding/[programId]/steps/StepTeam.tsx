import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { universities, sources } from "@/lib/enum";
import React from "react";

interface StepTeamProps {
  form: any;
  fields: any[];
  append: () => void;
  remove: (index: number) => void;
}

const StepTeam: React.FC<StepTeamProps> = ({ form, fields, append, remove }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipo</CardTitle>
        <p className="text-sm text-gray-600">
          Información de todos los integrantes del equipo. Incluye datos académicos, de contacto y cómo se conocieron.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Cómo se enteró del programa?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  {Object.entries(sources).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Integrante {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`teamMembers.${index}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombres</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`teamMembers.${index}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellidos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`teamMembers.${index}.dni`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`teamMembers.${index}.university`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Universidad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una universidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(universities).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo para especificar otra universidad */}
            {form.watch(`teamMembers.${index}.university`) === "otras" && (
              <FormField
                control={form.control}
                name={`teamMembers.${index}.otherUniversity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especifique el nombre de la universidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre de su universidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Fields only for Laureate universities */}
            {(() => {
              const selectedUniversity = form.watch(`teamMembers.${index}.university`);
              const laureateUniversities = ["upc", "upn", "cibertec"];
              const isLaureateUniversity = laureateUniversities.includes(selectedUniversity);
              return isLaureateUniversity ? (
                <div className="space-y-4 pt-4 border-t">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-3">
                      Información adicional para estudiantes de Laureate
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.studentCode`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col h-full">
                            <FormLabel>Código de Alumno</FormLabel>
                            <FormControl>
                              <Input placeholder="20230001" {...field} />
                            </FormControl>
                            <div className="flex-1 min-h-[20px] flex items-end">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.cycle`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col h-full">
                            <FormLabel>Ciclo en el que te encuentras</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione el ciclo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((cycle) => {
                                  const ordinalMap: { [key: number]: string } = {
                                    1: "1er",
                                    2: "2do",
                                    3: "3er",
                                    4: "4to",
                                    5: "5to",
                                    6: "6to",
                                    7: "7mo",
                                    8: "8vo",
                                    9: "9no",
                                    10: "10mo"
                                  };
                                  return (
                                    <SelectItem key={cycle} value={cycle.toString()}>
                                      {ordinalMap[cycle]} Ciclo
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <div className="flex-1 min-h-[20px] flex items-end">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`teamMembers.${index}.universityEmail`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col h-full">
                            <FormLabel>Correo universitario</FormLabel>
                            <FormControl>
                              <Input placeholder="alumno@university.edu.pe" {...field} />
                            </FormControl>
                            <div className="flex-1 min-h-[20px] flex items-end">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`teamMembers.${index}.career`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrera</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingeniería de Sistemas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`teamMembers.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="999888777" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`teamMembers.${index}.contactEmail`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de contacto</FormLabel>
                    <FormControl>
                      <Input placeholder="contacto@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`teamMembers.${index}.linkedin`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        {fields.length >= 2 && (
          <div className="space-y-6 pt-6 border-t">
            <FormField
              control={form.control}
              name="howMet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ¿Cómo y cuándo se conocieron?
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <p className="text-sm text-gray-600 mb-2">
                    Este campo es requerido cuando hay 2 o más integrantes en el equipo.
                  </p>
                  <FormControl>
                    <Textarea 
                      placeholder="Describa cómo y cuándo se conocieron los integrantes"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={append}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Integrante
        </Button>
      </CardContent>
    </Card>
  );
};

export default StepTeam; 