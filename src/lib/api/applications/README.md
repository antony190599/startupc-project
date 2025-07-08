# Applications API

This module provides comprehensive API functionality for managing project applications in the StartupC platform.

## API Endpoints

### Get All Applications
```
GET /api/applications
```

**Query Parameters:**
- `sortBy`: Field to sort by (createdAt, updatedAt, projectName, programType, category, industry, stage, projectStatus, isCompleted)
- `sortOrder`: Sort order (asc, desc)
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10, max: 100)
- `search`: Search term for project name, description, team members, etc.
- `projectApplicationId`: Filter by specific application ID
- `programType`: Filter by program type
- `category`: Filter by category
- `industry`: Filter by industry
- `stage`: Filter by stage
- `projectStatus`: Filter by project status
- `isCompleted`: Filter by completion status

**Example:**
```typescript
const response = await fetch('/api/applications?page=1&pageSize=10&sortBy=createdAt&sortOrder=desc');
const data = await response.json();
```

### Get Application by ID
```
GET /api/applications/[id]
```

**Example:**
```typescript
const response = await fetch('/api/applications/clx1234567890abcdef');
const data = await response.json();

// Response structure:
{
  success: true,
  data: {
    id: "clx1234567890abcdef",
    projectName: "My Startup Project",
    programType: "inqubalab",
    category: "tech",
    industry: "biotecnologia",
    stage: "mvp",
    projectStatus: "pending",
    isCompleted: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    completedAt: null,
    teamSize: 3,
    primaryUser: {
      id: "user123",
      email: "founder@startup.com",
      firstname: "John",
      lastname: "Doe"
    },
    teamMembers: [...],
    users: [...],
    statusHistory: [...],
    description: "Project description...",
    website: "https://startup.com",
    // ... all other application fields
  }
}
```

### Update Application
```
PUT /api/applications/[id]
```

**Example:**
```typescript
const response = await fetch('/api/applications/clx1234567890abcdef', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    projectStatus: 'approved',
    isCompleted: true,
    completedAt: new Date().toISOString(),
  }),
});

const data = await response.json();
```

### Delete Application
```
DELETE /api/applications/[id]
```

**Example:**
```typescript
const response = await fetch('/api/applications/clx1234567890abcdef', {
  method: 'DELETE',
});

const data = await response.json();
```

## Data Transformers

### `transformApplication`
Transforms a basic application query result into a standardized format for list views.

### `transformApplicationDetail`
Transforms an application with full relations into a detailed format including:
- All application fields
- Team members information
- User information
- Status history
- Extended metadata

## Error Handling

All endpoints return consistent error responses:

```typescript
// Success Response
{
  success: true,
  data: ApplicationData,
  message?: string
}

// Error Response
{
  error: string
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (missing ID, invalid parameters)
- `401`: Unauthorized (no valid session)
- `404`: Not Found (application doesn't exist)
- `500`: Internal Server Error

## Authentication

All endpoints require a valid user session. The API checks for:
- Valid session token
- User email in session
- Proper authentication headers

## Usage Examples

### Frontend Component Example
```typescript
import { useState, useEffect } from 'react';

function ApplicationDetail({ applicationId }: { applicationId: string }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        const data = await response.json();
        
        if (data.success) {
          setApplication(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch application');
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [applicationId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!application) return <div>Application not found</div>;

  return (
    <div>
      <h1>{application.projectName}</h1>
      <p>Status: {application.projectStatus}</p>
      <p>Team Size: {application.teamSize}</p>
      {/* Render other application details */}
    </div>
  );
}
```

### Update Application Status
```typescript
async function updateApplicationStatus(applicationId: string, newStatus: string) {
  try {
    const response = await fetch(`/api/applications/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectStatus: newStatus,
        updatedAt: new Date().toISOString(),
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Application updated successfully');
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Failed to update application:', error);
    throw error;
  }
}
``` 