import type { BoardMember } from "@/types"
import BoardMemberCard from "@/components/board-member-card"
import PageHeader from "@/components/page-header"


const boardMembers: BoardMember[] = [
  {
    id: 1,
    name: "Frank Anozie",
    position: "Chairman",
    bio: "Frank Anozie has over 20 years of experience in community development and organizational leadership.",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byt41x6vYAYGMZhqz53JlC0TvO7obQiruE6Afj?height=300&width=300",
  },
  {
    id: 2,
    name: "Uche Okwu",
    position: " Financial Secretary",
    bio: "Uche Okwu is an expert in sustainable development with numerous publications in the field.",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19by7ojzeSfmbqWtgRVMUz3u1YEin6B08TsrwLCP?height=300&width=300",
  },
  {
    id: 3,
    name: "Chukwudi Orji",
    position: "Treasurer",
    bio: "Chukwudi Orji brings valuable administrative expertise from her years in public service.",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19by8uLzCP402LKQ3PMoVdSlRqXk67eCJit4HF9B?height=300&width=300",
  },
  {
    id: 4,
    name: "Romanus Eze",
    position: "Secretary",
    bio: "Romanus Eze has extensive experience in financial management and corporate governance.",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19bycBpMzoTLp7NMbw0sOJUx6CKTmSXByEAgqYRH?height=300&width=300",
  },
  {
    id: 5,
    name: "Nnamdi Edeh",
    position: "Provost",
    bio: "Nnamdi Edeh is a respected engineer, humanitarian, and community leader who currently serves as the Provost of the Ndi Enugu Association. He is widely known for his dedication to grassroots development and transparent governance. Leveraging his engineering background, he supports sustainable infrastructure projects and youth empowerment initiatives. Edeh's humanitarian efforts focus on poverty alleviation, education, and healthcare accessibility. In his role as Provost, he fosters unity and cultural pride among the Enugu diaspora, while promoting inclusive leadership and community-driven development. A strong advocate for good governance, he encourages active civic participation and transparency in leadership. His multifaceted work continues to inspire positive change, accountability, and resilience within society.",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19by5PPKJ9JSPtjYROonfQiEIyVMslgCKcrWvub0?height=300&width=300",
  }
]

export default function BoardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="Executive Members"
        description="Meet the dedicated individuals who guide our organization's mission and vision."
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-12">
          {boardMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-center">
              <BoardMemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Executive Members | NDI ENUGU SCOTLAND ASSOCIATION",
  description: "Meet the dedicated executive members guiding Ndi Enugu Scotland Association's mission and vision.",
  openGraph: {
    title: "Executive Members | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Meet the dedicated executive members guiding Ndi Enugu Scotland Association's mission and vision.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NDI ENUGU SCOTLAND ASSOCIATION Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Executive Members | NDI ENUGU SCOTLAND ASSOCIATION",
    description: "Meet the dedicated executive members guiding Ndi Enugu Scotland Association's mission and vision.",
    images: ["/opengraph-image.png"],
  },
};

