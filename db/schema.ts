import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  objectKey: text("object_key").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  project: text("project").notNull().default(""),
  mediaType: text("media_type").notNull(),
  mimeType: text("mime_type").notNull(),
  fileName: text("file_name").notNull(),
  size: integer("size").notNull(),
  ownerEmail: text("owner_email").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
