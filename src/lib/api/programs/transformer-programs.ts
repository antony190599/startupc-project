import { Program, ProgramStatusLog } from '@prisma/client';

export interface ProgramWithRelations extends Program {
  programStatusLogs: ProgramStatusLog[];
}

export interface ProgramQueryResult extends Program {
  programStatusLogs: Array<{
    id: string;
    status: string;
    createdAt: Date;
  }>;
}

export interface TransformedProgram {
  id: string;
  name: string;
  description: string;
  programType: string;
  programStatus: string;
  year: string | null;
  cohortCode: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string | null;
  createdAt: Date;
  updatedAt: Date;
  applicationCount: number;
}

export interface TransformedProgramDetail extends TransformedProgram {
  // Additional fields for detailed view if needed
  programStatusLogs: Array<{
    id: string;
    status: string;
    createdAt: Date;
  }>;
}

export interface ProgramsResponse {
  rows: TransformedProgram[];
  summary: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function transformProgram(program: ProgramQueryResult): TransformedProgram {
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    programType: program.programType,
    programStatus: program.programStatus,
    year: program.year,
    cohortCode: program.cohortCode,
    startDate: program.startDate,
    endDate: program.endDate,
    status: program.status,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt,
    applicationCount: 0, // This will be populated by the query if needed
  };
}

export function transformProgramDetail(program: ProgramQueryResult): TransformedProgramDetail {
  const baseProgram = transformProgram(program);
  
  return {
    ...baseProgram,
    programStatusLogs: program.programStatusLogs.map(log => ({
      id: log.id,
      status: log.status,
      createdAt: log.createdAt,
    })),
  };
}

export function transformProgramsResponse(
  programs: ProgramQueryResult[],
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  }
): ProgramsResponse {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  
  return {
    rows: programs.map(transformProgram),
    summary: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
} 