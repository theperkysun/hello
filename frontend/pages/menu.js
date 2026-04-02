import { useState } from 'react';
import Layout from '../components/Layout';

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [menuRes, qrRes, categoryRes] = await Promise.all([
    fetch(`${base}/menu`),
    fetch(`${base}/qr/menu?format=svg`),
    fetch(`${base}/menu/categories`)
  ]);

  const [menu, qr, categories] = await Promise.all([menuRes.json(), qrRes.text(), categoryRes.json()]);

  return { props: { menu, qr, categories, apiBase: base } };
}

export default function MenuPage({ menu, qr, categories, apiBase }) {
  const [query, setQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const allItems = menu.flatMap((category) => category.items.map((item) => ({ ...item, category: category.name })));

  const filteredItems = allItems.filter((item) => {
    if (query && !`${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (onlyAvailable && !item.available) return false;
    if (categoryId && item.category_id !== categoryId) return false;
    return true;
  });

  async function runServerSearch() {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (onlyAvailable) params.set('available', 'true');
    if (categoryId) params.set('category_id', categoryId);
    const response = await fetch(`${apiBase}/menu/search?${params.toString()}`);
    const results = await response.json();
    alert(`Server search matched ${results.length} items.`);
  }

  return (
    <Layout title="Menu" subtitle="Filter by preference and discover your next favourite.">
      <section className="filters">
        <div className="inline">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dish name or ingredient" />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <label className="inline">
            <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
            Available only
          </label>
          <button type="button" onClick={runServerSearch}>Validate search API</button>
        </div>
      </section>

      <section className="card-grid section">
        {filteredItems.map((item) => (
          <article className="card" key={item.id}>
            <h3>{item.name}</h3>
            <p className="meta">{item.category}</p>
            <p>{item.description}</p>
            <p>₹{item.price}</p>
            <span className={`badge ${item.available ? 'badge-ok' : 'badge-bad'}`}>
              {item.available ? 'Available' : 'Out of stock'}
            </span>
          </article>
        ))}
      </section>

      <h2>Scan Menu QR</h2>
      <div dangerouslySetInnerHTML={{ __html: qr }} />
    </Layout>
  );
}
