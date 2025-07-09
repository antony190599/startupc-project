'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, UserIcon, BuildingIcon, ClockIcon } from 'lucide-react';
import ApplicationSteps from './application-steps';
import { ApplicationDetailClientProps } from './types';

export default function ApplicationDetailClient({ application }: ApplicationDetailClientProps) {
  const [activeTab, setActiveTab] = useState('application');

  // Helper function to get program type badge variant
  const getProgramTypeVariant = (programType: string) => {
    switch (programType) {
      case 'inqubalab':
        return 'default';
      case 'idea-feedback':
        return 'secondary';
      case 'aceleracion':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Helper function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get primary user info - can be either team member or user
  const primaryTeamMember = application.teamMembers[0];
  const primaryUser = application.users[0];
  const displayUser = primaryTeamMember || primaryUser;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {application.projectName || 'Untitled Project'}
          </h1>
          <p className="text-muted-foreground">
            Application ID: {application.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(application.projectStatus || 'pending')}>
            {application.projectStatus || 'Pending'}
          </Badge>
          <Badge variant={getProgramTypeVariant(application.programType || 'unknown')}>
            {application.programType || 'Unknown Program'}
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Name</CardTitle>
            <BuildingIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {application.projectName || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {application.category && application.industry 
                ? `${application.category} • ${application.industry}`
                : 'No category specified'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary User</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {displayUser ? 
                    primaryTeamMember ? 
                      `${primaryTeamMember.firstName?.[0] || ''}${primaryTeamMember.lastName?.[0] || ''}`.toUpperCase()
                    : primaryUser ?
                      `${primaryUser.firstname?.[0] || ''}${primaryUser.lastname?.[0] || ''}`.toUpperCase()
                    : 'U'
                    : 'U'
                  }
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">
                  {displayUser ? 
                    primaryTeamMember ? 
                      `${primaryTeamMember.firstName} ${primaryTeamMember.lastName}`.trim() || 'Unknown User'
                    : primaryUser ?
                      `${primaryUser.firstname || ''} ${primaryUser.lastname || ''}`.trim() || 'Unknown User'
                    : 'No user assigned'
                    : 'No user assigned'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {primaryTeamMember?.contactEmail || primaryUser?.email || 'No email'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Type</CardTitle>
            <Badge variant={getProgramTypeVariant(application.programType || 'unknown')} className="h-4">
              {application.programType || 'Unknown'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {application.teamMembers?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created Date</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(application.createdAt)}
            </div>
            <p className="text-xs text-muted-foreground">
              {application.completedAt ? `Completed ${formatDate(application.completedAt)}` : 'In progress'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>
            View and manage application information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="application">Application</TabsTrigger>
            </TabsList>
            
            <TabsContent value="application" className="space-y-4">
              <ApplicationSteps application={application} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 