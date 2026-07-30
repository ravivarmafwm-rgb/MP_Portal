import { useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
//#region src/components/dashboard/AnimatedNumber.tsx
function AnimatedNumber({ value, format = (v) => Math.round(v).toLocaleString("en-IN"), duration = 1.2, className }) {
	const ref = useRef(null);
	const inView = useInView(ref, {
		once: true,
		margin: "0px 0px -10% 0px"
	});
	const mv = useMotionValue(0);
	const display = useTransform(mv, (v) => format(v));
	useEffect(() => {
		if (!inView) return;
		const controls = animate(mv, value, {
			duration,
			ease: [
				.22,
				1,
				.36,
				1
			]
		});
		return () => controls.stop();
	}, [
		inView,
		value,
		duration,
		mv
	]);
	return /* @__PURE__ */ jsx(motion.span, {
		ref,
		className,
		children: display
	});
}
//#endregion
export { AnimatedNumber as t };
