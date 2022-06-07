import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Logo from '../../static/img/logo.svg';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Logo className={clsx('hero--logo', styles.heroLogo)} />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Get started ⚡️
          </Link>
        </div>
        <br />
        <details>
          <summary className="button button--secondary button--m">
            Watch Presentation 📽
          </summary>

          <iframe
            src="https://pitch.com/embed/5143e1e5-b281-40fd-bddd-164abba626e0"
            allow="fullscreen"
            style={{ marginTop: '10px', borderRadius: '8px' }}
            allowFullScreen={true}
            width="100%"
            height="768"
          />
        </details>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Get Started" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
