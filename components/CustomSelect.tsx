"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SelectOption = {
    label: string;
    value: string;
};

type CustomSelectProps = {
    id: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    fitWidthToLongestWord?: boolean;
};

export default function CustomSelect({
    id,
    value,
    options,
    onChange,
    placeholder = "Select an option",
    fitWidthToLongestWord = false,
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = options.find((option) => option.value === value);
    const selectedIndex = useMemo(
        () => Math.max(0, options.findIndex((option) => option.value === value)),
        [options, value]
    );
    const longestWordLength = fitWidthToLongestWord
        ? options.reduce((max, option) => {
            const words = option.label.split(/\s+/).filter(Boolean);
            const longest = words.reduce((wordMax, word) => Math.max(wordMax, word.length), 0);
            return Math.max(max, longest);
        }, 0)
        : 0;
    const dropdownMinWidth = fitWidthToLongestWord && longestWordLength > 0
        ? `calc(${longestWordLength}ch + 2.5rem)`
        : undefined;

    useEffect(() => {
        if (!open) {
            return;
        }
        const target = optionRefs.current[selectedIndex];
        if (target) {
            requestAnimationFrame(() => target.focus());
        }
    }, [open, selectedIndex]);

    const focusOption = (index: number) => {
        const clamped = Math.max(0, Math.min(options.length - 1, index));
        const target = optionRefs.current[clamped];
        if (target) {
            target.focus();
        }
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            const nextIndex = event.key === "ArrowDown" ? selectedIndex : options.length - 1;
            requestAnimationFrame(() => focusOption(nextIndex));
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((prev) => !prev);
        }

        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
        }
    };

    const handleOptionKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>,
        index: number
    ) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            focusOption(index + 1);
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            focusOption(index - 1);
        }
        if (event.key === "Home") {
            event.preventDefault();
            focusOption(0);
        }
        if (event.key === "End") {
            event.preventDefault();
            focusOption(options.length - 1);
        }
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
        }
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onChange(options[index]?.value ?? value);
            setOpen(false);
            triggerRef.current?.focus();
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <button
                id={id}
                type="button"
                ref={triggerRef}
                onClick={() => setOpen((prev) => !prev)}
                onKeyDown={handleTriggerKeyDown}
                className="w-full px-4 py-2 bg-dark-100 border border-dark rounded-lg focus:outline-none focus:border-blue text-left flex items-center justify-between gap-2"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={selected ? "text-light-100" : "text-light-200"}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                >
                    <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659" />
                </svg>
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-labelledby={id}
                    className="absolute z-50 mt-2 min-w-full bg-dark-100 border border-dark-200 rounded-xl p-2 pr-1 shadow-lg max-h-60 overflow-auto overflow-x-hidden list-none m-0"
                    style={dropdownMinWidth ? { minWidth: dropdownMinWidth } : undefined}
                >
                    {options.map((option, index) => (
                        <li key={option.value}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={option.value === value}
                                ref={(node) => {
                                    optionRefs.current[index] = node;
                                }}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                                className="w-full text-left px-3 py-2 rounded-lg text-light-100 hover:bg-blue/20 focus:outline-none focus:bg-blue/20 whitespace-normal break-words"
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
