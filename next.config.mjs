/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hides the floating "N" dev badge, which sat on top of the playback controls.
  devIndicators: false,
  async redirects() {
    // Old routes from earlier builds.
    return [
      { source: "/explore", destination: "/concepts", permanent: true },
      { source: "/progress", destination: "/learning", permanent: true },
      { source: "/leaderboard", destination: "/learning", permanent: true },
    ];
  },
};

export default nextConfig;
