import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { projectOrigins, stages } from "@/lib/enum";
import React from "react";

interface StepImpactOriginProps {
  form: any;
}

const StepImpactOrigin: React.FC<StepImpactOriginProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impacto y Origen</CardTitle>
        <p className="text-sm text-gray-600">
          Cuéntanos sobre el origen de tu proyecto, el problema que resuelve, tu cliente objetivo y el impacto que esperas generar.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="projectOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>El proyecto proviene de:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  {Object.entries(projectOrigins).map(([key, value]) => (
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
        <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>En que etapa se encuentra el proyecto?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  {Object.entries(stages).map(([key, value]) => (
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
        <FormField
          control={form.control}
          name="problem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cual es el problema u oportunidad que tu proyecto resuelve?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Explique el problema o oportunidad que su proyecto resuelve"
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
          name="opportunityValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Por qué es valiosa la oportunidad?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Explique el valor y potencial de su oportunidad"
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
          name="customerProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe el perfil de tu usuario / cliente objetivo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe el perfil de tu usuario / cliente objetivo"
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
          name="impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cual es el impacto positivo de tu proyecto o potencial de impacto?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe el impacto positivo de tu proyecto o potencial de impacto"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default StepImpactOrigin; 