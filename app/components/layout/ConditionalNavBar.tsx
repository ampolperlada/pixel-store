'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Hide navbar on these pages
  const hideNavbarPages = ['/create', '/games'];
  
  if (hideNavbarPages.includes(pathname)) {
    return null;
  }
  
  return <NavBar />;
}