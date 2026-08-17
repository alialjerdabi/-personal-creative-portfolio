import { getImageProps } from "next/image";

/**
 * The room, cover-fitted to whatever it is put inside.
 *
 * Shared by the hero and the museum since 2026-08-17. They are the same
 * room at two moments — the hero is the hall with the screen still dark,
 * the museum is the hall once the film is running — so they cannot be
 * allowed to drift to two different crops or two different files.
 *
 * `getImageProps` rather than two <Image> elements: the browser picks the
 * orientation from <source> before anything is fetched, so a phone never
 * downloads the 1672px landscape render to then not use it.
 */
export default function HallRender({ priority = false }: { priority?: boolean }) {
  const shared = {
    alt: "",
    fill: true,
    sizes: "100vw",
    quality: 90,
    priority,
  } as const;

  const {
    props: { srcSet: wideSrcSet, ...wideProps },
  } = getImageProps({ ...shared, src: "/hall/wide.jpg" });
  const {
    props: { srcSet: tallSrcSet },
  } = getImageProps({ ...shared, src: "/hall/tall.jpg" });

  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={tallSrcSet} />
      <source media="(orientation: landscape)" srcSet={wideSrcSet} />
      <img {...wideProps} alt="" aria-hidden="true" className="object-cover" />
    </picture>
  );
}
