import { ConvexError, v } from "convex/values";
import { internalMutation, query} from "./_generated/server";

export const createUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		email: v.string(),
		username: v.string(),
		name: v.string(),
		image: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("users", {
			tokenIdentifier: args.tokenIdentifier,
			email: args.email,
			username: args.username,
			name: args.name,
			image: args.image,
			admin: false
		});
	},
});
export const getMe = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();
			console.log(identity.tokenIdentifier)

		if (!user) {
			throw new ConvexError("User not found");
		}

		return user;
	},
});

