"use client"

import Image from "next/image"
import type { BoardMember } from "@/types"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BoardMemberCardProps {
  member: BoardMember
  truncateBioLength?: number
}

export default function BoardMemberCard({ member, truncateBioLength = 280 }: BoardMemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canTruncate, setCanTruncate] = useState(true);

  useEffect(() => {
    setCanTruncate(member.bio.length > truncateBioLength);
    setIsExpanded(false);
  }, [member.bio, truncateBioLength]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedBio = canTruncate && !isExpanded 
    ? `${member.bio.substring(0, truncateBioLength)}...` 
    : member.bio;

  return (
    <CardContainer className="inter-var h-full">
      <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-full rounded-xl p-6 border flex flex-col">
        <CardItem translateZ="100" className="w-full relative h-60 sm:h-72">
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
        <div className="flex-grow flex flex-col justify-between">
          <CardItem 
            as="p" 
            translateZ="80" 
            className={`text-neutral-500 text-sm mt-4 dark:text-neutral-300 flex-grow ${!isExpanded && canTruncate ? 'min-h-[105px] max-h-[105px] overflow-hidden' : 'min-h-[105px]'}`}
          >
            {displayedBio}
          </CardItem>
          {canTruncate && (
            <CardItem translateZ="80" className="mt-4">
              <Button onClick={toggleExpansion} variant="link" className="text-enugu p-0 h-auto">
                {isExpanded ? "Read less" : "Read more"}
              </Button>
            </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  )
}

