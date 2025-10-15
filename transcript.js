import fs from "node:fs/promises";
import fetch from "node-fetch";

// const API_KEY = "sk_05e64745ef65e4203fafe51747ebfcbd9b20658ce958a6dc";
const BASE = "https://api.elevenlabs.io/v1/convai";

async function listPage(cursor) {
  const url = new URL(`${BASE}/conversations`);
  url.searchParams.set("order_by", "start_time_unix_secs");
  url.searchParams.set("order_direction", "desc");
  url.searchParams.set("limit", "100");
  if (cursor) url.searchParams.set("cursor", cursor);

  const r = await fetch(url, { headers: { "xi-api-key": API_KEY } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function getConversation(id) {
  const r = await fetch(`${BASE}/conversations/${id}`, { headers: { "xi-api-key": API_KEY } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

(async () => {
  await fs.mkdir("unknown_failure_convs", { recursive: true });
  let cursor = null, total = 0, saved = 0;

  while (true) {
    const page = await listPage(cursor);
    for (const c of page.conversations ?? []) {
      total++;
      const status = (c.call_successful || "").toLowerCase();
      if (status === "unknown failure") {
        const full = await getConversation(c.conversation_id);
        await fs.writeFile(`unknown_failure_convs/${c.conversation_id}.json`, JSON.stringify(full, null, 2));
        saved++;
      }
    }
    if (!page.has_more) break;
    cursor = page.next_cursor;
  }
  console.log(`Scanned ${total} conversations, saved ${saved} with 'unknown failure' status`);
})();
