# LinkedIn DM Auto-Reply Workflow (Unipile)

Automatically replies to new LinkedIn DMs using AI (OpenAI GPT-4o-mini) via the Unipile API.

## Architecture

```
Unipile Webhook → n8n Webhook → Filter (incoming only) → Extract Data → OpenAI → Send Reply via Unipile
```

### Nodes

| # | Node | Purpose |
|---|------|---------|
| 1 | **Webhook - Unipile Events** | Receives `message_received` events from Unipile |
| 2 | **Filter - Incoming Messages Only** | Blocks self-sent messages + non-LinkedIn events |
| 3 | **Extract Message Data** | Parses chat_id, sender info, message text |
| 4 | **OpenAI - Generate Reply** | Calls GPT-4o-mini to generate a professional response |
| 5 | **Format Reply** | Extracts AI text and pairs it with the chat_id |
| 6 | **Unipile - Send Reply** | POSTs the reply back to the LinkedIn chat |

## Setup Steps

### 1. Replace Placeholders in n8n

Open the workflow in your n8n instance and update these values:

| Placeholder | Where to find it | Node |
|---|---|---|
| `YOUR_UNIPILE_DSN` | [Unipile Dashboard](https://dashboard.unipile.com) → top of page (e.g. `https://api4.unipile.com:13455`) | "Unipile - Send Reply" URL field |
| `YOUR_UNIPILE_API_KEY` | Unipile Dashboard → API Keys section | "Unipile - Send Reply" headers |
| `YOUR_OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) | "OpenAI - Generate Reply" headers |

### 2. Register Webhook in Unipile Dashboard

1. Go to https://dashboard.unipile.com → **Webhooks** tab
2. Click **Add endpoint**
3. Set Callback URL to the **production URL**:
   ```
   https://n8n.wasilda.cloud/webhook/unipile-linkedin-dm
   ```
4. Select event type: **message.new** (or "New messages")
5. Optionally restrict to your LinkedIn account only
6. Save the webhook

### 3. Activate the Workflow

Toggle the workflow to **Active** in n8n so it listens on the production webhook URL.

## How It Works

1. Someone sends you a LinkedIn DM
2. Unipile detects the new message and POSTs the event to your n8n webhook
3. The filter ensures it's an incoming message (not one you sent yourself)
4. The message text + sender name are sent to OpenAI for a short, professional reply
5. The AI-generated reply is sent back to the same chat via Unipile's API

## Self-Message Loop Prevention

The filter node compares `sender.attendee_provider_id` with `account_info.user_id`. If they match, it means YOU sent the message (from another device or via API), so the workflow stops — preventing infinite reply loops.

## Customization

- **AI Personality**: Edit the system prompt in the "OpenAI - Generate Reply" node's `jsonBody` field
- **Model**: Change `gpt-4o-mini` to `gpt-4o` for higher quality (higher cost)
- **Max tokens**: Adjust `max_tokens` (currently 150) for longer/shorter replies
- **Temperature**: Lower (0.3) for more predictable replies, higher (0.9) for more creative

## Workflow ID

- **n8n Workflow ID**: `GO7S4zD4miHp4aLm`
- **n8n Instance**: https://n8n.wasilda.cloud
