import { Suspense } from "react";
import ForumAccount from "@/components/ForumAccount";
import ForumHeader from "@/components/ForumHeader";

export const metadata = { title: "MEMBER ACCESS | ILLPHATED.COM" };

export default function ForumAccountPage() {
  return (
    <div className="min-h-screen command-grid">
      <ForumHeader context="MEMBER ACCESS" />
      <main className="p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<p className="forum-notice">LOADING SECURE ACCESS...</p>}>
            <ForumAccount />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
