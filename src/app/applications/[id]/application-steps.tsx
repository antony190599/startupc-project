'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, Clock, ExternalLink, Video, Users, Target, Lightbulb, FileText, Shield } from 'lucide-react';

import { ApplicationStepsProps } from './types';
import { steps } from '@/lib/enum';

export default function ApplicationSteps({ application }: ApplicationStepsProps) {
  // Helper function to check if a step has data
  const hasStepData = (stepKey: string, fields: string[]) => {
    return fields.some(field => {
      const value = (application as any)[field];
      return value && value !== '';
    });
  };

  // Helper function to get step completion status
  const getStepStatus = (stepKey: string, fields: string[]) => {
    const hasData = hasStepData(stepKey, fields);
    const isCurrentStep = application.onboardingStep === stepKey;
    
    if (hasData) return 'completed';
    if (isCurrentStep) return 'current';
    return 'pending';
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'current':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'current':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Step definitions
  const stepsApplication = [
    {
      key: steps[0].id,
      title: steps[0].title,
      icon: <Target className="h-4 w-4" />,
      fields: ['programType'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Programa Seleccionado</h4>
              <Badge variant="outline" className="mt-1">
                {application.programType || 'No seleccionado'}
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      key: steps[1].id,
      title: steps[1].title,
      icon: <FileText className="h-4 w-4" />,
      fields: ['projectName', 'website', 'category', 'industry', 'description', 'ruc', 'foundingYear'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Nombre del Proyecto</h4>
              <p className="text-sm text-muted-foreground">{application.projectName || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">Sitio Web</h4>
              {application.website ? (
                <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  {application.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No proporcionado</p>
              )}
            </div>
            <div>
              <h4 className="font-medium">Categoría</h4>
              <p className="text-sm text-muted-foreground">{application.category || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">Industria</h4>
              <p className="text-sm text-muted-foreground">{application.industry || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">RUC</h4>
              <p className="text-sm text-muted-foreground">{application.ruc || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">Año de Fundación</h4>
              <p className="text-sm text-muted-foreground">{application.foundingYear || 'No proporcionado'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Descripción</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.description || 'No proporcionado'}</p>
          </div>
        </div>
      )
    },
    {
      key: steps[2].id,
      title: steps[2].title,
      icon: <Lightbulb className="h-4 w-4" />,
      fields: ['opportunityValue', 'stage', 'projectOrigin', 'problem', 'customerProfile', 'impact'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Valor de la Oportunidad</h4>
              <p className="text-sm text-muted-foreground">{application.opportunityValue || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">Etapa</h4>
              <p className="text-sm text-muted-foreground">{application.stage || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">Origen del Proyecto</h4>
              <p className="text-sm text-muted-foreground">{application.projectOrigin || 'No proporcionado'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Declaración del Problema</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.problem || 'No proporcionado'}</p>
          </div>
          <div>
            <h4 className="font-medium">Perfil del Cliente</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.customerProfile || 'No proporcionado'}</p>
          </div>
          <div>
            <h4 className="font-medium">Impacto</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.impact || 'No proporcionado'}</p>
          </div>
        </div>
      )
    },
    {
      key: steps[3].id,
      title: steps[3].title,
      icon: <Video className="h-4 w-4" />,
      fields: ['videoUrl', 'videoFileName', 'specificSupport'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">URL del Video</h4>
              {application.videoUrl ? (
                <a href={application.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Ver Video
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No proporcionado</p>
              )}
            </div>
            <div>
              <h4 className="font-medium">Archivo de Video</h4>
              <p className="text-sm text-muted-foreground">{application.videoFileName || 'No proporcionado'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Apoyo Específico Necesario</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.specificSupport || 'No proporcionado'}</p>
          </div>
        </div>
      )
    },
    {
      key: steps[4].id,
      title: steps[4].title,
      icon: <Users className="h-4 w-4" />,
      fields: ['howMet', 'source'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Cómo se Conoció el Equipo</h4>
              <p className="text-sm text-muted-foreground">{application.howMet || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">Fuente</h4>
              <p className="text-sm text-muted-foreground">{application.source || 'No proporcionado'}</p>
            </div>
          </div>
          
          {/* Team Members */}
          <div>
            <h4 className="font-medium mb-3">Miembros del Equipo</h4>
            {application.teamMembers && application.teamMembers.length > 0 ? (
              <div className="space-y-3">
                {application.teamMembers.map((member: {
                  id: string;
                  firstName: string;
                  lastName: string;
                  contactEmail: string;
                  university: string | null;
                  career: string | null;
                  studentCode: string | null;
                  phone: string | null;
                  universityEmail: string | null;
                  linkedin: string | null;
                  otherUniversity: string | null;
                  dni: string | null;
                }) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h5 className="font-medium">{member.firstName} {member.lastName}</h5>
                        <p className="text-sm text-muted-foreground">{member.contactEmail}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.career || '-'}{member.university ? ` • ${member.university}` : ''}
                        </p>
                        {member.universityEmail && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Correo universitario:</span> {member.universityEmail}
                          </p>
                        )}
                        {member.studentCode && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Código estudiante:</span> {member.studentCode}
                          </p>
                        )}
                        {member.dni && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">DNI:</span> {member.dni}
                          </p>
                        )}
                        {member.otherUniversity && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Otra universidad:</span> {member.otherUniversity}
                          </p>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        {member.phone && (
                          <p className="text-sm text-muted-foreground">{member.phone}</p>
                        )}
                        {member.linkedin && (
                          <a
                            href={
                              member.linkedin.startsWith('http')
                                ? member.linkedin
                                : `https://linkedin.com/in/${member.linkedin}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No se han agregado miembros del equipo</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: steps[5].id,
      title: steps[5].title,
      icon: <Shield className="h-4 w-4" />,
      fields: ['favoriteSport', 'favoriteHobby', 'favoriteMovieGenre', 'privacyConsent'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium">Deporte Favorito</h4>
              <p className="text-sm text-muted-foreground">{application.favoriteSport || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">Pasatiempo Favorito</h4>
              <p className="text-sm text-muted-foreground">{application.favoriteHobby || 'No proporcionado'}</p>
            </div>
            <div>
              <h4 className="font-medium">Género de Película Favorito</h4>
              <p className="text-sm text-muted-foreground">{application.favoriteMovieGenre || 'No proporcionado'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Consentimiento de Privacidad</h4>
            <Badge variant={application.privacyConsent ? 'default' : 'outline'} className="mt-1">
              {application.privacyConsent ? 'Consentido' : 'No consentido'}
            </Badge>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Paso Actual:</span>
          <Badge variant="outline">
            {application.onboardingStep || 'No iniciado'}
          </Badge>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {stepsApplication.map((step) => {
          const status = getStepStatus(step.key, step.fields);
          return (
            <AccordionItem key={step.key} value={step.key}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  {getStatusIcon(status)}
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(status)} className="ml-auto">
                    {status === 'completed' ? 'Completado' : status === 'current' ? 'Actual' : 'Pendiente'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4">
                  {step.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
} 