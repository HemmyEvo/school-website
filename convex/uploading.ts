import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity){
        throw new ConvexError("User Not Found")
    }
    return await ctx.storage.generateUploadUrl()
})

export const uploadNote = mutation({
    args: {
      file: v.array(v.id("_storage")), // Array of file IDs
      title: v.string(),
      course: v.string(),
    },
    async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("Log in to upload a file");
      }
  
      // Generate URLs for each file in the array
      const fileUrls = await Promise.all(
        args.file.map(async (fileId) => {
          const url = await ctx.storage.getUrl(fileId);
          if (!url) throw new ConvexError("Failed to generate file URL");
          return url;
        })
      );
  
      // Insert note into the database with all file URLs
      await ctx.db.insert("note", {
        title: args.title,
        courseCode: args.course,
        imageUrl: fileUrls, // Store as an array of URLs
      });
    },
  })


    
    
  export const uploadShop = mutation({
    args:{
        price: v.number(),
        course: v.string(),
        url: v.string(),
        name: v.string(),
        deadline:v.string()
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity){
            throw new ConvexError("Log in to Upload a file")
        }
        await ctx.db.insert("shop", {...args})
        
    }
})


export const updateImage = mutation({
  args: {
    user:v.id("users"),
    image: v.id("_storage"), // The profile image as a storage ID
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Log in to update your profile");
    }


    
    // Retrieve the existing user profile
    const user = await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), args.user)).unique();    
    if (!user) {
      throw new ConvexError("User not found in the database");
    }
    const url = await ctx.storage.getUrl(args.image);
    // Update the user's profile
    await ctx.db
      .patch(user._id,{
          image: url!, 
      })
      
  },
});
export const uploadCourse = mutation({
    args:{
		course: v.string(),
		unit: v.number()
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity){
            throw new ConvexError("Log in to Upload a file")
        }
        await ctx.db.insert("courses", {...args})
        
    }
})
export const uploadAssignment = mutation({
    args:{
        courseCode:v.string(),
		question:v.array(v.string())
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity){
            throw new ConvexError("Log in to Upload a file")
        }
        await ctx.db.insert("assignment", {...args})
        
    }
})
export const uploadAnnouncement = mutation({
    args:{
        attachment: v.optional(v.id("_storage")),
        description: v.optional(v.string()),
        course: v.optional(v.string()),
        venue: v.optional(v.string()),
        title: v.optional(v.string())
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity){
            throw new ConvexError("Log in to Upload a file")
        }
        let url = null;
        if (args.attachment) {
            url = await ctx.storage.getUrl(args.attachment);
            if (!url) throw new ConvexError("Failed to generate file URL");
        }
        await ctx.db.insert("announcement", {
        attachment: url!,
        description: args.description,
        courseCode: args.course,
        title: args.title,
        venue: args.venue
    })
        
    }
})

export const deleteNote = mutation({
    args: {
      noteId: v.string(), // The ID of the note to delete
    },
    async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("Log in to delete a note");
      }
      const note = await ctx.db
      .query("note")
      .filter((q) => q.eq(q.field("_id"), args.noteId))
      .unique();

      // Delete the note from the database
      await ctx.db.delete(note!._id);
    },
  });
  
export const deleteAssignment = mutation({
    args: {
      noteId: v.string(), // The ID of the note to delete
    },
    async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("Log in to delete a note");
      }
      const note = await ctx.db
      .query("assignment")
      .filter((q) => q.eq(q.field("_id"), args.noteId))
      .unique();

      // Delete the note from the database
      await ctx.db.delete(note!._id);
    },
  });
  
export const deleteAnnouncement = mutation({
    args: {
      noteId: v.string(), // The ID of the note to delete
    },
    async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("Log in to delete a note");
      }
      const note = await ctx.db
      .query("announcement")
      .filter((q) => q.eq(q.field("_id"), args.noteId))
      .unique();

      // Delete the note from the database
      await ctx.db.delete(note!._id);
    },
  });
  
export const deleteCourse = mutation({
    args: {
      noteId: v.string(), // The ID of the note to delete
    },
    async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("Log in to delete a note");
      }
      const note = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("_id"), args.noteId))
      .unique();

      // Delete the note from the database
      await ctx.db.delete(note!._id);
    },
  });
export const deleteShop = mutation({
    args: {
      noteId: v.string(), // The ID of the note to delete
    },
    async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("Log in to delete a note");
      }
      const note = await ctx.db
      .query("shop")
      .filter((q) => q.eq(q.field("_id"), args.noteId))
      .unique();

      // Delete the note from the database
      await ctx.db.delete(note!._id);
    },
  });
  

