import Link from 'next/link';

const links = [
  ['Home', '/'],
  ['Menu', '/menu'],
  ['About', '/about'],
  ['Contact', '/contact'],
  ['Admin', '/admin/login']
];

export default function Layout({ children, title = 'FoodiesZenith' }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">FoodiesZenith</div>
        <nav>
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="navlink">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
