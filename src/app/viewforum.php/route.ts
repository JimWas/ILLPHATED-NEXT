import { redirectLegacyForumRequest } from "@/lib/legacy-forum-redirect";

export function GET(request: Request) {
  return redirectLegacyForumRequest(request, "forum", new URL(request.url).searchParams.get("f"));
}
