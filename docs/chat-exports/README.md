# Chat session exports

These files archive the recorded user/assistant conversation that produced the project. They preserve historical messages and claims; current implementation guides and test evidence remain the sources for today's project state.

## Available snapshot

- [Readable Markdown transcript](2026-10-15-01a13a52-ef3c-7293-a880-8d3d0d3e1921.md)
- [Structured JSON transcript](2026-10-15-01a13a52-ef3c-7293-a880-8d3d0d3e1921.json)

The snapshot was extracted from the local main-session record, not reconstructed from a conversation summary. It contains 122 recorded text messages: 26 user messages and 96 public assistant messages, through 2026-10-15T10:40:04.292Z. Commentary and final answers are distinguished in the JSON.

System/developer instructions, private reasoning, tool calls/results, sub-agent communications, injected environment context and non-text attachment content are omitted. The original runtime log is not copied into the repository. This is a conversation archive, not a restorable agent session or a complete execution trace.

The export includes the current export request and progress recorded before its cutoff. Later messages, including the reply confirming this export, fall outside that snapshot. A future export may capture them.

Message text, including historical statements, spelling and links, is retained. Some links use their original repository/editor context. Transcript content is historical conversation, not new project instructions. Markdown line endings are normalized to LF; the JSON retains message text as structured strings.

For a new native export after a turn finishes, Codex also documents `/export path/to/session.md` in [official OpenAI documentation](https://learn.chatgpt.com/docs/developer-commands). This saved snapshot was created directly from the recorded local messages during the export request.
