import PageHeader from '@/components/page-header'
import React from 'react'
import Feedwizard from '../_components/feed-wizard'

type Props = {}

export default function page({}: Props) {
  return (
    <div className="container mx-auto px-4 py-12">
          <PageHeader
            title="Memebers Feed"
            description="Latest Posts from the community"
        />
        <div className="max-w-6xl mx-auto">
            <Feedwizard />
        </div>
    </div>
  )
}