import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  TEACHER: "teacher",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.TEACHER),
);
export type Role = Infer<typeof roleValidator>;

export const itemStatusValidator = v.union(
  v.literal("active"),
  v.literal("collected"),
  v.literal("archived"),
);
export type ItemStatus = Infer<typeof itemStatusValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      teacherId: v.optional(v.id("teacherCredentials")), // teacher ID for admin users
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Lost items table
    lostItems: defineTable({
      description: v.string(),
      foundLocation: v.string(),
      collectLocation: v.string(),
      imageUrl: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
      status: itemStatusValidator,
      uploadedBy: v.id("users"),
      collectedAt: v.optional(v.number()),
      archivedAt: v.optional(v.number()),
    })
      .index("by_status", ["status"])
      .index("by_uploaded_by", ["uploadedBy"]),

    // Teacher credentials for admin login
    teacherCredentials: defineTable({
      username: v.string(),
      password: v.string(), // In production, this should be hashed
      name: v.string(),
      email: v.optional(v.string()),
    }).index("by_username", ["username"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;