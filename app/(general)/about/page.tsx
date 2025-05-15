import React from 'react';
import PageHeader from '@/components/page-header';
import Aboutfeed from './_components/about-feed';

type Props = {}

export default function page({}: Props) {

  

  return (
    <div className='container mx-auto px-4 py-12'>
        <PageHeader
        title="Our History & Legacy"
        description="The journey of Ndi Enugu Scotland Association - from vision to reality."
      />
      
      <Aboutfeed />
    </div>
  )
}

export const metadata = {
  title: "About | NDI ENUGU SCOTLAND ASSOCIATION",
  description: "Learn about the history, mission, and legacy of Ndi Enugu Scotland Association.",
  openGraph: {
    title: "About | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Learn about the history, mission, and legacy of Ndi Enugu Scotland Association.",
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
    title: "About | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Learn about the history, mission, and legacy of Ndi Enugu Scotland Association.",
    images: ["https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byaNmwnIeurKPAgOI4q9yf6jGYEhoxJHTkLC2N"],
  },
};