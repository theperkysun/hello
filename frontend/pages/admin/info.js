import Layout from '../../components/Layout';
import AdminGuard from '../../components/AdminGuard';

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const info = await fetch(`${base}/restaurant/info`).then((r) => r.json());
  return { props: { info } };
}

export default function AdminInfo({ info }) {
  return (
    <AdminGuard>
      <Layout title="Restaurant Info" subtitle="Canonical details used across customer touchpoints.">
        <div className="card-grid">
          <article className="card"><h3>Name</h3><p>{info.name}</p></article>
          <article className="card"><h3>Address</h3><p>{info.address}</p></article>
          <article className="card"><h3>Phone</h3><p>{info.phone}</p></article>
          <article className="card"><h3>Email</h3><p>{info.email}</p></article>
        </div>
        <section className="section card">
          <h3>Hours</h3>
          <pre>{JSON.stringify(info.hours, null, 2)}</pre>
        </section>
      </Layout>
    </AdminGuard>
  );
}
