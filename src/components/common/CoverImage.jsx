import React, { useState } from "react";
import { BookOpen } from "lucide-react";

function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Fallback placeholder shown when image is missing or failed to load.
 */
function CoverFallback({ containerClassName, fallbackIconSize }) {
  return (
    <div
      className={`bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center shadow-sm ${containerClassName}`}
    >
      <BookOpen size={fallbackIconSize} className="text-blue-600" />
    </div>
  );
}

/**
 * CoverImage
 * Renders a book cover image with a pulsing skeleton while loading,
 * a smooth fade-in on load, and a BookOpen fallback on error or missing src.
 *
 * Props:
 *  src               - image URL (unsafe URLs are treated as empty)
 *  alt               - alt text
 *  containerClassName - classes applied to the wrapper div (should define width & height)
 *  imgClassName      - classes applied to the <img> element
 *  showFallback      - whether to show the BookOpen placeholder when src is missing/errored
 *  fallbackIconSize  - size of the BookOpen icon in the fallback (default: 20)
 */
export default function CoverImage({
  src,
  alt = "Book cover",
  containerClassName = "",
  imgClassName = "",
  showFallback = false,
  fallbackIconSize = 20,
}) {
  const safeSrc = src && isSafeUrl(src) ? src : null;
  const [status, setStatus] = useState(safeSrc ? "loading" : "empty");
  const [prevSafeSrc, setPrevSafeSrc] = useState(safeSrc);

  // Inline derived state: reset status when src changes (avoids useEffect setState)
  if (prevSafeSrc !== safeSrc) {
    setPrevSafeSrc(safeSrc);
    setStatus(safeSrc ? "loading" : "empty");
  }

  if (status === "empty" || status === "error") {
    return showFallback ? (
      <CoverFallback
        containerClassName={containerClassName}
        fallbackIconSize={fallbackIconSize}
      />
    ) : null;
  }

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Pulsing skeleton shown while loading */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}

      {/* Image fades in once loaded */}
      <img
        src={safeSrc}
        alt={alt}
        className={`relative ${imgClassName} transition-opacity duration-300 ${
          status === "loading" ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}
