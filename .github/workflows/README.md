# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating Docker image building and publishing.

## Available Workflows

### 1. Docker Build and Push (`docker-build.yml`)

This workflow automatically builds and pushes Docker images to GitHub Packages (ghcr.io) when code is pushed to the main/master branch.

**Features:**
- Triggers on pushes to main/master branches
- Builds using Docker Buildx for better cache optimization
- Publishes images to GitHub Container Registry (ghcr.io)
- Applies multiple versioning tags:
  - `latest` - Always points to the most recent build
  - `sha-{commit}` - Short commit SHA for precise version tracking
  - `v{run_number}` - Sequential version number based on GitHub run number
- Can be manually triggered using the "workflow_dispatch" event

### 2. Docker PR Validation (`docker-pr-check.yml`)

This workflow validates that Docker images build correctly on pull requests without actually pushing them to the registry.

**Features:**
- Triggers on pull requests to main/master branches
- Builds image but does not push to registry
- Validates the image builds successfully
- Uses GitHub cache to speed up builds

## Usage

### Accessing Published Images

Once the images are published, you can pull them from GitHub Packages:

```bash
# Pull the latest version
docker pull ghcr.io/[username]/[repository]:latest

# Pull a specific version by commit SHA
docker pull ghcr.io/[username]/[repository]:sha-abc123

# Pull a specific version by run number
docker pull ghcr.io/[username]/[repository]:v42
```

### In docker-compose.yml

To use these images in your docker-compose.yml:

```yaml
services:
  app:
    image: ghcr.io/[username]/[repository]:latest
    # or specific version
    # image: ghcr.io/[username]/[repository]:v42
```

## Authentication

To authenticate with GitHub Packages in order to pull these images:

1. Create a Personal Access Token with the `read:packages` scope
2. Log in to GitHub Container Registry:
   ```bash
   echo $GITHUB_TOKEN | docker login ghcr.io -u [username] --password-stdin
   ```

## Customization

To customize these workflows, edit the respective YAML files:
- `.github/workflows/docker-build.yml`
- `.github/workflows/docker-pr-check.yml` 