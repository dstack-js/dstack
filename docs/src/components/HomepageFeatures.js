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
        used to built semi-decentralized apps quickly, where your product infrastructure is single source of truth
      </>
    ),
  },
  {
    title: 'Powered by GraphQL',
    Svg: require('../../static/img/graphql.svg').default,
    description: (
      <>
        DStack provides a set of graphql elements (scalars, directives, etc) to store and fetch your data on decentralized web
      </>
    ),
  },
  {
    title: 'TypeScript Support',
    Svg: require('../../static/img/Typescript_logo_2020.svg').default,
    description: (
      <>
        Built using TypeScript and includes type definition in every module
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
