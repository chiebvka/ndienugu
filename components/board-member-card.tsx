"use client"

import Image from "next/image"
import type { BoardMember } from "@/types"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"

interface BoardMemberCardProps {
  member: BoardMember
}

export default function BoardMemberCard({ member }: BoardMemberCardProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border">
        <CardItem translateZ="100" className="w-full relative h-64">
          <Image 
            src={member.imageUrl || "/placeholder.svg"} 
            alt={member.name} 
            fill 
            className="object-contain rounded-xl group-hover/card:shadow-xl" 
          />
        </CardItem>
        <CardItem translateZ="50" className="mt-4">
          <h3 className="text-xl font-bold text-neutral-600 dark:text-white">{member.name}</h3>
        </CardItem>
        <CardItem translateZ="60" className="text-primary font-medium mt-2">
          {member.position}
        </CardItem>
        <CardItem as="p" translateZ="80" className="text-neutral-500 text-sm mt-4 dark:text-neutral-300">
          {member.bio}
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}

