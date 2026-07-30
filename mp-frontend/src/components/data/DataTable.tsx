import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: keyof T & string;
  header: string;
  className?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = "Search…",
  bulkActions,
  emptyState,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  bulkActions?: {
    label: string;
    onClick: (ids: (string | number)[]) => void;
  }[];
  emptyState?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(columns.map((c) => [c.key, true])),
  );
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = data;
    if (q) {
      rows = rows.filter((r) =>
        columns.some((c) =>
          String((r as Record<string, unknown>)[c.key] ?? "")
            .toLowerCase()
            .includes(q),
        ),
      );
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey];
        const bv = (b as Record<string, unknown>)[sortKey];
        const c = String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
          numeric: true,
        });
        return sortDir === "asc" ? c : -c;
      });
    }
    return rows;
  }, [data, query, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const allChecked =
    pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allChecked) pageRows.forEach((r) => next.delete(r.id));
      else pageRows.forEach((r) => next.add(r.id));
      return next;
    });
  }

  function exportCsv() {
    const visibleCols = columns.filter((c) => visible[c.key]);
    const header = visibleCols.map((c) => c.header).join(",");
    const rows = filtered.map((r) =>
      visibleCols
        .map((c) => JSON.stringify((r as Record<string, unknown>)[c.key] ?? ""))
        .join(","),
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="overflow-hidden shadow-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-muted/30 p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="h-9 pl-9 bg-background"
          />
        </div>

        {selected.size > 0 && bulkActions && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1">
            <Badge variant="secondary">{selected.size} selected</Badge>
            {bulkActions.map((b) => (
              <Button
                key={b.label}
                variant="ghost"
                size="sm"
                onClick={() => b.onClick([...selected])}
              >
                {b.label}
              </Button>
            ))}
          </div>
        )}

        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="h-4 w-4" /> Filters
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Columns3 className="h-4 w-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((c) => (
              <DropdownMenuCheckboxItem
                key={c.key}
                checked={visible[c.key]}
                onCheckedChange={(v) =>
                  setVisible((s) => ({ ...s, [c.key]: !!v }))
                }
              >
                {c.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={exportCsv}
        >
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="View options"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 hover:bg-muted/20">
              {bulkActions && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns
                .filter((c) => visible[c.key])
                .map((c) => (
                  <TableHead
                    key={c.key}
                    className={cn("whitespace-nowrap", c.className)}
                  >
                    {c.sortable ? (
                      <button
                        onClick={() => toggleSort(c.key)}
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        {c.header}
                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                      </button>
                    ) : (
                      c.header
                    )}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.filter((c) => visible[c.key]).length +
                    (bulkActions ? 1 : 0)
                  }
                  className="p-0"
                >
                  <div className="p-10">
                    {emptyState ?? (
                      <p className="text-center text-sm text-muted-foreground">
                        No records.
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="border-b border-border/60 transition-colors hover:bg-muted/40"
                >
                  {bulkActions && (
                    <TableCell className="w-10">
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={(v) =>
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (v) next.add(row.id);
                            else next.delete(row.id);
                            return next;
                          })
                        }
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {columns
                    .filter((c) => visible[c.key])
                    .map((c) => (
                      <TableCell key={c.key} className={c.className}>
                        {c.render
                          ? c.render(row)
                          : String(
                              (row as Record<string, unknown>)[c.key] ?? "",
                            )}
                      </TableCell>
                    ))}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-border/70 bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 tabular-nums">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
