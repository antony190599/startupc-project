import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Edit } from "lucide-react";
import { parentCategories, industries, projectOrigins, stages, sources, universities, sports, hobbies, movieGenres } from "@/lib/enum";
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

interface StepConsentProps {
  form: any;
  programs: Program[];
  goToStep: (stepIndex: number) => void;
}

const StepConsent: React.FC<StepConsentProps> = ({ form, programs, goToStep }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revisión Final y Consentimiento</CardTitle>
          <p className="text-sm text-gray-600">
            Revisa toda la información de tu proyecto antes de enviar el formulario. Asegúrate de que todos los datos sean correctos.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["step-0", "step-1", "step-2", "step-3", "step-4", "step-5"]} className="space-y-4">
            
            {/* Paso 0: Selección de Programa */}
            <AccordionItem value="step-0" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Paso 1: Selección de Programa</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep(0);
                    }}
                    className="hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Tipo de Programa:</span>
                    <span className="text-gray-700">
                      {programs.find(p => p.id === form.watch('programId'))?.name || 'No seleccionado'}
                    </span>
                  </div>
                  {form.watch('programId') && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Descripción:</strong> {programs.find(p => p.id === form.watch('programId'))?.description}
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Paso 1: Datos Generales */}
            <AccordionItem value="step-1" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Paso 2: Datos Generales</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep(1);
                    }}
                    className="hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Nombre del Proyecto:</span>
                      <span className="text-gray-700">{form.watch('projectName') || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Categoría:</span>
                      <span className="text-gray-700">{parentCategories[form.watch('category') as keyof typeof parentCategories] || 'No seleccionada'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Industria:</span>
                      <span className="text-gray-700">{industries[form.watch('industry') as keyof typeof industries] || 'No seleccionada'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Website/Redes:</span>
                      <span className="text-gray-700">{form.watch('website') || 'No especificado'}</span>
                    </div>
                    {form.watch('ruc') && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">RUC:</span>
                        <span className="text-gray-700">{form.watch('ruc')}</span>
                      </div>
                    )}
                    {form.watch('foundingYear') && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Año de Fundación:</span>
                        <span className="text-gray-700">{form.watch('foundingYear')}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium block mb-2">Descripción:</span>
                    <p className="text-gray-700">{form.watch('description') || 'No especificada'}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Paso 2: Impacto y Origen */}
            <AccordionItem value="step-2" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Paso 3: Impacto y Origen</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep(2);
                    }}
                    className="hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Origen del Proyecto:</span>
                      <span className="text-gray-700">{projectOrigins[form.watch('projectOrigin') as keyof typeof projectOrigins] || 'No seleccionado'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Etapa del Proyecto:</span>
                      <span className="text-gray-700">{stages[form.watch('stage') as keyof typeof stages] || 'No seleccionada'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium block mb-2">Problema/Oportunidad:</span>
                      <p className="text-gray-700">{form.watch('problem') || 'No especificado'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium block mb-2">Valor de la Oportunidad:</span>
                      <p className="text-gray-700">{form.watch('opportunityValue') || 'No especificado'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium block mb-2">Perfil del Cliente:</span>
                      <p className="text-gray-700">{form.watch('customerProfile') || 'No especificado'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium block mb-2">Impacto Positivo:</span>
                      <p className="text-gray-700">{form.watch('impact') || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Paso 3: Presentación */}
            <AccordionItem value="step-3" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Paso 4: Presentación</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep(3);
                    }}
                    className="hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="space-y-3">
                    {form.watch('videoFile') && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Video Subido:</span>
                        <span className="text-gray-700">{form.watch('videoFile')?.name}</span>
                      </div>
                    )}
                    {form.watch('videoUrl') && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">URL del Video:</span>
                        <span className="text-gray-700 break-all">{form.watch('videoUrl')}</span>
                      </div>
                    )}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium block mb-2">Apoyo Específico:</span>
                      <p className="text-gray-700">{form.watch('specificSupport') || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Paso 4: Equipo */}
            <AccordionItem value="step-4" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Paso 5: Equipo ({form.watch('teamMembers')?.length || 0} integrantes)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep(4);
                    }}
                    className="hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Fuente de Información:</span>
                    <span className="text-gray-700">{sources[form.watch('source') as keyof typeof sources] || 'No seleccionada'}</span>
                  </div>
                  
                  {form.watch('howMet') && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium block mb-2">Cómo se Conocieron:</span>
                      <p className="text-gray-700">{form.watch('howMet')}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {form.watch('teamMembers')?.map((member: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-lg">Integrante {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium text-sm">Nombres:</span>
                            <span className="text-gray-700 text-sm">{member.firstName} {member.lastName}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium text-sm">DNI:</span>
                            <span className="text-gray-700 text-sm">{member.dni}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium text-sm">Universidad:</span>
                            <span className="text-gray-700 text-sm text-end">
                              {member.university === 'otras' 
                                ? member.otherUniversity 
                                : universities[member.university as keyof typeof universities]}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium text-sm">Carrera:</span>
                            <span className="text-gray-700 text-sm">{member.career}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium text-sm">Teléfono:</span>
                            <span className="text-gray-700 text-sm">{member.phone}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium text-sm">Email:</span>
                            <span className="text-gray-700 text-sm">{member.contactEmail}</span>
                          </div>
                          {member.studentCode && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="font-medium text-sm">Código Alumno:</span>
                              <span className="text-gray-700 text-sm">{member.studentCode}</span>
                            </div>
                          )}
                          {member.cycle && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="font-medium text-sm">Ciclo:</span>
                              <span className="text-gray-700 text-sm">{member.cycle}</span>
                            </div>
                          )}
                          {member.universityEmail && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="font-medium text-sm">Email Universitario:</span>
                              <span className="text-gray-700 text-sm">{member.universityEmail}</span>
                            </div>
                          )}
                          {member.linkedin && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="font-medium text-sm">LinkedIn:</span>
                              <span className="text-gray-700 text-sm break-all">{member.linkedin}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Paso 5: Preferencias Personales */}
            <AccordionItem value="step-5" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">Paso 6: Preferencias Personales</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep(5);
                    }}
                    className="hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Deporte Favorito:</span>
                    <span className="text-gray-700">{sports[form.watch('favoriteSport') as keyof typeof sports] || 'No seleccionado'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Hobby Favorito:</span>
                    <span className="text-gray-700">{hobbies[form.watch('favoriteHobby') as keyof typeof hobbies] || 'No seleccionado'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Género de Películas:</span>
                    <span className="text-gray-700 text-end">{movieGenres[form.watch('favoriteMovieGenre') as keyof typeof movieGenres] || 'No seleccionado'}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consentimiento</CardTitle>
          <p className="text-sm text-gray-600">
            Revisa y acepta los términos y condiciones, así como el aviso de privacidad para completar tu registro.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="privacyConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Acepto el aviso de privacidad y los términos y condiciones
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StepConsent; 