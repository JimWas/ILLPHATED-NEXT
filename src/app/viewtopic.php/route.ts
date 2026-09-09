import { redirectLegacyForumRequest } from "@/lib/legacy-forum-redirect";

export function GET(request: Request) {
  const url = new URL(request.url);
  return redirectLegacyForumRequest(request, "topic", url.searchParams.get("t") ?? url.searchParams.get("p"));
}
