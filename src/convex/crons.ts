import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

// Define the auto-archive function in this file since it needs to be internal
const autoArchiveOldItems = internalMutation({
  args: {},
  handler: async (ctx) => {
    const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
    
    const oldActiveItems = await ctx.db
      .query("lostItems")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.lt(q.field("_creationTime"), oneMonthAgo))
      .collect();

    for (const item of oldActiveItems) {
      await ctx.db.patch(item._id, {
        status: "archived",
        archivedAt: Date.now(),
      });
    }

    return oldActiveItems.length;
  },
});

const crons = cronJobs();

// Run auto-archive every day at midnight
crons.cron("auto-archive-old-items", "0 0 * * *", internal.crons.autoArchiveOldItems);

export default crons;
export { autoArchiveOldItems };