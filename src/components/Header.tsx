import Link from 'next/link';
import styles from '@/styles/header.module.css';

export default function Header() {
  return (
    <header className={styles.header} role="banner" aria-label="Site">
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Baila Kids home">
          <img src="/bailakids/logo.png" alt="Baila Kids" className={styles.logo} />
        </Link>
      </div>
    </header>
  );
}
