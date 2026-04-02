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
      <Layout title="Menu Management" subtitle="Review category health, pricing, and stock status.">
        {menu.map((category) => (
          <section key={category.id} className="section card">
            <h2>{category.name}</h2>
            <p className="meta">{category.description}</p>
            <table className="table">
              <thead><tr><th>Name</th><th>Price</th><th>Status</th><th>Dietary</th></tr></thead>
              <tbody>
                {category.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>{item.available ? 'Available' : 'Unavailable'}</td>
                    <td>{item.dietary_flags.vegetarian ? 'Vegetarian' : 'Regular'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </Layout>
    </AdminGuard>
  );
}
