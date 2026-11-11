// Discord HypeSquad Joiner — 2026
// Run this in the Discord web console (discord.com/app → F12 → Console).
// Type "allow pasting" first if the console blocks you from pasting.
//
// 1. Get your token: F12 → Network → filter "science" or "messages" →
//    click a request → Headers → Request Headers → copy "authorization".
// 2. Replace PASTE_YOUR_TOKEN_HERE below (keep the quotes).
// 3. Pick your house and press Enter.

const houseId = 3; // 1: Bravery, 2: Brilliance, 3: Balance
const myToken = "PASTE_YOUR_TOKEN_HERE";

fetch("/api/v9/hypesquad/online", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": myToken,
  },
  body: JSON.stringify({ house_id: houseId }),
}).then(r => console.log(r.status === 204 ? "✅ Joined house " + houseId : "❌ " + r.status));

// --- Optional: remove the badge later -------------------------------
// fetch("/api/v9/hypesquad/online", {
//   method: "DELETE",
//   headers: { "Authorization": myToken },
// }).then(r => console.log(r.status === 204 ? "✅ Badge removed" : "❌ " + r.status));
