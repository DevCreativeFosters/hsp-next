import Article from './article';
import Carousel from './carousel';
import FeaturedArticle from './featured-article';
import Button from '@components/button';
import { lifestyle } from '@mockup/lifestyle';
import styles from './lifestyle.module.scss';

export default function Lifestyle() {
  const {
    title: sectionTitle,
    description: sectionDescription,
    featured,
    articles,
  } = lifestyle;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sectionIntro}>
          <h2 className={styles.componentTitle}>{sectionTitle}</h2>
          <div className={styles.description}>{sectionDescription}</div>
          <div className={styles.buttons}>
            <Button variant="quinary" rightIcon="arrow-forward">
              HSP TV
            </Button>
            <Button variant="quinary" rightIcon="arrow-forward">
              HSP Blog
            </Button>
            <Button>All stories</Button>
          </div>
        </div>

        <FeaturedArticle
          title={featured.title}
          content={featured.content}
          createdAt={featured.createdAt}
          tags={featured.tags}
          image={featured.image}
        />

        <Carousel items={articles} itemTemplate={Article} />
      </div>
    </>
  );
}
