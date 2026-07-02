import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import { findBreadcrumb } from "./nav-config";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = findBreadcrumb(pathname);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="border-b border-border/70 bg-background"
    >
      <div className="px-4 pt-5 pb-4 md:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-foreground">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          {crumbs.map((c, i) => (
            <span key={c.url} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {i === crumbs.length - 1 ? (
                <span className="font-medium text-foreground">{c.title}</span>
              ) : (
                <Link to={c.url} className="hover:text-foreground">
                  {c.title}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>
    </motion.div>
  );
}