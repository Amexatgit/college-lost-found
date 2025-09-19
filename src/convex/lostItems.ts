import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all active lost items for students
export const getActiveLostItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("lostItems")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .collect();

    // Get uploader info for each item
    const itemsWithUploader = await Promise.all(
      items.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        return {
          ...item,
          uploaderName: uploader?.name || "Unknown",
        };
      })
    );

    return itemsWithUploader;
  },
});

// Get collected items history
export const getCollectedItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("lostItems")
      .withIndex("by_status", (q) => q.eq("status", "collected"))
      .order("desc")
      .collect();

    // Get uploader info for each item
    const itemsWithUploader = await Promise.all(
      items.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        return {
          ...item,
          uploaderName: uploader?.name || "Unknown",
        };
      })
    );

    return itemsWithUploader;
  },
});

// Get archived items
export const getArchivedItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("lostItems")
      .withIndex("by_status", (q) => q.eq("status", "archived"))
      .order("desc")
      .collect();

    // Get uploader info for each item
    const itemsWithUploader = await Promise.all(
      items.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        return {
          ...item,
          uploaderName: uploader?.name || "Unknown",
        };
      })
    );

    return itemsWithUploader;
  },
});

// Add new lost item (admin only)
export const addLostItem = mutation({
  args: {
    description: v.string(),
    foundLocation: v.string(),
    collectLocation: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      throw new Error("Only teachers can add lost items");
    }

    let imageUrl: string | undefined;
    if (args.imageStorageId) {
      const url = await ctx.storage.getUrl(args.imageStorageId);
      imageUrl = url || undefined;
    }

    const itemId = await ctx.db.insert("lostItems", {
      description: args.description,
      foundLocation: args.foundLocation,
      collectLocation: args.collectLocation,
      imageStorageId: args.imageStorageId,
      imageUrl,
      status: "active",
      uploadedBy: user._id,
    });

    return itemId;
  },
});

// Mark item as collected (admin only)
export const markAsCollected = mutation({
  args: {
    itemId: v.id("lostItems"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      throw new Error("Only teachers can mark items as collected");
    }

    await ctx.db.patch(args.itemId, {
      status: "collected",
      collectedAt: Date.now(),
    });
  },
});

// Get items uploaded by current teacher
export const getMyLostItems = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "teacher") {
      return [];
    }

    const items = await ctx.db
      .query("lostItems")
      .withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", user._id))
      .order("desc")
      .collect();

    return items;
  },
});

// Get monthly statistics
export const getMonthlyStats = query({
  args: {},
  handler: async (ctx) => {
    const allItems = await ctx.db.query("lostItems").collect();
    
    const monthlyData: Record<string, number> = {};
    
    allItems.forEach((item) => {
      const date = new Date(item._creationTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },
});