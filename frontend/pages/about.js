import Layout from '../components/Layout';

export async function getStaticProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${base}/restaurant/info`);
  const info = await res.json();
  return { props: { info }, revalidate: 300 };
}

export default function About({ info }) {
  return (
    <Layout title="About FoodiesZenith">
      <p>{info.story}</p>
      <ul>
        <li>Farm-to-table ingredients</li>
        <li>Comfort food with modern flavors</li>
        <li>Inclusive options for every diet</li>
      </ul>
    </Layout>
  );
}
