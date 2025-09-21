'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Grid } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";

interface DataItem {
  id: number;
  name: string;
  value: number;
  status: string;
}

const data: DataItem[] = [
  { id: 1, name: 'Project A', value: 1000, status: 'Active' },
  { id: 2, name: 'Project B', value: 2000, status: 'Pending' },
  { id: 3, name: 'Project C', value: 1500, status: 'Completed' },
];

const columns: ColumnDef<DataItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

export default function ResponsiveTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">TanStack Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Grid.js Table</h2>
        <Grid
          data={[
            ['ID', 'Name', 'Value', 'Status'],
            [1, 'Project A', 1000, 'Active'],
            [2, 'Project B', 2000, 'Pending'],
            [3, 'Project C', 1500, 'Completed'],
          ]}
          columns={['ID', 'Name', 'Value', 'Status']}
          search={true}
          sort={true}
        />
      </div>
    </div>
  );
}