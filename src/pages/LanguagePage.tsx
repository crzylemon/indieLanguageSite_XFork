import { useParams } from "react-router-dom";
import { languages } from "../data/languagesData";
import { motion } from "framer-motion";
import RosRepl from "../components/RosRpel";
import WppRepl from "../components/WppRepl";
import X3Repl from "../components/X3Repl";
import XRepl from "../components/XRepl";
import Navbar from "../components/Navbar";
import "./LanguagePage.css";

export default function LanguagePage() {
  const { slug } = useParams<{ slug: string }>();
  const lang = languages.find((l) => l.slug === slug);

  if (!lang)
    return (
      <>
        <Navbar />
        <main className="container">
          <h1>Language not found 😢</h1>
        </main>
      </>
    );

  return (
    <>
      <Navbar />
      <motion.main
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <article className="language-page-card">
          <img
            src={lang.logo}
            alt={`${lang.name} logo`}
            width={120}
            height={120}
          />
          <h1>{lang.name}</h1>
          <p>{lang.description}</p>

          <nav className="link-buttons">
            {lang.website && (
              <a href={lang.website} target="_blank" rel="noopener noreferrer" className="link-button">
                🌐 Website
              </a>
            )}
            {lang.discord && (
              <a href={lang.discord} target="_blank" rel="noopener noreferrer" className="link-button discord">
                💬 Discord
              </a>
            )}
            {lang.github && (
              <a href={lang.github} target="_blank" rel="noopener noreferrer" className="link-button">
                🐙 GitHub
              </a>
            )}
          </nav>
        </article>

        {/* Show the relevant REPL */}
        {lang.slug === "ros" && <RosRepl />}
        {lang.slug === "wpp" && <WppRepl />}
        {lang.slug === "x3" && <X3Repl />}
        {lang.slug === "x" && <XRepl />}
      </motion.main>
    </>
  );
}
