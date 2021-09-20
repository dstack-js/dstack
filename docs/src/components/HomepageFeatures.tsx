// eslint-disable-next-line no-use-before-define
import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'

type FeatureItem = {
  title: string;
  image: string;
  // eslint-disable-next-line no-undef
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    image: '/img/easy-to-use.svg',
    description: (
      <>
        DStack provides easy to understand and use of API for JavaScript/TypeScript
      </>
    )
  },
  {
    title: 'Powered by Gun.js',
    image: 'https://gun.eco/media/gun.svg',
    description: (
      <>
        GUN is a small, easy, and fast protocol for syncing data.
      </>
    )
  }
]

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-undef
export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((properties, index) => (
            <Feature key={index} {...properties} />
          ))}
        </div>
      </div>
    </section>
  )
}
