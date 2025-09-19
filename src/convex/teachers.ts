import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Teacher login
export const loginTeacher = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const teacher = await ctx.db
      .query("teacherCredentials")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!teacher || teacher.password !== args.password) {
      throw new Error("Invalid username or password");
    }

    return {
      id: teacher._id,
      username: teacher.username,
      name: teacher.name,
      email: teacher.email,
    };
  },
});

// Create teacher account (for setup)
export const createTeacher = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if username already exists
    const existing = await ctx.db
      .query("teacherCredentials")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (existing) {
      throw new Error("Username already exists");
    }

    const teacherId = await ctx.db.insert("teacherCredentials", {
      username: args.username,
      password: args.password, // In production, hash this
      name: args.name,
      email: args.email,
    });

    return teacherId;
  },
});

// Get all teachers (for admin purposes)
export const getAllTeachers = query({
  args: {},
  handler: async (ctx) => {
    const teachers = await ctx.db.query("teacherCredentials").collect();
    return teachers.map(({ password, ...teacher }) => teacher); // Don't return passwords
  },
});
