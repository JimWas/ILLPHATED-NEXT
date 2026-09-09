import { redirectLegacyForumRequest } from "@/lib/legacy-forum-redirect";

export function GET(request: Request) {
  return redirectLegacyForumRequest(request, "topic", new URL(request.url).searchParams.get("tid"));
}
