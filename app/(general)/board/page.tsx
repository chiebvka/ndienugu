import type { BoardMember } from "@/types"
import BoardMemberCard from "@/components/board-member-card"
import PageHeader from "@/components/page-header"


const boardMembers: BoardMember[] = [
  {
    id: 1,
    name: "Frank Anozie",
    position: "Chairman",
    bio: "Engr Frank Anozie CEng MIET, FS Eng. As the pioneer Chairman of the Association, Frank plays a pivotal role in guiding the group’s mission to serve and uplift the community. An engineer by profession, Frank brings a strong background in problem-solving, project and safety management, and innovation to the role. With over 22 years of professional experience in the engineering field and functional safety, he applies technical expertise and a strategic mindset to community initiatives, fostering growth, sustainability, and collaboration towards undertaking charitable projects. Under Frank leadership, Ndi Enugu Association has launched several impactful projects aimed at improving Ndi Enugu culture and members social welfare. Frank is committed to creating positive change and empowering others through inclusive and forward-thinking leadership.",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byt41x6vYAYGMZhqz53JlC0TvO7obQiruE6Afj?height=300&width=300",
  },
  {
    id: 2,
    name: "Uche Okwu",
    position: " Financial Secretary",
    bio: "Uche Okwu is an experienced investment manager based in Aberdeen, where he lives with his spouse and two children. With a steady, thoughtful approach to finance, he has built a reputation for guiding clients through complex markets with clarity and care. Balancing a demanding career with a strong commitment to family life, he brings both discipline and empathy to his work. Known for prioritizing long-term value and responsible investing, he focuses on strategies that support sustainable growth—for clients and communities alike. Beyond his professional role, Uche is deeply engaged in community and cultural life. He actively supports local initiatives that promote inclusion, education, and cross-cultural understanding. Whether mentoring young professionals, contributing to local forums, or participating in cultural events, he brings a spirit of service and collaboration to everything he does. He is also a quiet advocate for financial literacy, particularly among underserved groups, and enjoys contributing to programs that empower others to take control of their financial futures. Grounded, reliable, and driven by purpose, Uche continues to build a meaningful career shaped by trust, thoughtful leadership, and a commitment to the wider community.",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19by7ojzeSfmbqWtgRVMUz3u1YEin6B08TsrwLCP?height=300&width=300",
  },
  {
    id: 3,
    name: "Chukwudi Orji",
    position: "Treasurer",
    bio: "Chukwudi Orji  BSc Nig, MSc Lagos, MA London, MSc Aberdeen. I am s determined, open and dedicated person who always desire to achieve and excel. I work well independently and play active role in a team, able to lead when required. Communicate effectively with people of all ages and backgrounds, work collaboratively to resolve problems and motivate team members to achieve personal and organisational objectives. I have experience in finance, criminal justice, children and family, homelessness and health. I always employ high interpersonal, liaison, analytical and decision-making skills to multiple functions and continuously seek self development and opportunities to apply knowledge and experience to practice. Born in Kano From Enugu State Residents in Scotland Married with children",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19by8uLzCP402LKQ3PMoVdSlRqXk67eCJit4HF9B?height=300&width=300",
  },
  {
    id: 4,
    name: "Romanus Eze",
    position: "Secretary",
    bio: "Romanus Eze, CEng, MSaRS, FS Eng, is a director and lead consultant at RICCO Engineering Consulting and Management UK Ltd Romanus Eze is a Chartered Engineer with the UK Engineering Council and an accomplished leader in the fields of Process Safety and Technical Safety Engineering. As the Director and Lead Consultant at RICCO Engineering Consulting and Management UK Ltd, he brings decades of technical expertise and strategic insight to diverse sectors including Oil & Gas, Real Estate Development, and Film Industry Investment. Recognised as a subject matter expert and Major Accident Hazard Risk Champion, Romanus has provided specialist consultancy services to several world-class organisations globally. His work ensures safety integrity, risk mitigation, and regulatory compliance across large-scale industrial operations. Romanus is the current secretary of the NESA, where he plays a key role in fostering leadership and cultural engagement through active community initiatives and the timeless wisdom of Igbo proverbs.",
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

