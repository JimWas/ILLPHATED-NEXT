import DOMPurify from "isomorphic-dompurify";

/**
 * Hostnames allowed to be embedded via <iframe> on the boards.
 * A host matches if it equals an entry or is a subdomain of one.
 * Only video / streaming providers are permitted.
 */
const ALLOWED_IFRAME_HOSTS = [
  "youtube.com",
  "youtube-nocookie.com",
  "youtu.be",
  "player.twitch.tv",
  "clips.twitch.tv",
  "twitch.tv",
  "player.kick.com",
  "kick.com",
  "rumble.com",
  "player.vimeo.com",
  "vimeo.com",
  "dailymotion.com",
  "streamable.com",
  "w.soundcloud.com",
];

function isAllowedIframeSrc(src: string): boolean {
  let url: URL;
  try {
    url = new URL(src, "https://x"); // base handles protocol-relative //host/...
  } catch {
    return false;
  }
  // Only https (or protocol-relative, normalized to https above)
  if (url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase();
  return ALLOWED_IFRAME_HOSTS.some(
    (allowed) => host === allowed || host.endsWith("." + allowed)
  );
}

let hooksRegistered = false;

function registerHooks() {
  if (hooksRegistered) return;
  hooksRegistered = true;

  // Drop any iframe whose src is not in the streaming allowlist.
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName !== "iframe") return;
    const el = node as Element;
    const src = el.getAttribute("src") || "";
    if (!isAllowedIframeSrc(src)) {
      el.parentNode?.removeChild(el);
    }
  });

  // Lock down allowed iframes: force sandbox, drop dangerous attrs.
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName && node.nodeName.toLowerCase() === "iframe") {
      const el = node as Element;
      el.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-presentation allow-popups"
      );
      el.setAttribute("referrerpolicy", "no-referrer");
      el.setAttribute("loading", "lazy");
      el.setAttribute("allowfullscreen", "");
    }
  });
}

/**
 * Sanitize user-submitted board HTML. Allows basic formatting plus
 * <iframe> embeds from an allowlist of streaming/video providers.
 */
export function sanitizeBoardHtml(dirty: string): string {
  registerHooks();
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "a",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "s",
      "br",
      "p",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "span",
      "iframe",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "width",
      "height",
      "frameborder",
      "allow",
      "allowfullscreen",
      "title",
    ],
    ALLOW_DATA_ATTR: false,
    ADD_TAGS: ["iframe"],
    // Only allow safe URL schemes for href/src.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/\/)/i,
  });
}
