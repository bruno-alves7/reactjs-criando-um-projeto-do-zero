import Link from 'next/link';
import Image from 'next/image';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <Link href="/">
        <div>
          <Image src="/logo.png" alt="logo" width="239" height="26" />
        </div>
      </Link>
    </header>
  );
}
