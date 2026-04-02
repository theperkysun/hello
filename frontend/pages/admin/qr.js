import Layout from '../../components/Layout';
import AdminGuard from '../../components/AdminGuard';

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const qr = await fetch(`${base}/qr/menu?format=svg&size=220`).then((r) => r.text());
  return { props: { qr } };
}

export default function QrPage({ qr }) {
  return (
    <AdminGuard>
      <Layout title="QR Code" subtitle="Print-ready code for table tents and storefront signage.">
        <div className="card" dangerouslySetInnerHTML={{ __html: qr }} />
        <p className="meta">Recommendation: laminate and place at all dine-in touchpoints.</p>
      </Layout>
    </AdminGuard>
  );
}
