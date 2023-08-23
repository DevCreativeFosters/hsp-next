import Link from 'next/link'
import ArrowForward from '@images/arrow-forward.svg';
import styles from './all-products-link.module.scss'

export default function AllProductsLink({data}) {
  return (
    <Link className={styles.link} href={data.url}>
      {data.title}
      <ArrowForward />
    </Link>
  )
}
