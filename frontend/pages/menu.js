import Layout from '../components/Layout';

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [menuRes, qrRes] = await Promise.all([
    fetch(`${base}/menu`),
    fetch(`${base}/qr/menu?format=svg`)
  ]);

  const menu = await menuRes.json();
  const qr = await qrRes.text();

  return { props: { menu, qr } };
}

export default function MenuPage({ menu, qr }) {
  return (
    <Layout title="Menu">
      {menu.map((category) => (
        <section key={category.id} className="section">
          <h2>{category.name}</h2>
          <div className="card-grid">
            {category.items.map((item) => (
              <article className="card" key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>₹{item.price}</p>
                <small>{item.available ? 'Available' : 'Out of stock'}</small>
              </article>
            ))}
          </div>
        </section>
      ))}
      <h2>Scan Menu QR</h2>
      <div dangerouslySetInnerHTML={{ __html: qr }} />
    </Layout>
  );
}
