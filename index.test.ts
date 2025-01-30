import { afterAll, describe, expect, test } from "bun:test";
import { server } from "./index";

describe("Text Analysis API", () => {
  test("should analyze positive sentiment", async () => {
    const response = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "I'm having a great day!",
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("sentiment");
    expect(typeof data.sentiment).toBe("string");
    expect(["positive", "negative", "neutral"]).toContain(data.sentiment);
  });

  afterAll(() => {
    server.stop();
  });
});
