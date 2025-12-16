import { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: Date;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        overview: {
            type: String,
            required: [true, "Overview is required"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Image is required"],
        },
        venue: {
            type: String,
            required: [true, "Venue is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
        },
        time: {
            type: String,
            required: [true, "Time is required"],
        },
        mode: {
            type: String,
            required: [true, "Mode is required"],
            enum: {
                values: ["online", "offline", "hybrid"],
                message: "Mode must be online, offline, or hybrid",
            },
        },
        audience: {
            type: String,
            required: [true, "Audience is required"],
            trim: true,
        },
        agenda: {
            type: [String],
            required: [true, "Agenda is required"],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "Agenda must have at least one item",
            },
        },
        organizer: {
            type: String,
            required: [true, "Organizer is required"],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, "Tags are required"],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "Tags must have at least one item",
            },
        },
    },
    {
        timestamps: true,
    }
);

EventSchema.pre("save", function () {
    const event = this as IEvent;

    if (event.isModified("title") || event.isNew) {
        event.slug = event.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    if (event.isModified("date") || event.isNew) {
        const date = new Date(event.date);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }
        date.setUTCHours(0, 0, 0, 0);
        event.date = date;
    }

    if (event.isModified("time")) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(event.time.trim())) {
            throw new Error("Time must be in HH:MM format (24-hour)");
        }
        event.time = event.time.trim();
    }
});

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
