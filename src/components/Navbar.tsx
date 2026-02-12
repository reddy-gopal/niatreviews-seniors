"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap } from "lucide-react";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Navbar() {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-2 pt-2 sm:px-3 sm:pt-3">
      <div
        className="max-w-7xl mx-auto flex h-14 sm:h-16 md:h-20 items-center gap-2 sm:gap-4 px-3 sm:px-5 rounded-xl sm:rounded-2xl border border-niat-border shadow-soft"
        style={{ backgroundColor: "var(--niat-navbar)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0"
          style={{ color: "var(--primary)" }}
        >
          {!logoError ? (
            <Image
              src="/logo.png"
              alt="NIAT Logo"
              width={96}
              height={32}
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <GraduationCap className="h-8 sm:h-10 md:h-12 w-auto" />
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight text-primary">
              NIAT REVIEWS
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
