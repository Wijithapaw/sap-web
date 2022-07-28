import { useCallback, useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { IDictionary } from "../app/types";

const CACHE: IDictionary<string[]> = {};

interface Props {
    id: string;
    placeholder?: string;
    onInputChange: (query: string) => void;
    searchFunc: (q: string) => Promise<string[]>;
}

export default function SapTypeAhead({ id, placeholder, onInputChange, searchFunc }: Props) {
    const [options, setOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = useCallback((q: string) => {
        if (CACHE[q]) {
            setOptions(CACHE[q]);
            return;
        }

        setIsLoading(true);
        searchFunc(q).then(options => {
            if(options.length > 0)
                CACHE[q] = options;

            setOptions(options);
            setIsLoading(false);
        });
    }, []);

    return <AsyncTypeahead id={id}
        isLoading={isLoading}
        minLength={2}
        placeholder={placeholder || "Start typing..."}
        onInputChange={onInputChange}
        onSearch={handleChange}
        renderMenuItemChildren={(option) => <span>{option}</span>}
        options={options}
        useCache={false}
        allowNew
        newSelectionPrefix=""            
    />
}