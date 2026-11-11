# Hypesquad

**Get your Discord HypeSquad badge in 2026 — no quiz required.**

Discord removed the HypeSquad house quiz from User Settings in 2026, but the API
endpoint the quiz used to call (`POST /api/v9/hypesquad/online`) still works
exactly as before. This guide walks you through grabbing your own token with
Inspect Element and calling that endpoint from your browser console so you can
join **Bravery**, **Brilliance**, or **Balance** and get the badge on your profile.

> [!IMPORTANT]
> Your token is the keys to your account. Never paste it into random websites,
> never send it to anyone, and never commit it to a repository. This guide only
> covers using **your own token on your own account**, in **your own browser**.

---

## Table of Contents

- [How It Works](#how-it-works)
- [What You Need](#what-you-need)
- [Step 1 — Open Discord Web](#step-1--open-discord-web)
- [Step 2 — Open Inspect Element](#step-2--open-inspect-element)
- [Step 3 — Find Your Token in the Network Tab](#step-3--find-your-token-in-the-network-tab)
- [Step 4 — Save Your Token Somewhere Safe](#step-4--save-your-token-somewhere-safe)
- [Step 5 — Open the Console and Allow Pasting](#step-5--open-the-console-and-allow-pasting)
- [Step 6 — Run the HypeSquad Script](#step-6--run-the-hypesquad-script)
- [Step 7 — Verify Your Badge](#step-7--verify-your-badge)
- [House IDs](#house-ids)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Token Safety](#token-safety)

---

## How It Works

1. Every request your browser makes to Discord's API carries an `Authorization`
   header. That header contains **your personal user token**.
2. DevTools → Network shows you those outgoing headers, so you can copy your
   token straight from any API request (`science`, `messages?limit=…`, `ack`,
   `users/@me`, etc.).
3. The old HypeSquad quiz was just a UI wrapper around one endpoint:

   ```http
   POST /api/v9/hypesquad/online
   Content-Type: application/json
   Authorization: <your token>

   { "house_id": 1 | 2 | 3 }
   ```

   The UI is gone. The endpoint is not. We simply call it ourselves from the
   Discord console, where the request is same-origin and works like any normal
   client request.

4. A `204 No Content` response means Discord accepted it — you're in the house
   and the badge is live on your profile.

---

## What You Need

| Requirement | Details |
| --- | --- |
| A Discord account | Obviously. |
| Discord **web** | Open [discord.com/app](https://discord.com/app) in Chrome, Edge, or Firefox. The desktop app has DevTools disabled by default. |
| DevTools | `F12` or `Ctrl + Shift + I` (`Cmd + Option + I` on macOS). |
| 2 minutes | That's it. No installs, no extensions, no third-party sites. |

---

## Step 1 — Open Discord Web

1. Go to **https://discord.com/app** in your browser.
2. Log in to the account you want the HypeSquad badge on.
3. Make sure the app has fully loaded (you can see your servers and messages).

> [!NOTE]
> You must be logged in. The token only exists in an active session.

---

## Step 2 — Open Inspect Element

1. Press **`F12`** on your keyboard.
   - Windows: `F12` or `Ctrl + Shift + I`
   - macOS: `Cmd + Option + I`
   - Or right-click anywhere on the page → **Inspect**
2. A panel will open on the right (or bottom) of your window. This is DevTools.

---

## Step 3 — Find Your Token in the Network Tab

1. Click the **Network** tab in DevTools.
2. If the request list is empty, press **`F5`** to refresh the page. Discord
   fires dozens of API calls while loading, and we need to capture them.
3. In the **Filter** box, type one of these to narrow the list down:

   | Filter | What it finds |
   | --- | --- |
   | `/api` | All Discord API calls |
   | `science` | Discord's telemetry pings — always present |
   | `messages` | Channel message fetches (`messages?limit=50`) |
   | `ack` | Read-state acknowledgements |
   | `@me` | Requests about your own user (`users/@me`) |

4. Click any request that appears (e.g. `science` or `messages?limit=50`).
5. In the right-hand pane, make sure you're on the **Headers** sub-tab.
6. Scroll down to the **Request Headers** section.
7. Find the line named **`authorization`**. Its value is a long string that
   looks like:
   ```
   NzQxNDk5MTIzNDU2Nzg5MDEy.MzQ1Njcu.xxxxxxx.xxxxxxx
   ```

8. Right-click the value → **Copy value** (or select it and press `Ctrl+C`).

> [!WARNING]
> If the `authorization` line isn't there, you clicked a static asset (images,
> CSS, JS). Only real API calls carry it — use the `/api` or `science` filter
> to make sure you're clicking an XHR/fetch request, then check **Headers**.

---

## Step 4 — Save Your Token Somewhere Safe

Paste your token somewhere private so you can copy it into the script in
Step 6:

- A plain-text file on your machine that you **delete afterward**, or
- Your password manager's notes/secure field, or
- Directly into the script you're about to edit.

**Do not** put it in a group chat, a screenshot, a public gist, or any
"token checker" website. Anyone with your token *is* logged in as you.

---

## Step 5 — Open the Console and Allow Pasting

1. In DevTools, click the **Console** tab.
2. Discord's console (like Chrome's) blocks pasting to protect you from
   blindly running code. To enable it, type exactly:

   ```
   allow pasting
   ```

3. Press **Enter**. You'll only need to do this once per session.
4. You can now paste code into the console.

> [!NOTE]
> If you see a warning like *"Don't paste code into the DevTools Console"* —
> that's exactly what `allow pasting` disables. Read any code you paste before
> running it. (You can read this repo's [`hypesquad.js`](./hypesquad.js) first.)

---

## Step 6 — Run the HypeSquad Script

1. Open [`hypesquad.js`](./hypesquad.js) in this repository and copy its
   contents. Or grab it here:

   ```js
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
   ```

2. Replace `"PASTE_YOUR_TOKEN_HERE"` with the token you copied in Step 4.
   Keep the quotes around it.
3. Change `houseId` to the house you want (`1`, `2`, or `3` — see
   [House IDs](#house-ids)).
4. Paste the whole thing into the **Console** and press **Enter**.

**Expected output:**

```
✅ Joined house 3
```

That's it — the request is synchronous-ish; you'll see the log line within a
second. A `204` means success.


---

## Step 7 — Verify Your Badge

1. Click your profile picture (bottom-left) or go to your profile.
2. Look for the **HypeSquad** badge among your badges.
3. You can also check **User Settings → Profile** to see your house.

If the badge isn't showing yet, hard-refresh the page (`Ctrl + Shift + R`).

---

## House IDs

| `house_id` | House | Vibe |
| --- | --- | --- |
| `1` | **Bravery** | Bold, direct, unafraid to take action |
| `2` | **Brilliance** | Curious, inventive, loves figuring things out |
| `3` | **Balance** | Diplomatic, steady, keeps the peace |

You can switch houses at any time by re-running the script with a different
`house_id` — the endpoint overwrites your current house in one call, no need
to leave first.

To **remove** the badge entirely:

```js
fetch("/api/v9/hypesquad/online", {
  method: "DELETE",
  headers: { "Authorization": myToken },
}).then(r => console.log(r.status === 204 ? "✅ Badge removed" : "❌ " + r.status));
```

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `❌ 401` | Token is wrong, truncated, or expired | Re-copy the full `authorization` value from the Network tab. Make sure there are no stray spaces or line breaks inside the quotes. |
| `❌ 400` | Body is malformed | Make sure you're sending `{ "house_id": 1 }` with `house_id` as a number, not a string. |
| `❌ 429` | You're rate-limited | You switched houses too many times too fast. Wait a few minutes and try once. |
| `❌ 403` | Account restriction | New/limited accounts may be blocked from certain profile actions. Confirm your account is in good standing. |
| Console won't accept pasting | Paste protection is active | Type `allow pasting`, press Enter, then paste again. |
| No requests in Network tab | Nothing was captured | Press `F5` to refresh while the Network tab is open, and filter by `/api`. |
| Badge not visible | Cached profile | Hard-refresh (`Ctrl + Shift + R`) and re-check your profile. |
| Works, then stops later | Token rotated | Password changes, "Log out other devices," and some security events rotate tokens — just grab the fresh one. |

---

## FAQ

**Is this against Discord's ToS?**
You're calling the same endpoint the official client called when the quiz
existed, with your own token, from Discord's own origin. It's a standard
authenticated API request. That said, don't spam it — switch houses the way a
normal person would (a few times, not thousands).

**Do I need to install anything?**
No. No extensions, no bookmarklets from strangers, no third-party websites.
Just DevTools and the code in this repo.

**Will this work in the desktop app?**
The script will, if you can open a console there (the desktop app disables
DevTools by default). The token-grabbing steps in this guide are written for
the browser version, which is the easy path.

**Does the token ever leave my computer?**
No. You're pasting it into your own browser's console, and the only network
request it goes to is `discord.com` itself. This repo contains no tracking,
no analytics, and no server.

**I already have a house — can I switch?**
Yes. POST the new `house_id`; it overwrites the old one atomically.

---

## Token Safety

- Treat your token **exactly like your password**.
- Never share it. Anyone who has it can read your DMs and act as you.
- Never paste it into a website, a DM, or a "free nitro" form.
- If you think it leaked, change your password immediately (this invalidates
  the old token) and review **Settings → Devices**.
- Don't commit tokens to git. This is why [`hypesquad.js`](./hypesquad.js)
  uses a `PASTE_YOUR_TOKEN_HERE` placeholder instead of a real value.

---

## License

MIT — see [LICENSE](./LICENSE)