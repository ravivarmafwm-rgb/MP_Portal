import { D as fetchLocVillages, E as fetchLocPollingBooths, O as fetchLocWards, T as fetchLocMandals, Z as uploadDocument, b as fetchFamilies, c as createCitizen } from "./api-CQX857SN.js";
import { n as useAuth } from "./auth-B-xQo2jy.js";
import { t as Button } from "./button-Bq5vK6RO.js";
import { t as RoleGuard } from "./RoleGuard-CJSqkr6i.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as PageHeader } from "./PageHeader-B7gZRr0G.js";
import { t as Input } from "./input-B8Q2ztVi.js";
import { t as Label } from "./label-DBD1bRRP.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.js";
import { t as Separator } from "./separator-B3hsz7IR.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//#region src/routes/_app.citizens.create-profile.tsx?tsr-split=component
var schema = z.object({
	first_name: z.string().min(1, "First name required"),
	last_name: z.string().min(1, "Last name required"),
	middle_name: z.string().optional(),
	date_of_birth: z.string().min(1, "Date of birth required"),
	gender: z.enum([
		"Male",
		"Female",
		"Other"
	]),
	mobile_number: z.string().min(10, "Valid mobile required"),
	aadhaar_number: z.string().optional(),
	voter_id: z.string().optional(),
	occupation: z.string().optional(),
	education: z.string().optional(),
	father_name: z.string().optional(),
	blood_group: z.string().optional(),
	house_number: z.string().optional(),
	street: z.string().optional(),
	pincode: z.string().optional(),
	district: z.string().optional(),
	state: z.string().optional()
});
function CreateCitizenPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [mandalId, setMandalId] = useState("");
	const [villageId, setVillageId] = useState("");
	const [wardId, setWardId] = useState("");
	const [boothId, setBoothId] = useState("");
	const [familyId, setFamilyId] = useState("");
	const [aadhaarFile, setAadhaarFile] = useState(null);
	const [voterFile, setVoterFile] = useState(null);
	const canEnroll = user?.role_slug === "volunteer" || user?.role_slug === "super-admin";
	const { data: mandals } = useQuery({
		queryKey: ["mandals"],
		queryFn: () => fetchLocMandals()
	});
	const { data: villages } = useQuery({
		queryKey: ["villages", mandalId],
		queryFn: () => fetchLocVillages(mandalId),
		enabled: !!mandalId
	});
	const { data: wards } = useQuery({
		queryKey: ["wards", villageId],
		queryFn: () => fetchLocWards(villageId),
		enabled: !!villageId
	});
	const { data: booths } = useQuery({
		queryKey: ["booths", villageId],
		queryFn: () => fetchLocPollingBooths(villageId),
		enabled: !!villageId
	});
	const { data: families } = useQuery({
		queryKey: ["families"],
		queryFn: () => fetchFamilies({ per_page: 50 })
	});
	const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			gender: "Male",
			state: "Telangana",
			district: "Hyderabad"
		}
	});
	const onSubmit = async (data) => {
		try {
			const result = await createCitizen({
				...data,
				village_id: villageId || void 0,
				ward_id: wardId || void 0,
				polling_booth_id: boothId || void 0,
				family_id: familyId || void 0
			});
			const uploads = [];
			if (aadhaarFile) {
				const fd = new FormData();
				fd.append("file", aadhaarFile);
				fd.append("title", "Aadhaar Card");
				fd.append("documentable_type", "citizen");
				fd.append("documentable_id", result.id);
				uploads.push(uploadDocument(fd));
			}
			if (voterFile) {
				const fd = new FormData();
				fd.append("file", voterFile);
				fd.append("title", "Voter ID");
				fd.append("documentable_type", "citizen");
				fd.append("documentable_id", result.id);
				uploads.push(uploadDocument(fd));
			}
			if (uploads.length) await Promise.all(uploads);
			toast.success(`Citizen ${result.unique_id} enrolled successfully!`);
			navigate({ to: "/citizens/list" });
		} catch (err) {
			const resp = err;
			const msg = resp?.response?.data?.errors ? Object.values(resp.response.data.errors).flat().join(", ") : resp?.response?.data?.message ?? "Enrollment failed.";
			toast.error(msg);
		}
	};
	if (!canEnroll) return /* @__PURE__ */ jsx(RoleGuard, {
		route: "/citizens/create-profile",
		children: /* @__PURE__ */ jsx("div", {})
	});
	return /* @__PURE__ */ jsxs(RoleGuard, {
		route: "/citizens/create-profile",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			title: "Enroll New Citizen",
			description: "Volunteer-only: register a new citizen into the constituency database",
			actions: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/citizens/list",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Back to List"]
				})
			})
		}), /* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				y: 8
			},
			animate: {
				opacity: 1,
				y: 0
			},
			className: "max-w-3xl p-4 md:p-8 space-y-6",
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit(onSubmit),
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-h3 font-bold mb-4",
							children: "Personal Details"
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ jsx(Label, {
											htmlFor: "first_name",
											children: "First Name *"
										}),
										/* @__PURE__ */ jsx(Input, {
											id: "first_name",
											...register("first_name"),
											placeholder: "Ravi"
										}),
										errors.first_name && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: errors.first_name.message
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ jsx(Label, {
											htmlFor: "last_name",
											children: "Last Name *"
										}),
										/* @__PURE__ */ jsx(Input, {
											id: "last_name",
											...register("last_name"),
											placeholder: "Reddy"
										}),
										errors.last_name && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: errors.last_name.message
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "middle_name",
										children: "Middle Name"
									}), /* @__PURE__ */ jsx(Input, {
										id: "middle_name",
										...register("middle_name")
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ jsx(Label, {
											htmlFor: "date_of_birth",
											children: "Date of Birth *"
										}),
										/* @__PURE__ */ jsx(Input, {
											id: "date_of_birth",
											type: "date",
											...register("date_of_birth")
										}),
										errors.date_of_birth && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: errors.date_of_birth.message
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Gender *" }), /* @__PURE__ */ jsxs(Select, {
										defaultValue: "Male",
										onValueChange: (v) => setValue("gender", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
											/* @__PURE__ */ jsx(SelectItem, {
												value: "Male",
												children: "Male"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "Female",
												children: "Female"
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "Other",
												children: "Other"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ jsx(Label, {
											htmlFor: "mobile_number",
											children: "Mobile Number *"
										}),
										/* @__PURE__ */ jsx(Input, {
											id: "mobile_number",
											...register("mobile_number"),
											placeholder: "9876543210"
										}),
										errors.mobile_number && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: errors.mobile_number.message
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "occupation",
										children: "Occupation"
									}), /* @__PURE__ */ jsx(Input, {
										id: "occupation",
										...register("occupation")
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "education",
										children: "Education"
									}), /* @__PURE__ */ jsx(Input, {
										id: "education",
										...register("education")
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "father_name",
										children: "Father's Name"
									}), /* @__PURE__ */ jsx(Input, {
										id: "father_name",
										...register("father_name")
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-h3 font-bold mb-4",
							children: "Identity Documents"
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "aadhaar_number",
										children: "Aadhaar Number"
									}), /* @__PURE__ */ jsx(Input, {
										id: "aadhaar_number",
										...register("aadhaar_number"),
										placeholder: "XXXX-XXXX-XXXX"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "voter_id",
										children: "Voter ID"
									}), /* @__PURE__ */ jsx(Input, {
										id: "voter_id",
										...register("voter_id"),
										placeholder: "AP1234567"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Aadhaar Upload" }), /* @__PURE__ */ jsx(Input, {
										type: "file",
										accept: ".pdf,.jpg,.jpeg,.png",
										onChange: (e) => setAadhaarFile(e.target.files?.[0] ?? null)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Voter ID Upload" }), /* @__PURE__ */ jsx(Input, {
										type: "file",
										accept: ".pdf,.jpg,.jpeg,.png",
										onChange: (e) => setVoterFile(e.target.files?.[0] ?? null)
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-h3 font-bold mb-4",
							children: "Location & Address"
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Mandal" }), /* @__PURE__ */ jsxs(Select, {
										value: mandalId,
										onValueChange: (v) => {
											setMandalId(v);
											setVillageId("");
											setWardId("");
											setBoothId("");
										},
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select mandal" }) }), /* @__PURE__ */ jsx(SelectContent, { children: (mandals ?? []).map((m) => /* @__PURE__ */ jsx(SelectItem, {
											value: m.id,
											children: m.name
										}, m.id)) })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Village" }), /* @__PURE__ */ jsxs(Select, {
										value: villageId,
										onValueChange: (v) => {
											setVillageId(v);
											setWardId("");
											setBoothId("");
										},
										disabled: !mandalId,
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select village" }) }), /* @__PURE__ */ jsx(SelectContent, { children: (villages ?? []).map((v) => /* @__PURE__ */ jsx(SelectItem, {
											value: v.id,
											children: v.name
										}, v.id)) })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Ward" }), /* @__PURE__ */ jsxs(Select, {
										value: wardId,
										onValueChange: setWardId,
										disabled: !villageId,
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select ward" }) }), /* @__PURE__ */ jsx(SelectContent, { children: (wards ?? []).map((w) => /* @__PURE__ */ jsx(SelectItem, {
											value: w.id,
											children: w.name
										}, w.id)) })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Polling Booth" }), /* @__PURE__ */ jsxs(Select, {
										value: boothId,
										onValueChange: setBoothId,
										disabled: !villageId,
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select booth" }) }), /* @__PURE__ */ jsx(SelectContent, { children: (booths ?? []).map((b) => /* @__PURE__ */ jsx(SelectItem, {
											value: b.id,
											children: b.booth_number ? `Booth ${b.booth_number}` : b.name
										}, b.id)) })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, { children: "Link to Family" }), /* @__PURE__ */ jsxs(Select, {
										value: familyId,
										onValueChange: setFamilyId,
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Optional family" }) }), /* @__PURE__ */ jsx(SelectContent, { children: (families?.data ?? []).map((f) => /* @__PURE__ */ jsx(SelectItem, {
											value: f.id,
											children: f.head_of_family_name ?? f.family_id
										}, f.id)) })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "house_number",
										children: "House Number"
									}), /* @__PURE__ */ jsx(Input, {
										id: "house_number",
										...register("house_number")
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "street",
										children: "Street"
									}), /* @__PURE__ */ jsx(Input, {
										id: "street",
										...register("street")
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "pincode",
										children: "Pincode"
									}), /* @__PURE__ */ jsx(Input, {
										id: "pincode",
										...register("pincode"),
										placeholder: "500084"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx(Separator, {}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ jsx(Link, {
								to: "/citizens/list",
								children: "Cancel"
							})
						}), /* @__PURE__ */ jsxs(Button, {
							type: "submit",
							disabled: isSubmitting,
							className: "gap-2",
							children: [isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }), isSubmitting ? "Enrolling…" : "Enroll Citizen"]
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { CreateCitizenPage as component };
