import pandas as pd
import json

def extract_peer_insights():
    try:
        # Load the Excel file
        excel_path = "/home/ubuntu/attachments/940dccd4-1c05-45b0-bb20-671440794088/Project+LISTEN.xlsx"
        
        # Get all sheet names first
        xl_file = pd.ExcelFile(excel_path)
        print("Available sheets:", xl_file.sheet_names)
        
        # Look for peer insights data in different sheets
        for sheet_name in xl_file.sheet_names:
            print(f"\n=== ANALYZING SHEET: {sheet_name} ===")
            try:
                df = pd.read_excel(excel_path, sheet_name=sheet_name)
                print(f"Shape: {df.shape}")
                print(f"Columns: {list(df.columns)[:10]}")  # First 10 columns
                
                # Look for percentage data and industry-specific insights
                for col in df.columns:
                    if df[col].dtype == 'object':  # Text columns
                        text_series = df[col].astype(str)
                        
                        # Search for percentage patterns
                        percentage_matches = text_series.str.contains(r'\d+%', case=False, na=False)
                        if percentage_matches.any():
                            print(f"\nFOUND PERCENTAGES in {sheet_name}, column {col}:")
                            matches = df[percentage_matches][col].dropna().head(10)
                            for match in matches:
                                print(f"  - {match}")
                        
                        # Search for industry keywords
                        industry_keywords = ['restaurant', 'hotel', 'cafe', 'entertainment', 'multi-site', 'bar']
                        for keyword in industry_keywords:
                            keyword_matches = text_series.str.contains(keyword, case=False, na=False)
                            if keyword_matches.any():
                                print(f"\nFOUND '{keyword}' data in {sheet_name}, column {col}:")
                                matches = df[keyword_matches][col].dropna().head(5)
                                for match in matches:
                                    print(f"  - {match}")
                
            except Exception as e:
                print(f"Error reading sheet {sheet_name}: {e}")
        
        # Look specifically for peer insights or statistics sheets
        potential_sheets = ['Peer Insights', 'Statistics', 'Industry Data', 'Insights', 'Data']
        for sheet in potential_sheets:
            if sheet in xl_file.sheet_names:
                print(f"\n=== DETAILED ANALYSIS OF {sheet} ===")
                df = pd.read_excel(excel_path, sheet_name=sheet)
                print(df.head())
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_peer_insights()
