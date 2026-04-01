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
      <Layout title="Restaurant Info">
        <pre>{JSON.stringify(info, null, 2)}</pre>
      </Layout>
    </AdminGuard>
  );
}
