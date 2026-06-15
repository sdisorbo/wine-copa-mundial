/**
 * Image slot placeholder. Renders a solid dark block with a centered label.
 *
 * To swap in a real image later, replace the inner <div> with next/image:
 *
 *   import Image from "next/image";
 *   <Image src="/images/hero.jpg" alt={label} fill className="object-cover" />
 *
 * (Drop your files into /public/images/ and point `src` at them.)
 */
export default function Placeholder({
  label,
  className = "",
  ratio = "aspect-video",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`relative w-full ${ratio} bg-inkdeep hairline overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] uppercase tracking-cinematic text-bone/30">
          {label}
        </span>
      </div>
    </div>
  );
}
