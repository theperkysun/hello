import Layout from '../components/Layout';

export async function getStaticProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [infoRes, featuredRes, reviewRes] = await Promise.all([
    fetch(`${base}/restaurant/info`),
    fetch(`${base}/menu/highlights?limit=4`),
    fetch(`${base}/reviews`)
  ]);

  const [info, featuredMenu, reviews] = await Promise.all([infoRes.json(), featuredRes.json(), reviewRes.json()]);

  return {
    props: { info, featuredMenu, reviews },
    revalidate: 120
  };
}

export default function Home({ info, featuredMenu, reviews }) {
  return (
    <Layout title="Fresh food. Crafted fast." subtitle="Experience flavour-first dining built for modern guests.">
      <p className="meta">{info.story}</p>
      <section className="section">
        <h2>Popular right now</h2>
        <div className="card-grid">
          {featuredMenu.map((item) => (
            <article className="card" key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>₹{item.price}</strong>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Guest feedback</h2>
        <div className="card-grid">
          {reviews.map((review) => (
            <article className="card" key={review.name}>
              <strong>{review.name}</strong>
              <p>{'★'.repeat(review.rating)}</p>
              <p className="meta">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
