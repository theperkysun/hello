import Layout from '../../components/Layout';
import AdminGuard from '../../components/AdminGuard';

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [summary, reviews] = await Promise.all([
    fetch(`${base}/dashboard/summary`).then((r) => r.json()),
    fetch(`${base}/reviews`).then((r) => r.json())
  ]);

  return { props: { summary, reviews } };
}

export default function Dashboard({ summary, reviews }) {
  return (
    <AdminGuard>
      <Layout title="Admin Dashboard" subtitle="Live operational snapshot for service teams.">
        <div className="card-grid section">
          <article className="card"><h3>Categories</h3><p>{summary.categories}</p></article>
          <article className="card"><h3>Total Items</h3><p>{summary.total_items}</p></article>
          <article className="card"><h3>Available Items</h3><p>{summary.available_items}</p></article>
          <article className="card"><h3>Avg Ticket (Mock)</h3><p>₹{summary.avg_ticket}</p></article>
        </div>
        <section>
          <h2>Recent Reviews</h2>
          <div className="card-grid">
            {reviews.map((review) => (
              <article className="card" key={`${review.name}-${review.comment}`}>
                <strong>{review.name}</strong>
                <p>{'★'.repeat(review.rating)}</p>
                <p className="meta">{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      </Layout>
    </AdminGuard>
  );
}
