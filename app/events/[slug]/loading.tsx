export default function EventDetailLoading() {
    return (
        <section id="event" className="py-2">
            <div className="header mb-4">
                <div className="h-16 w-3/4 bg-dark-100 rounded-lg animate-pulse mb-4" />
                <div className="h-6 w-full bg-dark-100 rounded-lg animate-pulse" />
            </div>

            <div className="details">
                <div className="content">
                    <div className="banner mb-3 h-[457px] w-full bg-dark-100 rounded-lg animate-pulse" />

                    <div className="flex-col-gap-2 mb-3">
                        <div className="h-8 w-32 bg-dark-100 rounded-lg animate-pulse mb-2" />
                        <div className="h-20 w-full bg-dark-100 rounded-lg animate-pulse" />
                    </div>

                    <div className="flex-col-gap-2 mb-3">
                        <div className="h-8 w-40 bg-dark-100 rounded-lg animate-pulse mb-2" />
                        <div className="flex flex-col gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-6 w-full bg-dark-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>

                    <div className="flex-col-gap-2 mb-6">
                        <div className="h-8 w-24 bg-dark-100 rounded-lg animate-pulse mb-2" />
                        <div className="flex flex-row flex-wrap gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 w-20 bg-dark-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>

                    <div className="h-12 w-full max-w-md bg-dark-100 rounded-lg animate-pulse" />
                </div>
            </div>
        </section>
    );
}
