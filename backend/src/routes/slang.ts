import { Router, Request, Response } from "express";
import { slangify } from "../utils/slangify";

const router = Router();

/**
 * POST /api/slang
 * body: { text: string }
 * response: { original: string, slang: string }
 */
router.post("/", (req: Request, res: Response) => {
  const { text } = req.body ?? {};
  if (typeof text !== "string") {
    return res.status(400).json({ error: "Missing 'text' field in request body (string expected)." });
  }

  try {
    const slang = slangify(text);
    return res.json({ original: text, slang });
  } catch (err) {
    console.error("Error in /api/slang:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
