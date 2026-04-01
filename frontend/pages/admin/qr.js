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
      <Layout title="QR Code">
        <div dangerouslySetInnerHTML={{ __html: qr }} />
        <p>Print this QR and place it on tables and storefront.</p>
      </Layout>
    </AdminGuard>
  );
}
