import { useRouter } from 'next/router';

export default function WithRouter() {
  const router = useRouter();
  const { id } = router.query;
  return id;
}
