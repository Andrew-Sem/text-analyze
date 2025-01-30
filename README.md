# Text Analysis Microservice

A microservice built with Bun that provides text analysis capabilities using OpenAI's API.

## Prerequisites

- [Bun](https://bun.sh) v1.2.0 or higher
- OpenAI API key

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd text-analyze
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with your OpenAI API key:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Development

To run the server in development mode:

```bash
bun run dev
```

The server will start on `http://localhost:3000`.

## Testing

Run the test suite:

```bash
bun test
```

## Building

Build the project:

```bash
bun build --target=bun ./index.ts --outdir ./dist
```

## API Endpoints

### POST /analyze

Analyzes the sentiment of provided text.

Request body:

```json
{
  "text": "Your text to analyze"
}
```

Response:

```json
{
  "sentiment": "positive" | "negative" | "neutral"
}
```

## Docker

### Building the Docker Image

Build the Docker image:

```bash
docker build -t text-analyze .
```

### Running with Docker

1. Create a `.env` file with your OpenAI API key as described in the Setup section.

2. Run the container:

```bash
docker run -p 3000:3000 --env-file .env text-analyze
```

The service will be available at `http://localhost:3000`.

## CI/CD

The project includes GitHub Actions workflows for:

- Running tests
- Building the application
- Caching dependencies

## License

[Add your license here]
