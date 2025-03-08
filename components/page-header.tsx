interface PageHeaderProps {
    title: string
    description: string
  }
  
  export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
    )
  }
  
  