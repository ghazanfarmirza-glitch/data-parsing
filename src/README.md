# Source Code Documentation

This directory contains the core analysis scripts for the AI conversation optimization project.

## Files

### `analyze_failures.js`
Main analysis script that processes conversation data and identifies failure patterns.

**Key Features:**
- Processes conversation transcripts
- Calculates interruption rates
- Identifies common user intents
- Generates failure analysis report

**Usage:**
```bash
node src/analyze_failures.js
```

### `extract_conversation_contexts.js`
Extracts detailed conversation contexts and patterns for deeper analysis.

**Key Features:**
- Extracts conversation metadata
- Identifies failure points
- Analyzes user-agent interactions
- Generates context summaries

**Usage:**
```bash
node src/extract_conversation_contexts.js
```

### `transcript.js`
Utility functions for processing conversation transcripts.

**Key Features:**
- Transcript parsing utilities
- Message extraction functions
- Timing analysis helpers

## Data Requirements

The scripts expect conversation data in the following format:

```json
{
  "conversation_id": "string",
  "status": "string",
  "metadata": {
    "call_duration_secs": "number",
    "call_successful": "string"
  },
  "transcript": [
    {
      "role": "user|agent",
      "message": "string",
      "time_in_call_secs": "number",
      "interrupted": "boolean"
    }
  ]
}
```

## Output

- `failure_analysis.json` - Complete analysis results
- `conversation_contexts.json` - Detailed conversation contexts
- Console output with summary statistics

## Dependencies

- Node.js 16+
- ES6 modules support
- File system access for data processing
