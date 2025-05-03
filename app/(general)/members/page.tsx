import Membershipform from '@/components/membership-form'
import PageHeader from '@/components/page-header'
import React from 'react'

type Props = {}

export default function page({}: Props) {
  return (
    <div className="container mx-auto px-4 py-12">
        <PageHeader
            title="Memeberships Application"
            description="Submit your application to become a member and join our community."
        />
        <div className="max-w-7xl mx-auto">
            <Membershipform />
        </div>

    </div>
  )
}