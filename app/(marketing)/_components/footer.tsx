import { Code2 } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="relative mt-auto">
      <div className="mx-auto px-4 pb-6 pt-16 sm:px-6 lg:px-8">
        <div className="border-t border-indigo-500/10 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-indigo-300/70">
                <Code2 className="size-5" />
                <span className="text-sm">Built for developers, by developers</span>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/support" className="text-indigo-300/70 hover:text-indigo-300 transition-colors text-sm">
                  Support
                </Link>
                <Link href="/privacy" className="text-indigo-300/70 hover:text-indigo-300 transition-colors text-sm">
                  Privacy
                </Link>
                <Link href="/terms" className="text-indigo-300/70 hover:text-indigo-300 transition-colors text-sm">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}