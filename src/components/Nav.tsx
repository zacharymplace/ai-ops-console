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
          className="rounded-full border px-3 py-1 text-zinc-700 hover:bg-zinc-100"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
