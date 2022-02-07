import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('../../static/img/logo_white.svg').default,
    description: (
      <>
        DStack was designed from the ground up to be easily installed and used
        zero configuration
      </>
    ),
  },
  {
    title: 'Powered by IPFS',
    Svg: require('../../static/img/ipfs.svg').default,
    description: (
      <>
        DStack simplifies IPFS JavaScript API for application development usage
      </>
    ),
  },
  {
    title: 'Under construction',
    Svg: require('../../static/img/Under_construction.svg').default,
    description: (
      <>
        In an active development <br /> Highly experimental as of a moment
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
