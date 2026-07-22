import { t as cn } from "./utils-C_uf36nf.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
//#region src/components/ui/avatar.tsx
var Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
//#endregion
export { AvatarFallback as n, Avatar as t };
