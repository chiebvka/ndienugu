"use client"

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
    bio: "Dr. Taylor specializes in community health initiatives and public policy.",
    imageUrl: "https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byI9k0UfYv0RHXMStF2xwJl135UhbEgNGyAKDr?height=300&width=300",
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

