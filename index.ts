import { serve } from "bun";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import os from "os";
import { z } from "zod";

// Define request schema
const analyzeRequestSchema = z.object({
  text: z.string().min(1, "Text is required").max(1000, "Text is too long"),
});

// Simple in-memory logger
const logs: Array<{ timestamp: string; endpoint: string; result: any }> = [];

const PORT = 3000;

const serverConfig = {
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url);
    const method = req.method;

    // Log request
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${url.pathname}`);

    try {
      // GET /logs endpoint
      if (method === "GET" && url.pathname === "/logs") {
        return new Response(JSON.stringify(logs), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // POST /analyze endpoint
      if (method === "POST" && url.pathname === "/analyze") {
        const body = await req.json();

        // Validate request body
        const result = analyzeRequestSchema.safeParse(body);

        if (!result.success) {
          return new Response(
            JSON.stringify({
              error: "Validation error",
              details: result.error.errors,
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const { text } = result.data;

        // Use AI model for sentiment analysis
        const prompt = `Analyze the sentiment of the following text and respond with only one word - 'positive', 'negative', or 'neutral': "${text}"`;
        const { text: sentiment } = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: prompt,
        });

        const analysisResult = { sentiment: sentiment.toLowerCase().trim() };
        console.log(
          `[${timestamp}] Response for ${url.pathname}:`,
          analysisResult
        );
        logs.push({ timestamp, endpoint: "/analyze", result: analysisResult });

        return new Response(JSON.stringify(analysisResult), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // GET /status endpoint
      if (method === "GET" && url.pathname === "/status") {
        const status = {
          cpuUsage: os.loadavg()[0], // 1 minute load average
          totalMemory: os.totalmem(),
          freeMemory: os.freemem(),
          uptime: os.uptime(),
          logs: logs.slice(-5), // Last 5 logs
        };

        logs.push({ timestamp, endpoint: "/status", result: status });

        return new Response(JSON.stringify(status), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Handle 404
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error(`[${timestamp}] Error:`, error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};

export const server = serve(serverConfig);

// Only start the server if this file is run directly (not imported)
if (import.meta.main) {
  console.log(`Server running at http://localhost:${PORT}`);
}
