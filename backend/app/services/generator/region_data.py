from typing import Dict, Any
from app.schemas.dataset import Region

REGION_LOCALE_MAP: Dict[Region, str] = {
    Region.india: "en_IN",
    Region.usa: "en_US",
    Region.uk: "en_GB",
    Region.canada: "en_CA",
    Region.australia: "en_AU",
    Region.uae: "en_AE",  # Can use en_US or ar_AE if specific needed, en_US as fallback usually works well with faker for international
    Region.singapore: "en_SG", # fallback to en_US if faker doesn't support
    Region.germany: "de_DE"
}

REGION_CURRENCY_MAP: Dict[Region, str] = {
    Region.india: "INR",
    Region.usa: "USD",
    Region.uk: "GBP",
    Region.canada: "CAD",
    Region.australia: "AUD",
    Region.uae: "AED",
    Region.singapore: "SGD",
    Region.germany: "EUR"
}

def get_locale_for_region(region: Region) -> str:
    return REGION_LOCALE_MAP.get(region, "en_US")

def get_currency_for_region(region: Region) -> str:
    return REGION_CURRENCY_MAP.get(region, "USD")
