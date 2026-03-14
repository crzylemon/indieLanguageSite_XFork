import { motion } from "framer-motion";
import { languages } from "../data/languagesData";
import { Link } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container" role="main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h1 tabIndex={0}>🌐 Indie Language Showcase</h1>
          <section className="language-grid">
            {languages.map((lang) => (
              <article key={lang.slug} className="language-card">
                <img
                  src={lang.logo}
                  alt={`${lang.name} logo`}
                  className="language-logo"
                  loading="lazy"
                  style={lang.slug === "x" ? { borderRadius: 0 } : undefined}
                />
                <h2>{lang.name}</h2>
                <p><strong>{lang.tagline}</strong></p>
                <p>{lang.description}</p>
                <Link
                  to={`/language/${lang.slug}`}
                  className="view-link"
                  aria-label={`View details for ${lang.name}`}
                >
                  View Language →
                </Link>
              </article>
            ))}
          </section>
        </motion.div>
      </main>
    </>
  );
}
