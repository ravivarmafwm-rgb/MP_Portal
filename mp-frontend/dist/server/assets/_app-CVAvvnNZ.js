import { J as markNotificationRead, U as fetchUnreadNotificationCount, j as fetchNotifications, q as markAllNotificationsRead } from "./api-CQX857SN.js";
import { n as useAuth } from "./auth-B-xQo2jy.js";
import { n as canSeeNavSection, r as getDashboardPath } from "./roles-C9ZSVofD.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as Badge } from "./badge-D1Dupn2y.js";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { n as navSections } from "./nav-config-DTTFNxmT.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Separator } from "./separator-B3hsz7IR.js";
import { n as DialogContent, t as Dialog } from "./dialog-CzUx__WV.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Bell, Building2, Check, ChevronDown, ChevronRight, Circle, FileBadge, HardHat, HeartHandshake, Loader2, LogOut, MessageSquareWarning, Monitor, Moon, PanelLeft, Plus, Search, Settings, Sun, User, Users, X } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Command } from "cmdk";
//#region src/hooks/use-mobile.tsx
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(void 0);
	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region src/components/ui/sheet.tsx
var Sheet = SheetPrimitive.Root;
var SheetTrigger = SheetPrimitive.Trigger;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ jsxs(SheetPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
var SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
//#endregion
//#region src/components/ui/tooltip.tsx
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
//#endregion
//#region src/components/ui/sidebar.tsx
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 3600 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React.createContext(null);
function useSidebar() {
	const context = React.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
var SidebarProvider = React.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React.useState(false);
	const [_open, _setOpen] = React.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = React.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	React.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = React.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ jsx(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ jsx(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ jsx("div", {
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
				ref,
				...props,
				children
			})
		})
	});
});
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = React.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		ref,
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ jsx(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ jsxs(SheetContent, {
			"data-sidebar": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ jsxs(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		children: [/* @__PURE__ */ jsx("div", { className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)") }), /* @__PURE__ */ jsx("div", {
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ jsx("div", {
				"data-sidebar": "sidebar",
				className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
				children
			})
		})]
	});
});
Sidebar.displayName = "Sidebar";
var SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsxs(Button, {
		ref,
		"data-sidebar": "trigger",
		variant: "ghost",
		size: "icon",
		className: cn("h-7 w-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ jsx(PanelLeft, {}), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ jsx("button", {
		ref,
		"data-sidebar": "rail",
		"aria-label": "Toggle Sidebar",
		tabIndex: -1,
		onClick: toggleSidebar,
		title: "Toggle Sidebar",
		className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
		...props
	});
});
SidebarRail.displayName = "SidebarRail";
var SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("main", {
		ref,
		className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
		...props
	});
});
SidebarInset.displayName = "SidebarInset";
var SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(Input, {
		ref,
		"data-sidebar": "input",
		className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
		...props
	});
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(Separator, {
		ref,
		"data-sidebar": "separator",
		className: cn("mx-2 w-auto bg-sidebar-border", className),
		...props
	});
});
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
});
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
});
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "div", {
		ref,
		"data-sidebar": "group-label",
		className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	});
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "group-action",
		className: cn("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	"data-sidebar": "group-content",
	className: cn("w-full text-sm", className),
	...props
}));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ul", {
	ref,
	"data-sidebar": "menu",
	className: cn("flex w-full min-w-0 flex-col gap-1", className),
	...props
}));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	"data-sidebar": "menu-item",
	className: cn("group/menu-item relative", className),
	...props
}));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var SidebarMenuButton = React.forwardRef(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ jsx(Comp, {
		ref,
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ jsx(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "menu-action",
		className: cn("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
		...props
	});
});
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	"data-sidebar": "menu-badge",
	className: cn("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
	const width = React.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-sidebar": "menu-skeleton",
		className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
		...props,
		children: [showIcon && /* @__PURE__ */ jsx(Skeleton, {
			className: "size-4 rounded-md",
			"data-sidebar": "menu-skeleton-icon"
		}), /* @__PURE__ */ jsx(Skeleton, {
			className: "h-4 max-w-(--skeleton-width) flex-1",
			"data-sidebar": "menu-skeleton-text",
			style: { "--skeleton-width": width }
		})]
	});
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("ul", {
	ref,
	"data-sidebar": "menu-sub",
	className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", {
	ref,
	...props
}));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "a", {
		ref,
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": isActive,
		className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
//#endregion
//#region src/components/ui/collapsible.tsx
var Collapsible = CollapsiblePrimitive.Root;
var CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
var CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
//#endregion
//#region src/components/layout/AppSidebar.tsx
function AppSidebar() {
	const { state } = useSidebar();
	const collapsed = state === "collapsed";
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user } = useAuth();
	const roleSlug = user?.role_slug ?? "";
	const dashboardPath = getDashboardPath(roleSlug);
	const filteredSections = navSections.filter((section) => canSeeNavSection(roleSlug, section.title)).map((section) => section.title === "Dashboard" ? {
		...section,
		url: dashboardPath
	} : section);
	const isActive = (url) => pathname === url || pathname.startsWith(url + "/");
	return /* @__PURE__ */ jsxs(Sidebar, {
		collapsible: "icon",
		className: "border-r-0",
		children: [
			/* @__PURE__ */ jsx(SidebarHeader, {
				className: "border-b border-sidebar-border/60",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5 px-1.5 py-1",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm",
						children: /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5" })
					}), !collapsed && /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 leading-tight",
						children: [/* @__PURE__ */ jsx("div", {
							className: "truncate font-display text-sm font-bold text-sidebar-foreground",
							children: "MP Connect"
						}), /* @__PURE__ */ jsx("div", {
							className: "truncate text-[11px] text-sidebar-foreground/60",
							children: "Constituency Platform"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx(SidebarContent, {
				className: "px-1",
				children: /* @__PURE__ */ jsxs(SidebarGroup, { children: [/* @__PURE__ */ jsx(SidebarGroupLabel, {
					className: "text-sidebar-foreground/50",
					children: "Workspace"
				}), /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: filteredSections.map((section) => {
					const Icon = section.icon;
					const active = isActive(section.url);
					if (!section.children) return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
						asChild: true,
						isActive: active,
						tooltip: section.title,
						children: /* @__PURE__ */ jsxs(Link, {
							to: section.url,
							children: [/* @__PURE__ */ jsx(Icon, {}), /* @__PURE__ */ jsx("span", { children: section.title })]
						})
					}) }, section.url);
					return /* @__PURE__ */ jsx(Collapsible, {
						defaultOpen: active,
						className: "group/collapsible",
						children: /* @__PURE__ */ jsxs(SidebarMenuItem, { children: [/* @__PURE__ */ jsx(CollapsibleTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsxs(SidebarMenuButton, {
								isActive: active,
								tooltip: section.title,
								children: [
									/* @__PURE__ */ jsx(Icon, {}),
									/* @__PURE__ */ jsx("span", { children: section.title }),
									/* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" })
								]
							})
						}), /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxs(SidebarMenuSub, { children: [/* @__PURE__ */ jsx(SidebarMenuSubItem, { children: /* @__PURE__ */ jsx(SidebarMenuSubButton, {
							asChild: true,
							isActive: pathname === section.url,
							children: /* @__PURE__ */ jsx(Link, {
								to: section.url,
								children: /* @__PURE__ */ jsx("span", { children: "Overview" })
							})
						}) }), section.children.map((child) => /* @__PURE__ */ jsx(SidebarMenuSubItem, { children: /* @__PURE__ */ jsx(SidebarMenuSubButton, {
							asChild: true,
							isActive: pathname === child.url,
							children: /* @__PURE__ */ jsx(Link, {
								to: child.url,
								children: /* @__PURE__ */ jsx("span", { children: child.title })
							})
						}) }, child.url))] }) })] })
					}, section.url);
				}) }) })] })
			}),
			/* @__PURE__ */ jsx(SidebarFooter, {
				className: "border-t border-sidebar-border/60",
				children: !collapsed ? /* @__PURE__ */ jsxs("div", {
					className: "rounded-lg bg-sidebar-accent/60 p-3 text-xs text-sidebar-foreground/80",
					children: [/* @__PURE__ */ jsx("div", {
						className: "font-semibold text-sidebar-foreground",
						children: "Lok Sabha"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-sidebar-foreground/60",
						children: "2024 — 2029 Term"
					})]
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid h-8 w-8 mx-auto place-items-center rounded-md bg-sidebar-accent/60 text-[10px] font-bold text-sidebar-foreground",
					children: "LS"
				})
			})
		]
	});
}
//#endregion
//#region src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region src/components/theme/ThemeToggle.tsx
function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsx(Button, {
			variant: "ghost",
			size: "icon",
			"aria-label": "Toggle theme",
			children: mounted && theme === "dark" ? /* @__PURE__ */ jsx(Moon, { className: "h-[1.15rem] w-[1.15rem]" }) : /* @__PURE__ */ jsx(Sun, { className: "h-[1.15rem] w-[1.15rem]" })
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		align: "end",
		children: [
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: () => setTheme("light"),
				children: [/* @__PURE__ */ jsx(Sun, { className: "mr-2 h-4 w-4" }), " Light"]
			}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: () => setTheme("dark"),
				children: [/* @__PURE__ */ jsx(Moon, { className: "mr-2 h-4 w-4" }), " Dark"]
			}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: () => setTheme("system"),
				children: [/* @__PURE__ */ jsx(Monitor, { className: "mr-2 h-4 w-4" }), " System"]
			})
		]
	})] });
}
//#endregion
//#region src/components/layout/NotificationCenter.tsx
function NotificationCenter() {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const { data: countData } = useQuery({
		queryKey: ["notifications-unread-count"],
		queryFn: fetchUnreadNotificationCount,
		refetchInterval: 6e4
	});
	const { data, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => fetchNotifications({ per_page: 20 }),
		enabled: open,
		refetchInterval: open ? 3e4 : false
	});
	const markRead = useMutation({
		mutationFn: markNotificationRead,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
		}
	});
	const markAll = useMutation({
		mutationFn: markAllNotificationsRead,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
		}
	});
	const unreadCount = countData?.count ?? 0;
	const items = data?.data ?? [];
	return /* @__PURE__ */ jsxs(Sheet, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ jsx(SheetTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "icon",
				className: "relative h-9 w-9",
				children: [/* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }), unreadCount > 0 && /* @__PURE__ */ jsx("span", {
					className: "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground",
					children: unreadCount > 9 ? "9+" : unreadCount
				})]
			})
		}), /* @__PURE__ */ jsxs(SheetContent, {
			className: "w-full sm:max-w-md",
			children: [
				/* @__PURE__ */ jsxs(SheetHeader, { children: [/* @__PURE__ */ jsx(SheetTitle, { children: "Notifications" }), /* @__PURE__ */ jsx(SheetDescription, { children: "Live updates from the constituency platform" })] }),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4 flex justify-end",
					children: /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => markAll.mutate(),
						disabled: unreadCount === 0,
						children: "Mark all read"
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-2 space-y-2 overflow-y-auto max-h-[calc(100vh-10rem)]",
					children: isLoading ? /* @__PURE__ */ jsx("div", {
						className: "flex justify-center py-8",
						children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
					}) : items.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "No notifications yet"
					}) : items.map((n, i) => /* @__PURE__ */ jsx(motion.button, {
						type: "button",
						initial: {
							opacity: 0,
							y: 4
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: i * .03 },
						onClick: () => !n.is_read && markRead.mutate(n.id),
						className: "w-full rounded-lg border border-border/60 p-3 text-left hover:bg-muted/50",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold",
									children: n.title
								}), /* @__PURE__ */ jsx("p", {
									className: "mt-0.5 text-xs text-muted-foreground line-clamp-2",
									children: n.message
								})]
							}), !n.is_read && /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: "shrink-0 text-[10px]",
								children: "New"
							})]
						})
					}, n.id))
				})
			]
		})]
	});
}
//#endregion
//#region src/components/layout/AppHeader.tsx
function AppHeader() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const handleLogout = async () => {
		await logout();
		toast.success("Signed out successfully");
		navigate({
			to: "/login",
			replace: true
		});
	};
	const initials = user?.initials ?? "MP";
	const displayName = user?.name ?? "MP User";
	const roleLabel = user?.role ?? "Staff";
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md md:px-6",
		children: [
			/* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1" }),
			/* @__PURE__ */ jsx(Separator, {
				orientation: "vertical",
				className: "h-6"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative hidden flex-1 max-w-md md:block",
				children: [
					/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
					/* @__PURE__ */ jsx(Input, {
						placeholder: "Search citizens, grievances, schemes…",
						className: "h-9 pl-9 bg-muted/40 border-transparent focus-visible:bg-background"
					}),
					/* @__PURE__ */ jsx("kbd", {
						className: "pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-flex",
						children: "⌘K"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ml-auto flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsxs(Button, {
							size: "sm",
							className: "gap-1.5 hidden sm:inline-flex",
							children: [
								/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
								/* @__PURE__ */ jsx("span", { children: "Quick Action" }),
								/* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5 opacity-70" })
							]
						})
					}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Create new" }),
							/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
							/* @__PURE__ */ jsx(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/citizens/create-profile",
									children: "Add Citizen"
								})
							}),
							/* @__PURE__ */ jsx(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/grievances/list",
									children: "Log Grievance"
								})
							}),
							/* @__PURE__ */ jsx(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/meetings/appointments",
									children: "Schedule Meeting"
								})
							}),
							/* @__PURE__ */ jsx(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/projects/dashboard",
									children: "New MPLADS Project"
								})
							}),
							/* @__PURE__ */ jsx(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/surveys/active",
									children: "Launch Survey"
								})
							})
						]
					})] }),
					/* @__PURE__ */ jsx(ThemeToggle, {}),
					/* @__PURE__ */ jsx(NotificationCenter, {}),
					/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							className: "h-9 gap-2 px-1.5",
							children: [
								/* @__PURE__ */ jsx(Avatar, {
									className: "h-7 w-7",
									children: /* @__PURE__ */ jsx(AvatarFallback, {
										className: "bg-primary text-primary-foreground text-xs font-semibold",
										children: initials
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "hidden text-left leading-tight md:block",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-xs font-semibold truncate max-w-[120px]",
										children: displayName
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-muted-foreground",
										children: roleLabel
									})]
								}),
								/* @__PURE__ */ jsx(ChevronDown, { className: "hidden h-3.5 w-3.5 text-muted-foreground md:block" })
							]
						})
					}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ jsxs(DropdownMenuLabel, { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold truncate",
								children: displayName
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs font-normal text-muted-foreground truncate",
								children: user?.email
							})] }),
							/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
							/* @__PURE__ */ jsxs(DropdownMenuItem, { children: [/* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }), "Profile"] }),
							/* @__PURE__ */ jsxs(DropdownMenuItem, { children: [/* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }), "Preferences"] }),
							/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
							/* @__PURE__ */ jsxs(DropdownMenuItem, {
								className: "text-destructive focus:text-destructive",
								onClick: handleLogout,
								children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }), "Sign out"]
							})
						]
					})] })
				]
			})
		]
	});
}
//#endregion
//#region src/components/ui/command.tsx
var Command$1 = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = Command.displayName;
var CommandDialog = ({ children, ...props }) => {
	return /* @__PURE__ */ jsx(Dialog, {
		...props,
		children: /* @__PURE__ */ jsx(DialogContent, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ jsx(Command$1, {
				className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
				children
			})
		})
	});
};
var CommandInput = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ jsx(Command.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = Command.Input.displayName;
var CommandList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = Command.List.displayName;
var CommandEmpty = React.forwardRef((props, ref) => /* @__PURE__ */ jsx(Command.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = Command.Empty.displayName;
var CommandGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = Command.Group.displayName;
var CommandSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = Command.Separator.displayName;
var CommandItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = Command.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
//#endregion
//#region src/components/layout/CommandPalette.tsx
var quickRecords = [
	{
		label: "Search citizens",
		icon: Users,
		to: "/citizens/list"
	},
	{
		label: "Search volunteers",
		icon: HeartHandshake,
		to: "/volunteers/list"
	},
	{
		label: "Search projects",
		icon: HardHat,
		to: "/projects/mplads"
	},
	{
		label: "Search grievances",
		icon: MessageSquareWarning,
		to: "/grievances/open"
	},
	{
		label: "Search schemes",
		icon: FileBadge,
		to: "/schemes/applications"
	}
];
var quickActions = [
	{
		label: "Add new citizen",
		to: "/citizens/list"
	},
	{
		label: "Log new grievance",
		to: "/grievances/open"
	},
	{
		label: "Schedule appointment",
		to: "/meetings/appointments"
	},
	{
		label: "Launch survey",
		to: "/surveys/active"
	}
];
function CommandPalette() {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		const onKey = (e) => {
			if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const go = (to) => {
		setOpen(false);
		navigate({ to });
	};
	return /* @__PURE__ */ jsxs(CommandDialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ jsx(CommandInput, { placeholder: "Search records, jump to a page, or run an action…" }), /* @__PURE__ */ jsxs(CommandList, { children: [
			/* @__PURE__ */ jsx(CommandEmpty, { children: "No results found." }),
			/* @__PURE__ */ jsx(CommandGroup, {
				heading: "Quick search",
				children: quickRecords.map((r) => /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => go(r.to),
					children: [/* @__PURE__ */ jsx(r.icon, { className: "mr-2 h-4 w-4" }), r.label]
				}, r.label))
			}),
			/* @__PURE__ */ jsx(CommandSeparator, {}),
			/* @__PURE__ */ jsx(CommandGroup, {
				heading: "Quick actions",
				children: quickActions.map((a) => /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => go(a.to),
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), a.label]
				}, a.label))
			}),
			/* @__PURE__ */ jsx(CommandSeparator, {}),
			/* @__PURE__ */ jsxs(CommandGroup, {
				heading: "Navigate",
				children: [navSections.map((s) => /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => go(s.url),
					children: [
						/* @__PURE__ */ jsx(s.icon, { className: "mr-2 h-4 w-4" }),
						s.title,
						/* @__PURE__ */ jsx(CommandShortcut, { children: "↵" })
					]
				}, s.url)), /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => go("/settings"),
					children: [/* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }), " Settings"]
				})]
			})
		] })]
	});
}
//#endregion
//#region src/components/auth/ProtectedRoute.tsx
/**
* Blocks rendering until auth is resolved; redirects unauthenticated users to login.
*/
function ProtectedRoute({ children, fallback = "/login" }) {
	const { isAuthenticated, isLoading } = useAuth();
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Validating session…"
			})]
		})
	});
	if (!isAuthenticated) return /* @__PURE__ */ jsx(Navigate, {
		to: fallback,
		replace: true
	});
	return /* @__PURE__ */ jsx(Fragment, { children });
}
//#endregion
//#region src/routes/_app.tsx?tsr-split=component
function AppLayout() {
	return /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxs(SidebarProvider, { children: [/* @__PURE__ */ jsx(AppSidebar, {}), /* @__PURE__ */ jsxs(SidebarInset, {
		className: "bg-muted/30",
		children: [
			/* @__PURE__ */ jsx(AppHeader, {}),
			/* @__PURE__ */ jsx(CommandPalette, {}),
			/* @__PURE__ */ jsx("main", {
				className: "min-h-[calc(100dvh-4rem)]",
				children: /* @__PURE__ */ jsx(Outlet, {})
			})
		]
	})] }) });
}
//#endregion
export { AppLayout as component };
