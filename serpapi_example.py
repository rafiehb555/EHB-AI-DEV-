
from serpapi import GoogleSearch

def search_with_serpapi(query, api_key):
    search = GoogleSearch({
        "q": query,
        "api_key": api_key
    })
    
    results = search.get_dict()
    return results

# Example usage (requires API key from secrets)
if __name__ == "__main__":
    import os
    api_key = os.getenv("SERPAPI_API_KEY")
    if not api_key:
        print("Please set SERPAPI_API_KEY in secrets")
    else:
        results = search_with_serpapi("Replit tutorials", api_key)
        print(results)
