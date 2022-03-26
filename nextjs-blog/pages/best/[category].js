import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

export async function getStaticPaths() {

  // We need to fetch all of the categories from our DB
  const res = await fetch('http://localhost:6400/products/categories')
  const categories = await res.json()

  // We need to adhere to the Next.js getStaticPaths structure
  // https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
  let paths = categories.map((x)=>{return{'params': {'category': x}}})

  // For blocking see: https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({params}) {

  // Let's fetch the latest top ranking items in a category from our DB
  const res = await fetch(`http://localhost:6400/products/category/${params.category}`)
  const products = await res.json()

  // Let's pick the 5 best ranked ones
  const topProducts = products.sort((a,b) => b.rating - a.rating).slice(0, 5);

  // Every time we statically generate this page we will have the time-stamped.
  const stats = new Date().toISOString()

  return { 
    props: { stats: stats, topProducts },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export default function Best(props) {
  const router = useRouter()
  const { category } = router.query
  const stats = props.stats;
  const products = props.topProducts;
  let i = 0;

  return (
    <div className="container">
      <Head>
        <title>10 Best {category} Products</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NextSeo
        title={`10 Best ${category} Products`}
        description={`10 Best ${category} Products for bestecommerce.com updated daily.`}
      />

      <main>
        <h1 className="title">
          10 Best {category} Products
        </h1>

        <p className="description">
          These are our best products for the {category}, <br /> Updated at: {stats}
        </p>

        <div className="grid">
          { products.map(product => {
            return (<a href="#" key={i++} className="card">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p><i>Price: ${product.price}, with rating of: {product.rating}/100</i></p>
            </a>)
          })}
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 95%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
