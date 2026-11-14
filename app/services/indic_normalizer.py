"""Colloquial Indic Packaging & Commodity Normalizer Service.

Translates regional Indian physical trade packaging units (peti, katta, bori,
chhota hathi, nag, pao, quintal) into standardized SI units, GST billing codes,
and packaging metadata while preserving verbatim spoken evidence.
"""

import re
from typing import Dict, Any, Optional, Tuple, List
from pydantic import BaseModel


class NormalizedPackaging(BaseModel):
    """Structured result of colloquial packaging normalization."""
    raw_spoken_phrase: str
    colloquial_unit: str
    colloquial_quantity: float
    standard_quantity: float
    standard_unit: str
    package_type: str
    package_count: int
    unit_capacity_metric: float
    metric_unit: str
    standardized_display: str
    hsn_code: str
    gst_rate_percent: float
    conversion_formula: str


class IndicPackagingNormalizer:
    """Enterprise normalizer for vernacular trade packaging and commodities."""

    # 1. Spoken number words mapping (English + Hindi Romanized + Devanagari)
    NUMBER_MAP: Dict[str, float] = {
        # English
        "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7,
        "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13,
        "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
        "nineteen": 19, "twenty": 20, "twenty five": 25, "thirty": 30, "forty": 40,
        "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90, "hundred": 100,

        # Hindi Transliterated
        "ek": 1, "do": 2, "teen": 3, "chaar": 4, "char": 4, "paanch": 5, "panch": 5,
        "chhah": 6, "che": 6, "saat": 7, "aath": 8, "nau": 9, "das": 10, "dus": 10,
        "gyarah": 11, "barah": 12, "terah": 13, "chaudah": 14, "pandrah": 15,
        "solah": 16, "satrah": 17, "atharah": 18, "unnees": 19, "bees": 20, "beesh": 20,
        "pachees": 25, "pachis": 25, "tees": 30, "paintees": 35, "chalis": 40,
        "painchalis": 45, "pachaas": 50, "pachas": 50, "saatth": 60, "saath": 60,
        "sattar": 70, "assi": 80, "nabbe": 90, "sau": 100, "so": 100, "hazaar": 1000,
        "hazar": 1000, "lakh": 100000, "crore": 10000000,

        # Devanagari Script
        "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पांच": 5, "छह": 6, "सात": 7, "आठ": 8,
        "नौ": 9, "दस": 10, "ग्यारह": 11, "बारह": 12, "पंद्रह": 15, "बीस": 20,
        "पच्चीस": 25, "तीस": 30, "चालीस": 40, "पचास": 50, "साठ": 60, "सत्तर": 70,
        "अस्सी": 80, "नब्बे": 90, "सौ": 100, "हजार": 1000, "लाख": 100000,
    }

    # 2. Fractional and multiplier prefixes
    MULTIPLIER_MAP: Dict[str, float] = {
        "aadha": 0.5, "adha": 0.5, "half": 0.5, "आधा": 0.5,
        "pao": 0.25, "paav": 0.25, "quarter": 0.25, "पाव": 0.25,
        "paune": 0.75, "पौने": 0.75,
        "savva": 1.25, "sawa": 1.25, "सवा": 1.25,
        "dedh": 1.5, "deedh": 1.5, "डेढ़": 1.5,
        "dhai": 2.5, "dhayi": 2.5, "ढाई": 2.5,
    }

    # 3. Vernacular Trade Packaging Categories
    PACKAGING_TAXONOMY: Dict[str, Dict[str, Any]] = {
        # Gunny Sacks (bori / katta)
        "bori": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "boriyan": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "katta": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "katte": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "sack": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "sacks": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "bag": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "bags": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "बोरी": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "बोरियां": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "कट्टा": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},
        "कट्टे": {"type": "GUNNY_BAG", "base_unit": "BAG", "default_kg": 50.0, "metric": "KG"},

        # Boxes & Crates (peti / box / carton)
        "peti": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 12.0, "metric": "BOX"},
        "petiyan": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 12.0, "metric": "BOX"},
        "box": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 12.0, "metric": "BOX"},
        "boxes": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 12.0, "metric": "BOX"},
        "carton": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 15.0, "metric": "BOX"},
        "cartons": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 15.0, "metric": "BOX"},
        "crate": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 20.0, "metric": "BOX"},
        "crates": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 20.0, "metric": "BOX"},
        "पेटी": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 12.0, "metric": "BOX"},
        "पेटियां": {"type": "BOX_CRATE", "base_unit": "BOX", "default_kg": 12.0, "metric": "BOX"},

        # Commercial Tins & Cans (dabba / dibba / can)
        "dabba": {"type": "COMMERCIAL_TIN", "base_unit": "TIN", "default_kg": 15.0, "metric": "LTR"},
        "dibba": {"type": "COMMERCIAL_TIN", "base_unit": "TIN", "default_kg": 15.0, "metric": "LTR"},
        "tin": {"type": "COMMERCIAL_TIN", "base_unit": "TIN", "default_kg": 15.0, "metric": "LTR"},
        "tins": {"type": "COMMERCIAL_TIN", "base_unit": "TIN", "default_kg": 15.0, "metric": "LTR"},
        "cane": {"type": "CAN", "base_unit": "CAN", "default_kg": 5.0, "metric": "LTR"},
        "canes": {"type": "CAN", "base_unit": "CAN", "default_kg": 5.0, "metric": "LTR"},
        "can": {"type": "CAN", "base_unit": "CAN", "default_kg": 5.0, "metric": "LTR"},
        "cans": {"type": "CAN", "base_unit": "CAN", "default_kg": 5.0, "metric": "LTR"},
        "डब्बा": {"type": "COMMERCIAL_TIN", "base_unit": "TIN", "default_kg": 15.0, "metric": "LTR"},
        "डिब्बा": {"type": "COMMERCIAL_TIN", "base_unit": "TIN", "default_kg": 15.0, "metric": "LTR"},

        # Vehicle Loads (chhota hathi / truck load)
        "chhota hathi": {"type": "VEHICLE_LOAD", "base_unit": "VEHICLE", "default_kg": 2000.0, "metric": "KG"},
        "chota hathi": {"type": "VEHICLE_LOAD", "base_unit": "VEHICLE", "default_kg": 2000.0, "metric": "KG"},
        "tata ace": {"type": "VEHICLE_LOAD", "base_unit": "VEHICLE", "default_kg": 2000.0, "metric": "KG"},
        "lorry load": {"type": "VEHICLE_LOAD", "base_unit": "VEHICLE", "default_kg": 10000.0, "metric": "KG"},
        "truck load": {"type": "VEHICLE_LOAD", "base_unit": "VEHICLE", "default_kg": 10000.0, "metric": "KG"},
        "छोटा हाथी": {"type": "VEHICLE_LOAD", "base_unit": "VEHICLE", "default_kg": 2000.0, "metric": "KG"},

        # Standard Metric Wholesale Units
        "quintal": {"type": "METRIC_BULK", "base_unit": "QTL", "default_kg": 100.0, "metric": "KG"},
        "quintals": {"type": "METRIC_BULK", "base_unit": "QTL", "default_kg": 100.0, "metric": "KG"},
        "kuntal": {"type": "METRIC_BULK", "base_unit": "QTL", "default_kg": 100.0, "metric": "KG"},
        "क्विंटल": {"type": "METRIC_BULK", "base_unit": "QTL", "default_kg": 100.0, "metric": "KG"},
        "ton": {"type": "METRIC_BULK", "base_unit": "MT", "default_kg": 1000.0, "metric": "KG"},
        "tonnes": {"type": "METRIC_BULK", "base_unit": "MT", "default_kg": 1000.0, "metric": "KG"},
        "tons": {"type": "METRIC_BULK", "base_unit": "MT", "default_kg": 1000.0, "metric": "KG"},
        "टन": {"type": "METRIC_BULK", "base_unit": "MT", "default_kg": 1000.0, "metric": "KG"},
        "kg": {"type": "METRIC_UNIT", "base_unit": "KG", "default_kg": 1.0, "metric": "KG"},
        "kilos": {"type": "METRIC_UNIT", "base_unit": "KG", "default_kg": 1.0, "metric": "KG"},

        # Discrete Pieces (nag / pcs)
        "nag": {"type": "DISCRETE_PIECE", "base_unit": "PCS", "default_kg": 1.0, "metric": "PCS"},
        "naug": {"type": "DISCRETE_PIECE", "base_unit": "PCS", "default_kg": 1.0, "metric": "PCS"},
        "pieces": {"type": "DISCRETE_PIECE", "base_unit": "PCS", "default_kg": 1.0, "metric": "PCS"},
        "pcs": {"type": "DISCRETE_PIECE", "base_unit": "PCS", "default_kg": 1.0, "metric": "PCS"},
        "units": {"type": "DISCRETE_PIECE", "base_unit": "PCS", "default_kg": 1.0, "metric": "PCS"},
        "नग": {"type": "DISCRETE_PIECE", "base_unit": "PCS", "default_kg": 1.0, "metric": "PCS"},
    }

    # 4. Commodity Specific Density, Packing & GST Standards
    COMMODITY_STANDARDS: Dict[str, Dict[str, Any]] = {
        "cement": {"kg_per_bag": 50.0, "hsn": "2523", "gst": 28.0, "bags_per_ace": 40},
        "rice": {"kg_per_bag": 50.0, "hsn": "1006", "gst": 0.0, "bags_per_ace": 40},
        "basmati": {"kg_per_bag": 50.0, "hsn": "1006", "gst": 0.0, "bags_per_ace": 40},
        "chawal": {"kg_per_bag": 50.0, "hsn": "1006", "gst": 0.0, "bags_per_ace": 40},
        "wheat": {"kg_per_bag": 50.0, "hsn": "1001", "gst": 0.0, "bags_per_ace": 40},
        "gehun": {"kg_per_bag": 50.0, "hsn": "1001", "gst": 0.0, "bags_per_ace": 40},
        "sugar": {"kg_per_bag": 50.0, "hsn": "1701", "gst": 5.0, "bags_per_ace": 40},
        "shakkar": {"kg_per_bag": 50.0, "hsn": "1701", "gst": 5.0, "bags_per_ace": 40},
        "oil": {"liters_per_tin": 15.0, "hsn": "1514", "gst": 5.0},
        "tel": {"liters_per_tin": 15.0, "hsn": "1514", "gst": 5.0},
        "mango": {"kg_per_box": 12.0, "hsn": "0804", "gst": 0.0},
        "aam": {"kg_per_box": 12.0, "hsn": "0804", "gst": 0.0},
        "onion": {"kg_per_bag": 45.0, "hsn": "0703", "gst": 0.0},
        "pyaz": {"kg_per_bag": 45.0, "hsn": "0703", "gst": 0.0},
        "potato": {"kg_per_bag": 50.0, "hsn": "0701", "gst": 0.0},
        "aaloo": {"kg_per_bag": 50.0, "hsn": "0701", "gst": 0.0},
        "soya": {"kg_per_bag": 50.0, "hsn": "1201", "gst": 5.0},
        "fertilizer": {"kg_per_bag": 50.0, "hsn": "3105", "gst": 5.0},
        "dap": {"kg_per_bag": 50.0, "hsn": "3105", "gst": 5.0},
        "urea": {"kg_per_bag": 45.0, "hsn": "3102", "gst": 5.0},
    }

    @classmethod
    def match_unit(cls, token: str) -> Optional[str]:
        """Check if token is a registered colloquial or standard packaging unit."""
        clean = token.lower().strip()
        for u in cls.PACKAGING_TAXONOMY:
            if clean == u or clean == u.rstrip('s'):
                return u
        return None

    @classmethod
    def parse_vernacular_phrase(cls, text: str) -> Optional[Tuple[float, str, str]]:
        """Parse spoken vernacular quantities like 'pachas bori', '20 peti', 'don chhota hathi'."""
        units_regex = "|".join([re.escape(k) for k in sorted(cls.PACKAGING_TAXONOMY.keys(), key=len, reverse=True)])

        # Pattern 1: Digits + unit (e.g., '50 bori', '20 peti', '2 chhota hathi')
        pat_digits = rf'(?:^|[\s,;:])(\d+(?:\.\d+)?)\s*({units_regex})(?:$|[\s,;:।\.])'
        match = re.search(pat_digits, text, re.IGNORECASE)
        if match:
            qty = float(match.group(1))
            unit = match.group(2).lower()
            return qty, unit, f"{match.group(1)} {match.group(2)}"

        # Pattern 2: Multipliers (e.g. 'dedh sau bori', 'dhai bori', 'aadha bori')
        for mult_word, mult_val in cls.MULTIPLIER_MAP.items():
            mult_pat = rf'(?:^|[\s,;:]){re.escape(mult_word)}\s*(?:sau|so|hazaar|hazar)?\s*({units_regex})(?:$|[\s,;:।\.])'
            m = re.search(mult_pat, text, re.IGNORECASE)
            if m:
                unit = m.group(1).lower()
                mult = mult_val
                if re.search(r'\b(?:sau|so)\b', m.group(0), re.IGNORECASE):
                    mult = mult_val * 100
                elif re.search(r'\b(?:hazaar|hazar)\b', m.group(0), re.IGNORECASE):
                    mult = mult_val * 1000
                return mult, unit, m.group(0).strip()

        # Pattern 3: Vernacular words + unit (e.g., 'pachaas bori', 'twenty five boxes', 'pandrah cane', 'पचास बोरी')
        words_regex = "|".join([re.escape(k) for k in sorted(cls.NUMBER_MAP.keys(), key=len, reverse=True)])
        pat_words = rf'(?:^|[\s,;:])({words_regex})\s+({units_regex})(?:$|[\s,;:।\.])'
        match_words = re.search(pat_words, text, re.IGNORECASE)
        if match_words:
            w = match_words.group(1).lower()
            unit = match_words.group(2).lower()
            qty = cls.NUMBER_MAP.get(w, 1.0)
            return qty, unit, f"{match_words.group(1)} {match_words.group(2)}"

        return None

    @classmethod
    def normalize(
        cls,
        commodity_name: str,
        raw_phrase: str,
        qty: float,
        unit: str,
        context_text: str = "",
    ) -> NormalizedPackaging:
        """Execute full commodity-aware conversion into standardized SI units and GST codes."""
        unit_lower = unit.lower().strip()
        pack_meta = cls.PACKAGING_TAXONOMY.get(
            unit_lower,
            {"type": "STANDARD_COUNT", "base_unit": unit.upper(), "default_kg": 1.0, "metric": unit.upper()}
        )

        # Detect commodity context from commodity_name, raw_phrase, and overall context
        combined_context = f"{commodity_name} {raw_phrase} {context_text}".lower().strip()
        comm_std: Dict[str, Any] = {}
        for c_key, std in cls.COMMODITY_STANDARDS.items():
            if c_key in combined_context:
                comm_std = std
                break

        hsn_code = comm_std.get("hsn", "9999")
        gst_rate = comm_std.get("gst", 18.0)

        package_count = int(round(qty))
        package_type = pack_meta["type"]
        unit_capacity = pack_meta["default_kg"]
        metric_unit = pack_meta["metric"]

        # Override default capacity with commodity-specific density if available
        if "kg_per_bag" in comm_std and package_type == "GUNNY_BAG":
            unit_capacity = comm_std["kg_per_bag"]
        elif "liters_per_tin" in comm_std and package_type == "COMMERCIAL_TIN":
            unit_capacity = comm_std["liters_per_tin"]
            metric_unit = "LTR"
        elif "kg_per_box" in comm_std and package_type == "BOX_CRATE":
            unit_capacity = comm_std["kg_per_box"]

        # Calculate standard SI quantity
        if package_type == "VEHICLE_LOAD":
            # Tata Ace mini-truck load = 40 sacks = 2,000 kg
            bags_per_truck = comm_std.get("bags_per_ace", 40)
            standard_qty = qty * (bags_per_truck * 50.0)
            package_count = int(qty * bags_per_truck)
            standard_unit = "KG"
            display_str = f"{package_count} Bags ({standard_qty:,.0f} kg / {qty:g} Mini-Truck Load)"
            formula = f"{qty:g} {unit} × {bags_per_truck} bags/vehicle = {package_count} Bags ({standard_qty:,.0f} kg)"
        elif package_type == "GUNNY_BAG":
            standard_qty = qty * unit_capacity
            standard_unit = "KG"
            display_str = f"{package_count} Bags ({standard_qty:,.0f} kg)"
            formula = f"{package_count} bags × {unit_capacity:g} kg/bag = {standard_qty:,.0f} kg"
        elif package_type == "BOX_CRATE":
            standard_qty = qty * unit_capacity
            standard_unit = "KG"
            display_str = f"{package_count} Boxes ({standard_qty:,.0f} kg)"
            formula = f"{package_count} boxes × {unit_capacity:g} kg/box = {standard_qty:,.0f} kg"
        elif package_type == "COMMERCIAL_TIN":
            standard_qty = qty * unit_capacity
            standard_unit = "LTR"
            display_str = f"{package_count} Tins ({standard_qty:,.0f} Litres)"
            formula = f"{package_count} tins × {unit_capacity:g} L/tin = {standard_qty:,.0f} Litres"
        elif package_type == "METRIC_BULK":
            standard_qty = qty * unit_capacity
            standard_unit = "KG"
            display_str = f"{qty:g} {unit.title()} ({standard_qty:,.0f} kg)"
            formula = f"{qty:g} {unit} × {unit_capacity:g} kg = {standard_qty:,.0f} kg"
        else:
            standard_qty = qty
            standard_unit = pack_meta["base_unit"]
            display_str = f"{qty:g} {standard_unit}"
            formula = f"{qty:g} {unit} (Standard Discrete Units)"

        return NormalizedPackaging(
            raw_spoken_phrase=raw_phrase,
            colloquial_unit=unit,
            colloquial_quantity=qty,
            standard_quantity=standard_qty,
            standard_unit=standard_unit,
            package_type=package_type,
            package_count=package_count,
            unit_capacity_metric=unit_capacity,
            metric_unit=metric_unit,
            standardized_display=display_str,
            hsn_code=hsn_code,
            gst_rate_percent=gst_rate,
            conversion_formula=formula,
        )


indic_normalizer = IndicPackagingNormalizer()
