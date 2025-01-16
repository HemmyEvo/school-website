import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChat = mutation({
    args:{
    participants: v.array(v.id("users")),
    },
    handler: async(ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) throw new ConvexError("Unauthorized");
        const existingChat = await ctx.db
        .query("conversation")
        .filter(q => 
            q.or(
                q.eq(q.field("participant"), args.participants),
                q.eq(q.field("participant"), args.participants.reverse())
            )
        )
        .first()

        if(existingChat){
            return existingChat._id
        }
        const chatsId = await ctx.db.insert("conversation",{
            participant: args.participants,
        })
        return chatsId
    }
})

export const getChat = query({
    args:{},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) throw new ConvexError("Unauthorized");
        const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique()
        if(!user) throw new ConvexError("User not found")
        const chats = await ctx.db.query("conversation").collect()
        const myChat = chats.filter((chat) => {
            return chat.participant.includes(user._id)
        });
        const chatWithDetails = await Promise.all(
            myChat.map(async (chat) => {
                let userDetails = {}
                
                    const otherUserId = chat.participant.find(id => id !== user._id)
                    const userProfile = await ctx.db
                    .query("users")
                    .filter(q => q.eq(q.field("_id"), otherUserId))
                    .take(1)
                userDetails = userProfile[0]
                
                const lastMessage = await ctx.db
                .query("message")
                .filter((q) => q.eq(q.field("conversation"), chat._id))
                .order("desc")
                .take(1)

                return{
                    ...userDetails,
                    ...chat,
                    lastMessage: lastMessage[0] || null,
                }
            })
        )
        return chatWithDetails
    }
})
export const generateUploadUrl = mutation(async (ctx)=>{
    return await ctx.storage.generateUploadUrl()
})