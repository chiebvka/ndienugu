import { Church, Clock, Lock, MemoryStick, Newspaper, School, SchoolIcon, Users } from "lucide-react"

const features = [
    {
      name: 'Development',
      description:
        'To facilitate contacts and to promote cultural interaction and understanding among members',
      icon: Newspaper,
    },
    {
      name: 'Community',
      description: 'To promote association and sense of belonging amongst all Igbos of Enugu origin in Aberdeen and Scotland',
      icon: School,
    },
    {
      name: 'Progress',
      description: 'To provide support to members living within Scotland and surrounding communities.',
      icon: Church,
    },
    {
      name: 'Family',
      description: 'To work for the peace and progress of NDI ENUGU and their families in Scotland.',
      icon: Clock,
    },
    {
      name: 'Enlightenment',
      description: 'To promote awareness of the Igbo culture amongst children born to Ndi Enugu families in the UK, whilst encouraging them to play their full role in the wider British society.',
      icon: Lock,
    },
    {
      name: 'Integration',
      description: 'To advance the education of the public in Scotland and its environs, about Igbo history, language, music, art, literature, and culture.',
      icon: SchoolIcon,
    },
    {
      name: 'Collaboration',
      description: ' To foster good relation and collaboration with other organizations and communities with similar interests',
      icon: Users,
    },
    {
      name: 'Membership',
      description: ' To execute, facilitate and promote charitable and non-profit work in Enugu state',
      icon: MemoryStick,
    },
  ]
  
  export default function Features() {
    return (
      <div className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                {/* <h2 className="text-base/7 font-semibold text-enugu">Deploy faster</h2> */}
                <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-enugu sm:text-5xl">
                  Our Goals
                </p>
                <p className="mt-6 text-lg/8 text-gray-600">
                  Here are some of our main goals and objectives
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon aria-hidden="true" className="absolute left-1 top-1 size-5 text-enugu" />
                        {feature.name}
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <img
              alt="Product screenshot"
              src="https://zuelvssw8o.ufs.sh/f/u9RlmOBa19byOm2c1U7A4pmNMSgrf1zCxRLTQlU20qGHjVJX"
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            />
          </div>
        </div>
      </div>
    )
  }