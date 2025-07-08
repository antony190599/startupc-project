# Applications API

This module provides a comprehensive API for fetching project applications with filtering, sorting, pagination, and search functionality.

## Features

- **Filtering**: Filter by program type, category, industry, stage, project status, and completion status
- **Search**: Full-text search across project names, descriptions, user information, and team member details
- **Sorting**: Sort by any application field in ascending or descending order
- **Pagination**: Built-in pagination with configurable page size
- **Data Transformation**: Clean, structured response format

## Usage

### Basic Usage

```typescript
import { getApplicationsOrThrow, transformApplicationsResponse } from '@/lib/api/applications';

// Fetch all applications (default: 10 per page, sorted by createdAt desc)
const result = await getApplicationsOrThrow();

// Transform the response
const response = transformApplicationsResponse(
  result.applications,
  {
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
  }
);
```

### With Filters

```typescript
// Fetch applications with filters
const result = await getApplicationsOrThrow({
  sortBy: 'projectName',
  sortOrder: 'asc',
  page: 2,
  pageSize: 20,
  search: 'tech startup',
  programType: 'aceleracion',
  category: 'tech',
  isCompleted: false,
});
```

### API Endpoint

The API endpoint supports all the same parameters as query strings:

```
GET /api/applications?sortBy=projectName&sortOrder=asc&page=1&pageSize=10&search=tech&programType=aceleracion
```

## Parameters

### Sorting
- `sortBy`: Field to sort by (createdAt, updatedAt, projectName, programType, category, industry, stage, projectStatus, isCompleted)
- `sortOrder`: Sort direction (asc, desc)

### Pagination
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10, max: 100)

### Search
- `search`: Full-text search across multiple fields

### Filters
- `projectApplicationId`: Specific application ID
- `programType`: Program type filter
- `category`: Category filter (tech, noTech)
- `industry`: Industry filter
- `stage`: Stage filter (ideaNegocio, mvp)
- `projectStatus`: Project status filter
- `isCompleted`: Completion status filter (true/false)

## Response Format

```typescript
{
  success: true,
  applications: [
    {
      id: string;
      projectName: string | null;
      programType: string | null;
      category: string | null;
      industry: string | null;
      stage: string | null;
      projectStatus: string | null;
      isCompleted: boolean;
      createdAt: Date;
      updatedAt: Date;
      completedAt: Date | null;
      teamSize: number;
      primaryUser: {
        id: string;
        email: string | null;
        firstname: string | null;
        lastname: string | null;
        role: string | null;
      } | null;
      teamMembers: Array<{
        id: string;
        firstName: string;
        lastName: string;
        contactEmail: string;
        university: string | null;
        career: string | null;
      }>;
    }
  ],
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}
```

## Error Handling

The API includes proper error handling:

- **401 Unauthorized**: Invalid or missing session
- **500 Internal Server Error**: Database or processing errors

All errors are logged for debugging purposes. 