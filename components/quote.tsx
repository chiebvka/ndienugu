export default function Quote() {
    return (
      <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,rgba(28,165,94,0.1),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-[rgb(28,165,94)]/10 ring-1 ring-[rgb(28,165,94)]/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="relative h-24 w-24 mx-auto rounded-full bg-white p-1 ring-1 ring-enugu">
            <img
              alt="Company Logo"
              src="/hat.png"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <figure className="mt-10">
            <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
              <p>
                "Nwanne di na mba – Ọ dị mkpa ijikọta aka n’iru."
              </p>
            </blockquote>
            <figcaption className="mt-10">
          
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900">A wise man</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }