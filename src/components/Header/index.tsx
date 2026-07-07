import Link from 'next/link';
import Image from 'next/image';

import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <Link href="/">
        <div>
          <Image src="/logo.svg" alt="logo" width="239" height="26" priority />
        </div>
      </Link>
    </header>
  );
}
