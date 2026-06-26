"use client";

import { useEffect, useRef } from "react";
import type { MediaBlock, MediaSpec } from "../../_data/stationen";

/**
 * MediaBlockView — Medien-Renderer (YouTube / Audio / SRF / Placeholder), shared.
 *
 * Aus Station.tsx extrahiert (Handoff §3/§6). Wird von Station, Auftakt und
 * Maschinenraum genutzt. Reine MD3-Tokens, Material Symbols, kein Eszett.
 *
 * Bekannte Grenze (Handoff §6.1/§12): YouTube-&end und SRF-startTime liefern
 * keinen zuverlässigen harten Stopp — der Clip startet am Punkt und läuft
 * weiter; die Caption nennt das Fenster. Audio stoppt hart via timeupdate.
 */

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MediaPlaceholder({ spec }: { spec: MediaSpec }) {
  return (
    <div className="flex items-center gap-sm rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-[20px] text-tertiary">link_off</span>
      <span>
        Quelle noch zu hinterlegen — <strong>{spec.sourceKey}</strong>, Ausschnitt{" "}
        {fmt(spec.start)}–{fmt(spec.end)} (siehe <code>docs/material-pietro/urls.md</code>).
        {spec.externalUrl && (
          <>
            {" "}
            <a
              href={spec.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              Original ansehen
            </a>
          </>
        )}
      </span>
    </div>
  );
}

function YouTubeClip({ spec }: { spec: MediaSpec }) {
  if (!spec.youtubeId || spec.youtubeId === "TODO") return <MediaPlaceholder spec={spec} />;
  // Hinweis: für einen harten Stopp am Ende ist die IFrame Player API
  // zuverlässiger als der &end-Parameter — fürs MVP genügt der Param.
  const url = `https://www.youtube-nocookie.com/embed/${spec.youtubeId}?start=${spec.start}&end=${spec.end}&rel=0`;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-outline-variant">
      <iframe
        src={url}
        title={spec.title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

function SrfClip({ spec }: { spec: MediaSpec }) {
  if (!spec.urn) return <MediaPlaceholder spec={spec} />;
  // Verifiziertes Embed-Muster (Handoff §6.1): kennt startTime, aber kein
  // zuverlässiges hartes Ende — Caption nennt das Fenster.
  const url = `https://www.srf.ch/play/embed?urn=${encodeURIComponent(spec.urn)}&startTime=${spec.start}&subdivisions=false`;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-outline-variant">
      <iframe
        src={url}
        title={spec.title}
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

function AudioClip({ spec }: { spec: MediaSpec }) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onLoaded = () => {
      if (spec.start) el.currentTime = spec.start;
    };
    const onTime = () => {
      if (spec.end && el.currentTime >= spec.end) el.pause();
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [spec]);

  if (!spec.src) return <MediaPlaceholder spec={spec} />;
  return <audio ref={ref} src={spec.src} controls preload="metadata" className="w-full" />;
}

function MediaItem({ spec }: { spec: MediaSpec }) {
  if (spec.kind === "youtube") return <YouTubeClip spec={spec} />;
  if (spec.kind === "srf") return <SrfClip spec={spec} />;
  return <AudioClip spec={spec} />;
}

export default function MediaBlockView({ block }: { block: MediaBlock }) {
  return (
    <div className="flex flex-col gap-md">
      {block.intro && (
        <p className="border-l-4 border-primary pl-md text-body-lg text-on-surface-variant">
          {block.intro}
        </p>
      )}
      {block.media.map((m, i) => (
        <figure key={i} className="flex flex-col gap-xs">
          <MediaItem spec={m} />
          <figcaption className="text-label-sm text-on-surface-variant">
            {m.title} · {fmt(m.start)}–{fmt(m.end)}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
