import PageHeader from "@/components/page-header"
import Blogfeed from "./_components/blog-feed"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Projects & News"
        description="Stay updated with the latest announcements, projects, and news from our organization."
      />
      <div className="max-w-7xl mx-auto">
        <Blogfeed />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Projects & News | NDI ENUGU SCOTLAND ASSOCIATION",
  description: "Stay updated with the latest announcements, projects, and news from our organization.",
  openGraph: {
    title: "Projects & News | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Stay updated with the latest announcements, projects, and news from our organization.",
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
    title: "Projects & News | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Stay updated with the latest announcements, projects, and news from our organization.",
    images: ["https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byaNmwnIeurKPAgOI4q9yf6jGYEhoxJHTkLC2N"],
  },
};

