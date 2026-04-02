import Layout from '../components/Layout';

export async function getStaticProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${base}/restaurant/info`);
  const info = await res.json();
  return { props: { info }, revalidate: 300 };
}

export default function Contact({ info }) {
  return (
    <Layout title="Contact" subtitle="Reservations, catering, and private events.">
      <div className="card">
        <p><strong>Address:</strong> {info.address}</p>
        <p><strong>Phone:</strong> {info.phone}</p>
        <p><strong>Email:</strong> {info.email}</p>
      </div>
      <h2>Hours</h2>
      <div className="card-grid">
        {Object.entries(info.hours).map(([day, value]) => (
          <article key={day} className="card">
            <strong>{day}</strong>
            <p>{value}</p>
          </article>
        ))}
      </div>
    </Layout>
  );
}
