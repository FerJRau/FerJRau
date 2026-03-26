#!/usr/bin/env python3
"""
WhatsApp Message Consolidator

Reads a consolidated WhatsApp CSV export and produces a Markdown report that
splits conversations into two sections based on who sent the first message:

  - Incoming-Initiated: conversations where the contact messaged first
  - Outgoing-Initiated: conversations where the business messaged first

Each section lists full conversations (both directions) sorted newest to oldest.
Optionally, CSV output files can also be generated.

Usage:
    python whatsapp_message_consolidator.py <input_csv> [options]

Arguments:
    input_csv           Path to the consolidated WhatsApp CSV file.
    --output-dir        Directory for output files (default: same as input).
    --business-name     Name shown for outgoing messages (default: "self").
    --title             Title/location for the report header.
    --csv               Also generate incoming_messages.csv and outgoing_messages.csv.
"""

import argparse
import csv
import os
import sys
from collections import defaultdict
from datetime import datetime


EXPECTED_COLUMNS = [
    "chat_id",
    "file_name",
    "message_index",
    "timestamp",
    "date",
    "time",
    "direction",
    "sender",
    "sender_raw",
    "message",
    "message_length",
    "word_count",
]


def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description="Consolidate WhatsApp messages into a Markdown report."
    )
    parser.add_argument(
        "input_csv",
        help="Path to the consolidated WhatsApp CSV file.",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Directory for output files (default: same as input file).",
    )
    parser.add_argument(
        "--business-name",
        default="self",
        help="Display name for outgoing/business messages (default: 'self').",
    )
    parser.add_argument(
        "--title",
        default="WhatsApp Conversations",
        help="Title for the Markdown report (default: 'WhatsApp Conversations').",
    )
    parser.add_argument(
        "--csv",
        action="store_true",
        help="Also generate incoming_messages.csv and outgoing_messages.csv.",
    )
    return parser.parse_args(argv)


def parse_datetime(row):
    """Parse date (DD/MM/YY) and time (HH:MM:SS) into a datetime object."""
    date_str = row.get("date", "").strip()
    time_str = row.get("time", "").strip()
    if not date_str or not time_str:
        return datetime.min
    try:
        return datetime.strptime(f"{date_str} {time_str}", "%d/%m/%y %H:%M:%S")
    except ValueError:
        return datetime.min


def read_all_messages(input_path):
    """Read the input CSV and return all messages grouped by chat_id.

    Returns a dict of chat_id -> list of row dicts (with parsed datetime),
    and the count of skipped rows.
    """
    conversations = defaultdict(list)
    skipped = 0

    with open(input_path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)

        missing = set(EXPECTED_COLUMNS) - set(reader.fieldnames or [])
        if missing:
            print(
                f"ERROR: Input CSV is missing expected columns: {sorted(missing)}",
                file=sys.stderr,
            )
            sys.exit(1)

        for row in reader:
            chat_id = row.get("chat_id", "").strip()
            direction = row.get("direction", "").strip().lower()

            if not chat_id or direction not in ("incoming", "outgoing"):
                skipped += 1
                continue

            row["_datetime"] = parse_datetime(row)
            conversations[chat_id].append(row)

    # Sort messages within each conversation by message_index
    for chat_id in conversations:
        conversations[chat_id].sort(
            key=lambda r: int(r.get("message_index", 0))
        )

    return conversations, skipped


def extract_contact_name(file_name):
    """Derive a display name for the contact from the file_name field.

    The file_name is typically like '+5215554085310.txt'. We strip the
    extension and leading '+' to get the phone number.
    """
    name = file_name.replace(".txt", "").strip()
    if name.startswith("+"):
        name = name[1:]
    return name


def phone_from_chat_id(chat_id):
    """Convert scientific-notation chat_id back to a phone string."""
    try:
        return str(int(float(chat_id)))
    except (ValueError, OverflowError):
        return chat_id


def format_datetime(dt):
    """Format a datetime as YYYY-MM-DD H:MM (no leading zero on hour)."""
    return dt.strftime("%Y-%m-%d %-H:%M")


def build_markdown(conversations, business_name, title):
    """Build the full Markdown report string."""
    incoming_initiated = {}
    outgoing_initiated = {}

    for chat_id, messages in conversations.items():
        if not messages:
            continue
        first_direction = messages[0].get("direction", "").strip().lower()
        if first_direction == "incoming":
            incoming_initiated[chat_id] = messages
        else:
            outgoing_initiated[chat_id] = messages

    # Sort conversations newest to oldest by the first message datetime
    def sort_key(item):
        return item[1][0]["_datetime"]

    incoming_sorted = sorted(
        incoming_initiated.items(), key=sort_key, reverse=True
    )
    outgoing_sorted = sorted(
        outgoing_initiated.items(), key=sort_key, reverse=True
    )

    total_convos = len(incoming_sorted) + len(outgoing_sorted)
    total_msgs = sum(len(m) for m in conversations.values())

    lines = []
    lines.append(f"# {title}")
    lines.append("")
    lines.append(f"*{total_convos} conversations, {total_msgs} total messages*")
    lines.append("")
    lines.append("---")
    lines.append("")

    # --- Incoming-Initiated Section ---
    lines.append(
        f"# Incoming-Initiated Conversations ({len(incoming_sorted)})"
    )
    lines.append("")
    lines.append(
        "*Conversations where the contact messaged first, newest to oldest.*"
    )
    lines.append("")
    lines.append("---")

    for chat_id, messages in incoming_sorted:
        _write_conversation(lines, chat_id, messages, business_name)

    lines.append("")
    lines.append("---")
    lines.append("")

    # --- Outgoing-Initiated Section ---
    lines.append(
        f"# Outgoing-Initiated Conversations ({len(outgoing_sorted)})"
    )
    lines.append("")
    lines.append(
        f"*Conversations where {business_name} messaged first, newest to oldest.*"
    )
    lines.append("")
    lines.append("---")

    for chat_id, messages in outgoing_sorted:
        _write_conversation(lines, chat_id, messages, business_name)

    lines.append("")
    return "\n".join(lines)


def _write_conversation(lines, chat_id, messages, business_name):
    """Append a single conversation block to the lines list."""
    file_name = messages[0].get("file_name", "")
    contact_name = extract_contact_name(file_name)
    phone = phone_from_chat_id(chat_id)

    first_dt = messages[0]["_datetime"]
    last_dt = messages[-1]["_datetime"]
    msg_count = len(messages)

    lines.append("")
    lines.append(f"## {contact_name} ({phone})")
    lines.append("")
    lines.append(
        f"*{format_datetime(first_dt)} \u2014 "
        f"{format_datetime(last_dt)} \u00b7 "
        f"{msg_count} messages*"
    )
    lines.append("")

    for msg in messages:
        direction = msg.get("direction", "").strip().lower()
        dt = msg["_datetime"]
        text = msg.get("message", "").strip()

        if direction == "outgoing":
            sender = business_name
        else:
            sender = contact_name

        lines.append(f"**[{format_datetime(dt)}] {sender}:** {text}  ")

    lines.append("")
    lines.append("")
    lines.append("---")


def write_csv_files(conversations, output_dir):
    """Optionally write incoming_messages.csv and outgoing_messages.csv."""
    incoming_rows = []
    outgoing_rows = []

    for messages in conversations.values():
        for row in messages:
            clean_row = {k: row[k] for k in EXPECTED_COLUMNS if k in row}
            direction = row.get("direction", "").strip().lower()
            if direction == "incoming":
                incoming_rows.append(clean_row)
            elif direction == "outgoing":
                outgoing_rows.append(clean_row)

    for filename, rows in [
        ("incoming_messages.csv", incoming_rows),
        ("outgoing_messages.csv", outgoing_rows),
    ]:
        path = os.path.join(output_dir, filename)
        if not rows:
            print(f"  (no messages to write for {path})")
            continue
        with open(path, "w", newline="", encoding="utf-8") as fh:
            writer = csv.DictWriter(
                fh, fieldnames=EXPECTED_COLUMNS, extrasaction="ignore"
            )
            writer.writeheader()
            writer.writerows(rows)
        print(f"  {path} ({len(rows)} rows)")


def main(argv=None):
    args = parse_args(argv)
    input_path = args.input_csv

    if not os.path.isfile(input_path):
        print(f"ERROR: File not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    output_dir = args.output_dir or os.path.dirname(input_path) or "."
    os.makedirs(output_dir, exist_ok=True)

    print(f"Reading: {input_path}")
    conversations, skipped = read_all_messages(input_path)

    total_msgs = sum(len(m) for m in conversations.values())
    print(f"Found {total_msgs} messages across {len(conversations)} conversations")
    if skipped:
        print(f"Skipped {skipped} empty/invalid rows")

    # Build and write Markdown report
    md_content = build_markdown(conversations, args.business_name, args.title)
    md_path = os.path.join(output_dir, "whatsapp_conversations.md")
    with open(md_path, "w", encoding="utf-8") as fh:
        fh.write(md_content)
    print(f"\nMarkdown report: {md_path}")

    # Optionally write CSV files
    if args.csv:
        print("CSV files:")
        write_csv_files(conversations, output_dir)

    print("Done.")


if __name__ == "__main__":
    main()
