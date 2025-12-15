import { Schema, model, models, Document, Types } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event ID is required"],
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            validate: {
                validator: (v: string) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(v);
                },
                message: "Invalid email format",
            },
        },
    },
    {
        timestamps: true,
    }
);

BookingSchema.pre("save", async function () {
    const booking = this as IBooking;

    if (booking.isModified("eventId") || booking.isNew) {
        const eventExists = await Event.findById(booking.eventId);
        if (!eventExists) {
            throw new Error("Event does not exist");
        }
    }
});

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
