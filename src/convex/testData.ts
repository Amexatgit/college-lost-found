import { mutation } from "./_generated/server";

// Create test data for development
export const createTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create test teacher
    const teacherId = await ctx.db.insert("teacherCredentials", {
      username: "teacher1",
      password: "password123",
      name: "Dr. Smith",
      email: "smith@college.edu",
    });

    // Create test user with teacher role
    const userId = await ctx.db.insert("users", {
      name: "Dr. Smith",
      email: "smith@college.edu",
      role: "teacher",
      teacherId: teacherId,
    });

    // Create some test lost items
    const items = [
      {
        description: "Blue water bottle with college logo",
        foundLocation: "Library - 2nd floor study area",
        collectLocation: "Main office reception",
        status: "active" as const,
        uploadedBy: userId,
      },
      {
        description: "Black leather wallet",
        foundLocation: "Cafeteria - near the entrance",
        collectLocation: "Security office",
        status: "active" as const,
        uploadedBy: userId,
      },
      {
        description: "Red backpack with laptop inside",
        foundLocation: "Computer lab - Room 301",
        collectLocation: "IT department",
        status: "collected" as const,
        uploadedBy: userId,
        collectedAt: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ];

    for (const item of items) {
      await ctx.db.insert("lostItems", item);
    }

    return "Test data created successfully";
  },
});
