import Link from "next/link";
import { SITE } from "@/config/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-primary flex items-center gap-2 font-serif text-lg font-semibold"
    >
      <svg aria-hidden viewBox="0 0 32 32" className="size-8">
        <circle cx="16" cy="16" r="15" className="fill-primary-soft" />
        <circle cx="13" cy="15" r="6" className="fill-primary" />
        <circle cx="20" cy="18" r="5" className="fill-accent" opacity="0.9" />
      </svg>
      <span>{SITE.brand}</span>
    </Link>
  );
}
