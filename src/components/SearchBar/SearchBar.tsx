import { useId } from 'react'
import './SearchBar.css'

export type SearchBarProps = {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function SearchBar({ label, value, onChange, placeholder = label }: SearchBarProps) {
    const inputId = useId()

    return (
        <div className="search-bar">
            <label className="search-bar__label" htmlFor={inputId}>{label}</label>
            <svg
                className="search-bar__icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
            >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
            </svg>
            <input
                id={inputId}
                className="search-bar__input"
                type="search"
                autoComplete="off"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}