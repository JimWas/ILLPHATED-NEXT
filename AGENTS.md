<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## GitHub CLI authentication

The GitHub CLI is authenticated through the macOS keychain. A sandboxed
`gh auth status` check can incorrectly report that the token is invalid or that
GitHub is unreachable. Before asking the user to log in again, rerun the check
with approved network/keychain access outside the sandbox. Only request a new
login when that escalated check also fails.
