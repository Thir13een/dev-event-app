"use client";

import dayjs from "dayjs";
import DatePicker from "react-datepicker";

type DateTimePickerFieldsProps = {
    date: string;
    time: string;
    onDateChange: (value: string) => void;
    onTimeChange: (value: string) => void;
};

export default function DateTimePickerFields({
    date,
    time,
    onDateChange,
    onTimeChange,
}: DateTimePickerFieldsProps) {
    const dateValue = date ? new Date(`${date}T00:00:00`) : null;
    const timeValue = time ? new Date(`1970-01-01T${time}:00`) : null;
    const inputClassName =
        "w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                    Date
                </label>
                <DatePicker
                    selected={dateValue}
                    onChange={(value: Date | null) => {
                        onDateChange(value ? dayjs(value).format("YYYY-MM-DD") : "");
                    }}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="YYYY-MM-DD"
                    portalId="date-time-picker-portal"
                    popperPlacement="bottom"
                    className={inputClassName}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                    Time
                </label>
                <DatePicker
                    selected={timeValue}
                    onChange={(value: Date | null) => {
                        onTimeChange(value ? dayjs(value).format("HH:mm") : "");
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    placeholderText="HH:MM"
                    portalId="date-time-picker-portal"
                    popperPlacement="bottom"
                    className={inputClassName}
                />
            </div>
        </div>
    );
}
