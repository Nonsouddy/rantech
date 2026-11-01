import Image from "next/image";

export default function ProjectCard({
  title,
  category,
  location,
  year,
  description,
  image,
}: {
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
}) {
  return (
    <article className="group border border-ink/10 bg-white/40 transition-colors hover:border-copper/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 font-mono text-[11px] tracking-wide text-copper">
          {category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between font-mono text-xs text-slate-muted">
          <span>{location}</span>
          <span>{year}</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-muted">{description}</p>
      </div>
    </article>
  );
}