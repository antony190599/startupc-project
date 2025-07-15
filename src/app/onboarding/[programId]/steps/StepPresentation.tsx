import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import React from "react";

interface StepPresentationProps {
  form: any;
}

const StepPresentation: React.FC<StepPresentationProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presentación</CardTitle>
        <p className="text-sm text-gray-600">
          Comparte un video de presentación de tu proyecto y especifica qué tipo de apoyo estás buscando para tu emprendimiento.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="videoFile">Subir video (opcional)</Label>
            <Input
              id="videoFile"
              type="file"
              accept="video/*"
              className="mt-2"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  form.setValue("videoFile", file);
                }
              }}
            />
            {form.watch("videoFile") && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Video seleccionado:</span>{" "}
                <span className="truncate">
                  {form.watch("videoFile")?.name}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            <p>O proporcione una URL de video:</p>
          </div>
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del video</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://youtube.com/watch?v=..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="specificSupport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apoyo puntual que buscas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describa el tipo de apoyo específico que necesita"
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

export default StepPresentation; 