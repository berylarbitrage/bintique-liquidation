import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-primary text-sm font-semibold">404</p>
        <h1 className="mt-2 text-4xl font-semibold">Page not found</h1>
        <p className="text-muted mt-4">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
