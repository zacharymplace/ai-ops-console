import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/requests/new", label: "Submit" },
  { href: "/requests/review", label: "Review" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/case-study", label: "Case Study" },
  { href: "/prompts", label: "Prompts" },
];

export function Nav() {
  return (
    <nav className="mx-auto flex max-w-5xl flex-wrap gap-2 p-6 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="border-[1.5px] px-3 py-1 font-condensed font-bold uppercase tracking-widest text-ink-2 hover:bg-paper-3"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
