import Layout from '../components/Layout';

export async function getStaticProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [infoRes, menuRes] = await Promise.all([
    fetch(`${base}/restaurant/info`),
    fetch(`${base}/menu?featured=true`)
  ]);

  const [info, featuredMenu] = await Promise.all([infoRes.json(), menuRes.json()]);

  return {
    props: { info, featuredMenu },
    revalidate: 120
  };
}

export default function Home({ info, featuredMenu }) {
  return (
    <Layout title="Fresh food. Crafted fast.">
      <p>{info.story}</p>
      <section className="card-grid">
        {featuredMenu.flatMap((c) => c.items).slice(0, 4).map((item) => (
          <article className="card" key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <strong>₹{item.price}</strong>
          </article>
        ))}
      </section>
    </Layout>
  );
}
