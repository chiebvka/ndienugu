import Bento from "@/components/bento";
import Features from "@/components/features";
import Hero from "@/components/hero";
import Join from "@/components/join";
import Quote from "@/components/quote";

export default async function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Bento />
      <Quote />
      <Join />
      {/* <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}
    </>
  );
}

export const metadata = {
  title: "Home | NDI ENUGU SCOTLAND ASSOCIATION",
  description: "Welcome to Ndi Enugu Scotland Association. Discover our mission, events, projects, and how to join our vibrant community.",
  openGraph: {
    title: "Home | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Welcome to Ndi Enugu Scotland Association. Discover our mission, events, projects, and how to join our vibrant community.",
    images: [
      {
        url: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byaNmwnIeurKPAgOI4q9yf6jGYEhoxJHTkLC2N",
        width: 1200,
        height: 630,
        alt: "NDI ENUGU SCOTLAND ASSOCIATION Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Welcome to Ndi Enugu Scotland Association. Discover our mission, events, projects, and how to join our vibrant community.",
    images: ["https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byaNmwnIeurKPAgOI4q9yf6jGYEhoxJHTkLC2N"],
  },
};
