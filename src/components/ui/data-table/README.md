# Reusable DataTable System

This directory contains a comprehensive, reusable DataTable system that can be used across the application for displaying tabular data with advanced features like pagination, filtering, sorting, and search.

## Components

### Core Components

- **`DataTable`** - Main table component with all functionality
- **`DataTableToolbar`** - Toolbar with search, filters, and view options
- **`DataTablePagination`** - Pagination controls
- **`DataTableFacetedFilter`** - Multi-select filter dropdown
- **`DataTableViewOptions`** - Column visibility toggle
- **`DataTableSkeleton`** - Loading skeleton component

## Usage

### Basic Usage

```tsx
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

function MyPage() {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={pagination}
      onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))}
      onSearch={setSearchValue}
      searchValue={searchValue}
      loading={loading}
      emptyMessage="No se encontraron resultados."
    />
  )
}
```

### Custom Toolbar

```tsx
import { DataTable, DataTableToolbar, DataTableFacetedFilter, DataTableViewOptions } from "@/components/ui/data-table"

function MyPage() {
  // Custom toolbar component
  const CustomToolbar = ({ table, onSearch, searchValue }) => {
    return (
      <DataTableToolbar
        table={table}
        onSearch={onSearch}
        searchValue={searchValue}
        searchPlaceholder="Buscar..."
        filters={
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={[
              { label: "Activo", value: "active" },
              { label: "Inactivo", value: "inactive" },
            ]}
          />
        }
        viewOptions={
          <DataTableViewOptions
            table={table}
            columnLabels={{
              name: "Nombre",
              email: "Email",
              status: "Estado",
            }}
          />
        }
      />
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onSearch={handleSearch}
      searchValue={searchValue}
      loading={loading}
      toolbar={CustomToolbar}
    />
  )
}
```

### Custom Skeleton

```tsx
import { DataTableSkeleton } from "@/components/ui/data-table"

function CustomSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 bg-muted animate-pulse rounded" />
      <DataTableSkeleton columnCount={5} rowCount={10} />
    </div>
  )
}

// Use in DataTable
<DataTable
  // ... other props
  skeleton={CustomSkeleton}
/>
```

## Props

### DataTable Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `ColumnDef[]` | Table column definitions |
| `data` | `TData[]` | Table data |
| `pagination` | `PaginationObject` | Pagination state |
| `onPageChange` | `(page: number) => void` | Page change handler |
| `onPageSizeChange` | `(pageSize: number) => void` | Page size change handler |
| `onSearch` | `(value: string) => void` | Search handler |
| `searchValue` | `string` | Current search value |
| `loading` | `boolean` | Loading state |
| `emptyMessage` | `string` | Message when no data |
| `toolbar` | `Component` | Custom toolbar component |
| `paginationComponent` | `Component` | Custom pagination component |
| `skeleton` | `Component` | Custom skeleton component |

### DataTableToolbar Props

| Prop | Type | Description |
|------|------|-------------|
| `table` | `Table` | TanStack table instance |
| `onSearch` | `(value: string) => void` | Search handler |
| `searchValue` | `string` | Current search value |
| `searchPlaceholder` | `string` | Search input placeholder |
| `filters` | `ReactNode` | Custom filter components |
| `viewOptions` | `ReactNode` | Custom view options component |

### DataTableFacetedFilter Props

| Prop | Type | Description |
|------|------|-------------|
| `column` | `Column` | Table column to filter |
| `title` | `string` | Filter title |
| `options` | `FilterOption[]` | Filter options |

## Examples

### Users Table
See `src/app/users/page-content.tsx` for a complete example with role filtering.

### Applications Table
See `src/app/applications/page-content.tsx` for a complete example with program type and status filtering.

## Features

- **Pagination**: Server-side pagination with configurable page sizes
- **Search**: Full-text search across table data
- **Filtering**: Multi-select faceted filters for specific columns
- **Sorting**: Column-based sorting (handled by TanStack Table)
- **Column Visibility**: Toggle column visibility
- **Loading States**: Customizable skeleton components
- **Responsive**: Mobile-friendly design
- **TypeScript**: Full type safety
- **Customizable**: Pluggable components for different use cases

## Best Practices

1. **Define columns properly**: Use proper accessor functions and cell renderers
2. **Handle loading states**: Always provide skeleton components for better UX
3. **Customize toolbars**: Create specific toolbars for different data types
4. **Use proper pagination**: Implement server-side pagination for large datasets
5. **Add proper error handling**: Handle API errors gracefully
6. **Optimize performance**: Use React.memo for expensive components
7. **Maintain consistency**: Use consistent styling and behavior across tables

## Migration from Page-Specific Tables

To migrate from page-specific data tables to the reusable system:

1. Replace page-specific DataTable imports with the reusable ones
2. Create custom toolbar components for specific filtering needs
3. Update skeleton components to use the reusable DataTableSkeleton
4. Remove page-specific data table files
5. Update column definitions to work with the new system

This system provides a consistent, maintainable, and feature-rich solution for displaying tabular data across the application. 