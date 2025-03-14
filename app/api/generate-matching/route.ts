import { matchingItemSchema, matchingItemsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content:
          "You are a teacher. Your job is to take a document, and create a set of 6 matching items based on the content of the document. Each item should have a term and a definition that can be matched together.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a set of matching items based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: matchingItemSchema,
    output: "array",
    onFinish: ({ object }) => {
      // Add unique IDs to each matching item
      const itemsWithIds = object?.map((item: any) => ({
        ...item,
        id: uuidv4(),
      }));
      
      const res = matchingItemsSchema.safeParse(itemsWithIds);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
