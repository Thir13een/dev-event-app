export default function BookEventLoading() {
    return (
        <section id="book-event">
            <div className="mb-6">
                <div className="h-12 w-64 bg-dark-100 rounded-lg animate-pulse mb-3" />
                <div className="h-6 w-96 bg-dark-100 rounded-lg animate-pulse" />
            </div>

            <div className="bg-dark-100 border-dark-200 card-shadow rounded-[10px] border p-6 mb-6">
                <div className="flex flex-col gap-4">
                    <div className="h-8 w-3/4 bg-dark-200 rounded-lg animate-pulse" />

                    <div className="flex flex-col gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-5 w-5 bg-dark-200 rounded animate-pulse" />
                                <div className="h-5 w-48 bg-dark-200 rounded-lg animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-dark-100 border-dark-200 card-shadow rounded-[10px] border p-6">
                <div className="h-6 w-48 bg-dark-200 rounded-lg animate-pulse mb-4" />
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-32 bg-dark-200 rounded-lg animate-pulse" />
                        <div className="h-10 w-full bg-dark-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-12 w-full bg-dark-200 rounded-lg animate-pulse" />
                </div>
            </div>
        </section>
    );
}
