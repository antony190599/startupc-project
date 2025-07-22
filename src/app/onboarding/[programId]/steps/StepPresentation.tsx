import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { uploadLanderImageAction } from "@/lib/actions/applications/upload-video-presentation";

interface StepPresentationProps {
  form: any;
}

const StepPresentation: React.FC<StepPresentationProps> = ({ form }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  //const { executeAsync } = useAction(uploadLanderImageAction);

  const handleUploadVideo = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      // 1. Obtener signed URL
      
      //const res = await executeAsync({});

      const res = await fetch('/api/uploads');

      const data = await res.json();

      console.log(data);

      const signedUrl = data?.signedUrl;
      const destinationUrl = data?.destinationUrl;
      if (!signedUrl || !destinationUrl) {
        setUploadError("No se pudo obtener URL de subida.");
        setUploading(false);
        return;
      }

      // 2. Subir el archivo
      const uploadResp = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });


      if (!uploadResp.ok) {
        setUploadError("Error al subir el video. Intenta nuevamente.");
        setUploading(false);
        return;
      }
      console.log("uploadResp");

      console.log(uploadResp);
      // 3. Guardar la URL en el formulario
      form.setValue("videoUrl", destinationUrl);
      form.setValue("videoFile", file); // Solo para mostrar el nombre
    } catch (err: any) {
      console.log("catch");
      console.error(err);

      //RESPONSE ERROR

      setUploadError("Error inesperado al subir el video.");
    } finally {
      setUploading(false);
      console.log("finally");
    }
  }

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
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUploadVideo(file);
                }
              }}
            />
            {uploading && (
              <div className="mt-2 text-sm text-blue-600">Subiendo video...</div>
            )}
            {uploadError && (
              <div className="mt-2 text-sm text-red-600">{uploadError}</div>
            )}
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