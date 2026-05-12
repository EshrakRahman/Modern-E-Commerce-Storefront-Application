import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { GoSearch } from "react-icons/go";
import { Input } from "@/components/ui/input.tsx";

type SearchInputProps = {
    onClose?: () => void;
}

export default function SearchInput({ onClose }: SearchInputProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        onClose?.();
        const searchParams = { q: trimmed };
        navigate({ to: "/categories/all", search: searchParams });
    };

    return (
        <>
            <div className="relative w-full max-w-md">
                <GoSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-11 w-full rounded-full bg-white pl-10 pr-4 text-sm shadow-sm border border-gray-200 focus:border-black focus:ring-0"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
            </div>
        </>
    )
}
