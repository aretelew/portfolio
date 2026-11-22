// The home page. It renders on the server (prerendered at build), so it arrives as real HTML and
// paints before any JavaScript runs; the drawings and hover states come alive once it hydrates.
import Home from "./_home/Home";

export default function Page() {
  return <Home />;
}
