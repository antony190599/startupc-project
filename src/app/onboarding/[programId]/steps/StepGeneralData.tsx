import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parentCategories, industries } from "@/lib/enum";
import React from "react";

interface StepGeneralDataProps {
  form: any;
}

const StepGeneralData: React.FC<StepGeneralDataProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Generales</CardTitle>
        <p className="text-sm text-gray-600">
          Información básica sobre tu proyecto o emprendimiento. Incluye el nombre, categoría, industria y descripción detallada.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del proyecto</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre de su proyecto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(parentCategories).map(([key, value]) => (
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

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pagina Web o perfil de redes sociales</FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describa su proyecto en detalle"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industria a la que pertenece tu proyecto o emprendimiento</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la industria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(industries).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Información de la empresa - Solo para Aceleración */}
        {form.watch("programId") === "aceleracion" && (
          <div className="space-y-6 pt-6 border-t">
            <div>
              <h4 className="text-md font-semibold mb-4">Información de la Empresa</h4>
              <p className="text-sm text-gray-600 mb-4">Información adicional para empresas en aceleración (opcional)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ruc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUC (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="20123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="foundingYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año de fundación (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StepGeneralData; 