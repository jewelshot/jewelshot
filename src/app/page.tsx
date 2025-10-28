/**
 * Root Page
 *
 * Redirects to Studio page.
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/studio');
}
