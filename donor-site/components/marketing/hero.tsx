import Image from "next/image";

export function Hero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle: React.ReactNode;
  image: string;
  imageAlt: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-12 md:grid-cols-2 md:pt-16 md:pb-20">
      <div>
        {eyebrow && <p className="mb-3 text-sm font-semibold text-primary">{eyebrow}</p>}
        <h1 className="text-4xl leading-tight font-semibold md:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 text-lg text-muted md:text-xl">{subtitle}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>
      </div>
      <Image
        src={image}
        alt={imageAlt}
        width={480}
        height={400}
        priority
        className="mx-auto h-auto w-full max-w-md"
      />
    </section>
  );
}
