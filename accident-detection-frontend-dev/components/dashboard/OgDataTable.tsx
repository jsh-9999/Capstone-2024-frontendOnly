"use client";
import React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from 'cookies-next';

export type AllData = {
  id: number;
  date: string;
  availableHospital: { [key: string]: string };
  sorting: string;
  accuracy: string;
};

const fetchAccidents = async () => {
  const token = getCookie("Authorization");
  const refreshToken = getCookie("Refresh");

  if (!token || !refreshToken) {
    throw new Error("No token found");
  }

  const response = await fetch("http://localhost:8080/api/hospital/accident/combination", {
    headers: {
      Authorization: `Bearer ${token}`,
      Refresh: `${refreshToken}`
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  console.log("Fetched data: ", data);
  return data.allDataList;
};

export default function OgDataTable({}: Props) {
  const {
    data: accidents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accidents"],
    queryFn: fetchAccidents,
  });

  console.log("Accidents data: ", accidents);

  const sortedAccidents = React.useMemo(() => {
    if (accidents && accidents.length > 0) {
      return [...accidents].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    return [];
  }, [accidents]);

  const columns = React.useMemo<ColumnDef<AllData, any>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: "id",
        cell: (info) => info.getValue(),
        header: () => <span>ID</span>,
        footer: () => <span>ID</span>,
      },
      {
        accessorFn: (row) => row.date,
        id: "date",
        cell: (info) => info.getValue(),
        header: () => <span>Date</span>,
        footer: () => <span>Date</span>,
      },
      {
        accessorFn: (row) => Object.entries(row.availableHospital).map(([name, tel]) => `${name}: ${tel}`).join(", "),
        id: "availableHospital",
        cell: (info) => info.getValue(),
        header: () => <span>Available Hospitals</span>,
        footer: () => <span>Available Hospitals</span>,
      },
      {
        accessorFn: (row) => row.sorting,
        id: "sorting",
        cell: (info) => info.getValue(),
        header: () => <span>Sorting</span>,
        footer: () => <span>Sorting</span>,
      },
      {
        accessorFn: (row) => row.accuracy,
        id: "accuracy",
        cell: (info) => info.getValue(),
        header: () => <span>Accuracy</span>,
        footer: () => <span>Accuracy</span>,
      },
      {
        id: "details",
        cell: (info) => (
          <Link
            href={`accident/${info.row.original.id}`}
            className="flex items-center justify-center space-x-1 text-orange-600 font-bold underline"
          >
            <span>View</span>
            <span>
              <ArrowUpRight width={20} height={20} />
            </span>
          </Link>
        ),
        header: () => <span>View Details</span>,
        footer: () => <span>View Details</span>,
      },
    ],
    []
  );
  

  const table = useReactTable({
    data: sortedAccidents || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!accidents || accidents.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="overflow-hidden">
      <h2 className="text-xl sm:text-2xl pb-5">Accident Data</h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-500">
        <table className="lg:table-fixed bg-white border-collapse overflow-hidden w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="border px-4 py-2">
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="border px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pt-3 flex space-x-5 items-center">
          <div>
            <button
              className="border border-gray-300 rounded px-5 py-2 bg-white"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              First
            </button>
            <button
              className="border border-gray-300 rounded px-5 py-2 bg-white"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border border-gray-300 rounded px-5 py-2 bg-white"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border border-gray-300 rounded px-5 py-2 bg-white"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last
            </button>
          </div>
          <div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border border-gray-300 rounded px-5 py-2 bg-white"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <p className="font-bold">Page ~ </p>
            <p>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
