import Layout from '../components/Layout';

export async function getStaticProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${base}/restaurant/info`);
  const info = await res.json();
  return { props: { info }, revalidate: 300 };
}

export default function Contact({ info }) {
  return (
    <Layout title="Contact">
      <p>{info.address}</p>
      <p>{info.phone}</p>
      <p>{info.email}</p>
      <h2>Hours</h2>
      <ul>
        {Object.entries(info.hours).map(([day, value]) => (
          <li key={day}>{day}: {value}</li>
        ))}
      </ul>
    </Layout>
  );
}
