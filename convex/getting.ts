import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";


export const getNotes = query({
    args: {},
    async handler(ctx) {
        return await ctx.db.query("note").order("desc").collect();
    }
});

export const getCourses = query({
    args: {},
    async handler(ctx) {
        return await ctx.db.query("courses").order("desc").collect();
    }
});

export const getAssignments = query({
    args: {},
    async handler(ctx) {
        return await ctx.db.query("assignment").order("desc").collect();
    }
});

export const getAnnouncements = query({
    args: {},
    async handler(ctx) {
        return await ctx.db.query("announcement").order("desc").collect();
    }
});

export const getShopItems = query({
    args: {
        courseCode: v.string()
    },
    async handler(ctx, args) {
        return await ctx.db.query("shop")
            .filter(q => q.eq(q.field("course"), args.courseCode))
            .collect();
    }
});
