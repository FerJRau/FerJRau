#!/usr/bin/env python3
"""
WhatsApp Message Consolidator

Reads a consolidated WhatsApp CSV export and splits it into two output CSVs:
  - incoming_messages.csv: all incoming messages, grouped by conversation (chat_id)
  - outgoing_messages.csv: all outgoing messages, grouped by conversation (chat_id)

Within each conversation, messages are sorted by message_index to preserve
chronological order.

Usage:
    python whatsapp_message_consolidator.py <input_csv> [--output-dir <dir>]

Arguments:
    input_csv       Path to the consolidated WhatsApp CSV file.
    --output-dir    Directory for output files (default: same directory as input).
"""

import argparse
import csv
import os
import sys
from collections import defaultdict


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
        description="Consolidate WhatsApp messages into incoming/outgoing CSVs."
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
    return parser.parse_args(argv)


def read_messages(input_path):
    """Read the input CSV and return rows grouped by direction.

    Returns a dict with keys 'incoming' and 'outgoing', each mapping to
    a dict of chat_id -> list of row dicts.  Empty rows (no chat_id or
    direction) are silently skipped.
    """
    groups = {
        "incoming": defaultdict(list),
        "outgoing": defaultdict(list),
    }
    skipped = 0

    with open(input_path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)

        # Validate header
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

            groups[direction][chat_id].append(row)

    return groups, skipped


def sort_conversations(conversations):
    """Sort messages inside each conversation by message_index (numeric)."""
    for chat_id, messages in conversations.items():
        messages.sort(key=lambda r: int(r.get("message_index", 0)))


def write_csv(rows_by_chat, output_path):
    """Write conversation-grouped rows to a CSV file.

    Conversations are sorted by the earliest date/time of their first message,
    and within each conversation messages are already sorted by message_index.
    """
    # Flatten while preserving conversation grouping order.
    # Sort conversations by the date+time of their first message (ascending).
    sorted_chats = sorted(
        rows_by_chat.items(),
        key=lambda item: (
            item[1][0].get("date", ""),
            item[1][0].get("time", ""),
        ),
    )

    all_rows = []
    for _chat_id, messages in sorted_chats:
        all_rows.extend(messages)

    if not all_rows:
        print(f"  (no messages to write for {output_path})")
        return 0

    with open(output_path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=EXPECTED_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(all_rows)

    return len(all_rows)


def main(argv=None):
    args = parse_args(argv)
    input_path = args.input_csv

    if not os.path.isfile(input_path):
        print(f"ERROR: File not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    output_dir = args.output_dir or os.path.dirname(input_path) or "."
    os.makedirs(output_dir, exist_ok=True)

    incoming_path = os.path.join(output_dir, "incoming_messages.csv")
    outgoing_path = os.path.join(output_dir, "outgoing_messages.csv")

    print(f"Reading: {input_path}")
    groups, skipped = read_messages(input_path)

    # Sort each conversation internally
    sort_conversations(groups["incoming"])
    sort_conversations(groups["outgoing"])

    incoming_count = sum(len(msgs) for msgs in groups["incoming"].values())
    outgoing_count = sum(len(msgs) for msgs in groups["outgoing"].values())

    print(f"Found {incoming_count} incoming messages across "
          f"{len(groups['incoming'])} conversations")
    print(f"Found {outgoing_count} outgoing messages across "
          f"{len(groups['outgoing'])} conversations")
    if skipped:
        print(f"Skipped {skipped} empty/invalid rows")

    written_in = write_csv(groups["incoming"], incoming_path)
    written_out = write_csv(groups["outgoing"], outgoing_path)

    print(f"\nOutput files:")
    if written_in:
        print(f"  Incoming: {incoming_path} ({written_in} rows)")
    if written_out:
        print(f"  Outgoing: {outgoing_path} ({written_out} rows)")

    print("Done.")


if __name__ == "__main__":
    main()
