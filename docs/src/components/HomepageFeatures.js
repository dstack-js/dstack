import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('../../static/img/logo_white.svg').default,
    description: (
      <>
        DStack was designed from the ground up to be easily installed and
        used to built decentralized apps quickly.
      </>
    ),
  },
  {
    title: 'Powered by Gun.js',
    Svg: require('../../static/img/gun.svg').default,
    description: (
      <>
        Gun.js is an open source decentralized distributed graph database engine.
      </>
    ),
  },
  {
    title: 'TypeScript Support',
    Svg: require('../../static/img/Typescript_logo_2020.svg').default,
    description: (
      <>
        Built using TypeScript and includes type definition in every module.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
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
