import pandas as pd
import json

# Read the Excel file and extract the Master Outcome Framework
df_dict = pd.read_excel('/home/ubuntu/attachments/4e1fd4e3-a1f5-4389-894a-5f7a3bdab063/Project+LISTEN.xlsx', sheet_name=['Master Outcome Framework'])

framework_df = df_dict['Master Outcome Framework']

# Get only the first 12 meaningful columns
meaningful_cols = framework_df.columns[:12].tolist()
clean_framework = framework_df[meaningful_cols]

# Remove rows where Challenge ID is null
clean_framework = clean_framework.dropna(subset=[meaningful_cols[0]])

# Convert to list of dictionaries
challenges = []
for _, row in clean_framework.iterrows():
    challenge = {}
    for col in meaningful_cols:
        if pd.notna(row[col]):
            challenge[col.lower().replace(' ', '_')] = str(row[col])
    if challenge:  # Only add if not empty
        challenges.append(challenge)

# Save to JSON file
with open('/home/ubuntu/project-listen/listen-backend/challenges_data.json', 'w') as f:
    json.dump(challenges, f, indent=2)

print(f"Extracted {len(challenges)} challenges to challenges_data.json")
print("Sample challenge:")
if challenges:
    print(json.dumps(challenges[0], indent=2))
