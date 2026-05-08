import { Skeleton } from "@/components/ui/skeleton";
import  { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";

export function SkeletonTable({ rows = 10 }: { rows?: number }) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-8 w-44" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: rows }).map((_, r) => (
                  <TableRow key={r}>
                    {Array.from({ length: 7 }).map((__, c) => (
                      <TableCell key={c}>
                        <Skeleton className="h-4 w-[min(180px,40vw)]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden p-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-56" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }