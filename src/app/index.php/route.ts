export function GET(request: Request) {
  return Response.redirect(new URL("/boards", request.url), 308);
}
