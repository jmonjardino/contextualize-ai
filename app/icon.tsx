import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** The wordmark's mark: three indexed points, one lit. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fbf9f5",
          borderRadius: 6,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
          <rect x="0.6" y="0.6" width="20.8" height="20.8" rx="3.4" stroke="#17140f" strokeWidth="1.4" />
          <path d="M6.2 15.2L11 6.9l4.8 6.4" stroke="#17140f" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="6.2" cy="15.2" r="2.2" fill="#b2492a" />
          <circle cx="11" cy="6.9" r="1.8" fill="#17140f" />
          <circle cx="15.8" cy="13.3" r="1.8" fill="#17140f" />
        </svg>
      </div>
    ),
    size,
  );
}
