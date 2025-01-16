import { QueryCtx, MutationCtx } from "./_generated/server";

export const getUserByClerkId = async({ctx, clerkId} : {
    ctx: QueryCtx | MutationCtx,
    clerkId: string
}) => {
   return await ctx.db
   .query("users")
   .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", clerkId))
   .unique();
}