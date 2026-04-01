import Layout from '../../components/Layout';
import AdminGuard from '../../components/AdminGuard';

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const menu = await fetch(`${base}/menu`).then((r) => r.json());
  return { props: { menu } };
}

export default function AdminMenu({ menu }) {
  return (
    <AdminGuard>
      <Layout title="Menu Management">
        {menu.map((category) => (
          <section key={category.id} className="section">
            <h2>{category.name}</h2>
            <table className="table">
              <thead><tr><th>Name</th><th>Price</th><th>Status</th></tr></thead>
              <tbody>
                {category.items.map((item) => (
                  <tr key={item.id}><td>{item.name}</td><td>₹{item.price}</td><td>{item.available ? 'Available' : 'Unavailable'}</td></tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </Layout>
    </AdminGuard>
  );
}
