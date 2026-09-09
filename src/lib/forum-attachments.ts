import type { ForumAttachment } from "@/lib/forum";
import { supabase } from "@/lib/supabase";

const IMAGE_FILE_EXTENSION = /\.(avif|gif|heic|heif|jpe?g|png|svg|webp)$/i;

export function isImageAttachment(attachment: Pick<ForumAttachment, "file_name" | "mime_type">) {
  return attachment.mime_type?.startsWith("image/") || IMAGE_FILE_EXTENSION.test(attachment.file_name);
}

export async function createForumImageUrls(attachments: ForumAttachment[]) {
  const imageAttachments = attachments.filter(isImageAttachment);
  const entries = await Promise.all(
    imageAttachments.map(async (attachment) => {
      const { data, error } = await supabase.storage
        .from("forum-files")
        .createSignedUrl(attachment.storage_path, 60 * 60);

      return error || !data?.signedUrl ? null : ([attachment.id, data.signedUrl] as const);
    }),
  );

  return Object.fromEntries(entries.filter((entry): entry is readonly [string, string] => entry !== null));
}
