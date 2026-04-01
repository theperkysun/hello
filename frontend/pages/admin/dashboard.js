import Layout from '../../components/Layout';
import AdminGuard from '../../components/AdminGuard';

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const menu = await fetch(`${base}/menu`).then((r) => r.json());
  const items = menu.flatMap((c) => c.items);
  return {
    props: {
      stats: {
        categories: menu.length,
        totalItems: items.length,
        unavailable: items.filter((i) => !i.available).length
      }
    }
  };
}

export default function Dashboard({ stats }) {
  return (
    <AdminGuard>
      <Layout title="Admin Dashboard">
        <div className="card-grid">
          <article className="card"><h3>Categories</h3><p>{stats.categories}</p></article>
          <article className="card"><h3>Total Items</h3><p>{stats.totalItems}</p></article>
          <article className="card"><h3>Out of Stock</h3><p>{stats.unavailable}</p></article>
        </div>
      </Layout>
    </AdminGuard>
  );
}
