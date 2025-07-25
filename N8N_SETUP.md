# n8n API Configuration Guide

This repository is configured to automatically load n8n API credentials for seamless workflow debugging and API access.

## Setup Instructions

1. **Edit the `.env` file** in the repository root:
   ```bash
   # Open the .env file
   code .env
   ```

2. **Replace the placeholder values** with your actual n8n credentials:
   ```bash
   # Your actual n8n API key
   N8N_API_KEY=n8n_api_1234567890abcdef
   
   # Your actual n8n instance URL
   N8N_INSTANCE_URL=https://your-instance.n8n.cloud
   ```

## How to Get Your n8n API Key

1. Log into your n8n instance
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the generated key and paste it into the `.env` file

## How to Find Your n8n Instance URL

- **n8n Cloud**: Usually in the format `https://your-instance.n8n.cloud`
- **Self-hosted**: Your custom domain or `http://localhost:5678` for local development

## Environment Variables Available

Once configured, these environment variables will be automatically available when working in this repository:

- `N8N_API_KEY`: Your n8n API key for authentication
- `N8N_INSTANCE_URL`: Your n8n instance URL for API calls

## Testing the Configuration

You can test if the environment variables are loaded correctly:

```bash
# Navigate to the repository
cd ~/repos/FerJRau

# Check if variables are loaded
echo "API Key: $N8N_API_KEY"
echo "Instance URL: $N8N_INSTANCE_URL"
```

## Usage in Python Scripts

```python
import os
import requests

# Get credentials from environment
api_key = os.getenv('N8N_API_KEY')
instance_url = os.getenv('N8N_INSTANCE_URL')

# Example API call
headers = {
    'X-N8N-API-KEY': api_key,
    'Content-Type': 'application/json'
}

response = requests.get(f"{instance_url}/api/v1/workflows", headers=headers)
```

## Security Notes

- The `.env` file is automatically added to `.gitignore` to prevent accidental commits
- Never commit API keys to version control
- Environment variables are only loaded when working within this repository directory