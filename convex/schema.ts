import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		name: v.optional(v.string()),
		username:v.string(),
		email: v.string(),
		image: v.string(),
		tokenIdentifier: v.string(),
		admin: v.boolean(),
	}).index("by_tokenIdentifier", ["tokenIdentifier"]),
	courses: defineTable({
		course: v.string(),
		unit: v.number()
	}),
	note:defineTable({
		title:v.string(),
		courseCode:v.string(),
		imageUrl:v.array(v.string())
	}),
	assignment:defineTable({
		courseCode:v.string(),
		question:v.array(v.string())
	}),
	announcement:defineTable({
		attachment:v.union(v.string(), v.null()),
		description:v.optional(v.string()),
		courseCode:v.optional(v.string()),
		venue:v.optional(v.string()),
		title:v.optional(v.string())
	}),
	shop:defineTable({
		course:v.string(),
		price:v.number(),
		url:v.string(),
		name:v.string(),
		deadline:v.string()
	})
});
