import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const shouldApply = process.argv.includes("--apply");

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
}

const formatId = (id) => (id ? id.toString() : "unknown");

const run = async () => {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    const collection = mongoose.connection.collection("bookings");

    const duplicates = await collection
        .aggregate([
            {
                $group: {
                    _id: { eventId: "$eventId", email: "$email" },
                    ids: { $push: { _id: "$_id", createdAt: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $match: { count: { $gt: 1 } } },
        ])
        .toArray();

    if (duplicates.length === 0) {
        console.log("No duplicate bookings found.");
        return;
    }

    console.log(`Found ${duplicates.length} duplicate booking group(s).`);
    let totalDeletes = 0;

    for (const group of duplicates) {
        const sorted = [...group.ids].sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return aTime - bTime;
        });
        const keep = sorted[0];
        const deleteIds = sorted.slice(1).map((item) => item._id);

        console.log(
            `eventId=${formatId(group._id.eventId)} email=${group._id.email} keep=${formatId(keep?._id)} delete=${deleteIds.length}`
        );

        if (shouldApply && deleteIds.length > 0) {
            const result = await collection.deleteMany({ _id: { $in: deleteIds } });
            totalDeletes += result.deletedCount ?? 0;
        }
    }

    if (shouldApply) {
        console.log(`Deleted ${totalDeletes} duplicate booking(s).`);
    } else {
        console.log("Dry run only. Re-run with --apply to delete duplicates.");
    }
};

run()
    .catch((error) => {
        console.error("Failed to dedupe bookings:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
