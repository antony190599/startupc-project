'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, Clock, ExternalLink, Video, Users, Target, Lightbulb, FileText, Shield } from 'lucide-react';

import { ApplicationStepsProps } from './types';

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
  const steps = [
    {
      key: 'program-selection',
      title: 'Program Selection',
      icon: <Target className="h-4 w-4" />,
      fields: ['programType'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Selected Program</h4>
              <Badge variant="outline" className="mt-1">
                {application.programType || 'Not selected'}
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'general-data',
      title: 'General Data',
      icon: <FileText className="h-4 w-4" />,
      fields: ['projectName', 'website', 'category', 'industry', 'description', 'ruc', 'foundingYear'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Project Name</h4>
              <p className="text-sm text-muted-foreground">{application.projectName || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">Website</h4>
              {application.website ? (
                <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  {application.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Not provided</p>
              )}
            </div>
            <div>
              <h4 className="font-medium">Category</h4>
              <p className="text-sm text-muted-foreground">{application.category || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">Industry</h4>
              <p className="text-sm text-muted-foreground">{application.industry || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">RUC</h4>
              <p className="text-sm text-muted-foreground">{application.ruc || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">Founding Year</h4>
              <p className="text-sm text-muted-foreground">{application.foundingYear || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.description || 'Not provided'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'impact-origin',
      title: 'Impact & Origin',
      icon: <Lightbulb className="h-4 w-4" />,
      fields: ['opportunityValue', 'stage', 'projectOrigin', 'problem', 'customerProfile', 'impact'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Opportunity Value</h4>
              <p className="text-sm text-muted-foreground">{application.opportunityValue || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">Stage</h4>
              <p className="text-sm text-muted-foreground">{application.stage || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">Project Origin</h4>
              <p className="text-sm text-muted-foreground">{application.projectOrigin || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Problem Statement</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.problem || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium">Customer Profile</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.customerProfile || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-medium">Impact</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.impact || 'Not provided'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'presentation',
      title: 'Presentation',
      icon: <Video className="h-4 w-4" />,
      fields: ['videoUrl', 'videoFileName', 'specificSupport'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Video URL</h4>
              {application.videoUrl ? (
                <a href={application.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Watch Video
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Not provided</p>
              )}
            </div>
            <div>
              <h4 className="font-medium">Video File</h4>
              <p className="text-sm text-muted-foreground">{application.videoFileName || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Specific Support Needed</h4>
            <p className="text-sm text-muted-foreground mt-1">{application.specificSupport || 'Not provided'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'team',
      title: 'Team Information',
      icon: <Users className="h-4 w-4" />,
      fields: ['howMet', 'source'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">How Team Met</h4>
              <p className="text-sm text-muted-foreground">{application.howMet || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">Source</h4>
              <p className="text-sm text-muted-foreground">{application.source || 'Not provided'}</p>
            </div>
          </div>
          
          {/* Team Members */}
          <div>
            <h4 className="font-medium mb-3">Team Members</h4>
            {application.teamMembers && application.teamMembers.length > 0 ? (
              <div className="space-y-3">
                {application.teamMembers.map((member: any, index: number) => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{member.firstName} {member.lastName}</h5>
                        <p className="text-sm text-muted-foreground">{member.contactEmail}</p>
                        <p className="text-sm text-muted-foreground">{member.career} • {member.university}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{member.phone}</p>
                        {member.linkedin && (
                          <a href={`https://linkedin.com/in/${member.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No team members added</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'preferences',
      title: 'Personal Preferences',
      icon: <Shield className="h-4 w-4" />,
      fields: ['favoriteSport', 'favoriteHobby', 'favoriteMovieGenre', 'privacyConsent'],
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium">Favorite Sport</h4>
              <p className="text-sm text-muted-foreground">{application.favoriteSport || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">Favorite Hobby</h4>
              <p className="text-sm text-muted-foreground">{application.favoriteHobby || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium">Favorite Movie Genre</h4>
              <p className="text-sm text-muted-foreground">{application.favoriteMovieGenre || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Privacy Consent</h4>
            <Badge variant={application.privacyConsent ? 'default' : 'outline'} className="mt-1">
              {application.privacyConsent ? 'Consented' : 'Not consented'}
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
          <span className="text-sm text-muted-foreground">Current Step:</span>
          <Badge variant="outline">
            {application.onboardingStep || 'Not started'}
          </Badge>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {steps.map((step) => {
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
                    {status === 'completed' ? 'Completed' : status === 'current' ? 'Current' : 'Pending'}
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