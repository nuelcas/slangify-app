// Frontend TypeScript for Slangify
// --------------------------------------------------------------

const BACKEND_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : ""; // In production, backend serves the frontend, so relative URLs are fine

async function slangifyText(text: string): Promise<string> {
  const resp = await fetch(`${BACKEND_URL}/api/slang`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err?.error || "Request failed");
  }

  const data = await resp.json();
  return data.slang;
}

function $(selector: string): HTMLElement {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Missing element ${selector}`);
  return el as HTMLElement;
}

const input = $("#input") as HTMLTextAreaElement;
const go = $("#go") as HTMLButtonElement;
const clear = $("#clear") as HTMLButtonElement;
const copy = $("#copy") as HTMLButtonElement;
const result = $("#result") as HTMLElement;
const backendStatus = $("#backendStatus") as HTMLElement;

async function checkBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    if (!res.ok) throw new Error("not ok");
    const json = await res.json();
    backendStatus.textContent = `online — ${new Date(
      json.timestamp
    ).toLocaleTimeString()}`;
  } catch {
    backendStatus.textContent = "offline";
  }
}

go.addEventListener("click", async () => {
  const txt = input.value.trim();
  if (!txt) {
    result.textContent = "Please enter some text.";
    return;
  }

  result.textContent = "Translating…";

  try {
    const slang = await slangifyText(txt);
    result.textContent = slang;
  } catch (err) {
    result.textContent = `Error: ${(err as Error).message}`;
  }
});

clear.addEventListener("click", () => {
  input.value = "";
  result.textContent = "";
});

copy.addEventListener("click", async () => {
  const text = result.textContent || "";
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copy.textContent = "Copied!";
    setTimeout(() => (copy.textContent = "Copy"), 1500);
  } catch {
    copy.textContent = "Failed";
    setTimeout(() => (copy.textContent = "Copy"), 1500);
  }
});

// Check backend on load + periodically
checkBackend();
setInterval(checkBackend, 20_000);
