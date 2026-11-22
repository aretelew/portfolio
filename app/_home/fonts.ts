// IBM Plex: the light serif for the headline, section titles and names, the sans for reading, the
// mono for the small labels. Each sets a CSS variable that home.css uses.
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

const serif = IBM_Plex_Serif({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

/** Put on the page root so its CSS can use the three faces. */
export const fontVars = `${serif.variable} ${sans.variable} ${mono.variable}`;
