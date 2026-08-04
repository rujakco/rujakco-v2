/*
 * RUJAK.Co — District/Address Autocomplete
 * Wires the OSM search (searchAddressOSM) + district extraction that
 * already existed in DeliveryContext/shipping-utils but was never
 * surfaced in any UI. Debounced search-as-you-type with a suggestion
 * dropdown; selecting a suggestion fills the address, sets the
 * district, and resolves the delivery distance in one go.
 */

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useDelivery } from "@/contexts/DeliveryContext";
import { extractShortLocation } from "@/lib/shipping-utils";

interface OSMResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressAutocompleteProps {
  onSelect: (fullAddress: string) => void;
}

export default function AddressAutocomplete({ onSelect }: AddressAutocompleteProps) {
  const deliveryCtx = useDelivery();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OSMResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const found = await deliveryCtx.searchAddress(query, controller.signal);
      setResults(found || []);
      setSearching(false);
      setOpen(true);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSelect = async (result: OSMResult) => {
    setQuery(result.display_name);
    setOpen(false);
    setResults([]);

    const district = extractShortLocation(result.display_name);
    deliveryCtx.setSelectedDistrict(district || "Bekasi");
    deliveryCtx.setSelectedDistrictFull(result.display_name);
    onSelect(result.display_name);

    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      await deliveryCtx.resolveDistance(lat, lon);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Cari kecamatan atau alamat (mis. Bekasi Timur)..."
          className="w-full pl-10 pr-9 py-3 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10"
        />
        {searching && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-[#E8E5E0] rounded-xl shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(r)}
              className="w-full flex items-start gap-2 px-4 py-2.5 text-left text-sm hover:bg-forest/5 transition-colors border-b border-[#F0EEE9] last:border-0"
            >
              <MapPin className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <span className="text-ink-soft">{r.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
