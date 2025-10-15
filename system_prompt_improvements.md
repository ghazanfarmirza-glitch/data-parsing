# ElevenLabs Agent System Prompt Improvement Report

## Analysis Summary
- **Total Failed Conversations Analyzed**: 1,707
- **All failures classified as "unknown" status** (100%)
- **60.5% of conversations were interrupted** (1,033 out of 1,707)
- **14.6% were very short conversations** (≤2 messages)
- **Language issues detected**: 16 conversations (0.9%)

## Key Findings

### 1. Primary User Intent Patterns
The most common user requests are:
- **"parler"** (581 times) - "to speak"
- **"service"** (318 times) - "service" 
- **"agent"** (205 times) - "agent"
- **"clientèle"** (204 times) - "customer service"
- **"speak"** (139 times) - "speak"
- **"customer"** (131 times) - "customer"

### 2. Common User Requests
- "J'aimerais parler à un agent" (I would like to speak to an agent)
- "Parler au service à la clientèle" (Speak to customer service)
- "Speak to customer service, please"
- "Je vais parler à un humain" (I want to speak to a human)

### 3. Critical Issues Identified

#### A. High Interruption Rate (60.5%)
- Users are hanging up or being disconnected frequently
- Many conversations end abruptly during agent responses
- Suggests users are frustrated with response time or content

#### B. Agent Response Failures
- Many conversations show "No agent response" as the last message
- Agent seems to fail to respond to common transfer requests
- System appears to struggle with bilingual requests

#### C. Language Handling Issues
- Mix of French and English requests
- Agent may not be handling language switching effectively
- Some users switch languages mid-conversation

## Recommended System Prompt Improvements

### 1. Immediate Response to Transfer Requests
```
CRITICAL: When users request to speak to an agent, customer service, or human representative, you MUST:
1. Immediately acknowledge their request
2. Confirm you understand they want to speak to a human
3. Initiate transfer without delay
4. Do NOT ask follow-up questions or try to help further
5. Use phrases like: "I understand you'd like to speak to a human agent. Let me transfer you right away."
```

### 2. Bilingual Response Handling
```
LANGUAGE HANDLING:
- Always respond in the same language the user used
- If user switches languages, follow their lead
- For French requests: "Je comprends que vous souhaitez parler à un agent. Je vous transfère immédiatement."
- For English requests: "I understand you'd like to speak to an agent. Let me transfer you right away."
- If unclear, default to French (primary market language)
```

### 3. Faster Response Time
```
RESPONSE SPEED:
- Keep responses under 10 seconds
- Use shorter, more direct responses
- Avoid lengthy explanations when users want transfers
- If interrupted, immediately offer to transfer
```

### 4. Improved Greeting and Context
```
IMPROVED GREETING:
"Bonjour! Je suis Natalie de NationEx. Comment puis-je vous aider aujourd'hui? 
Hello! I'm Natalie from NationEx. How can I help you today?"

- Shorter, more direct
- Clearer about capabilities
- Immediate offer to help
```

### 5. Transfer Request Recognition
```
TRANSFER TRIGGERS - Immediately transfer when users say:
- "parler à un agent" / "speak to an agent"
- "service à la clientèle" / "customer service" 
- "représentant" / "representative"
- "humain" / "human"
- "service client" / "customer service"
- Any variation of wanting to speak to someone else

DO NOT:
- Ask why they want to transfer
- Try to help with their issue first
- Offer alternatives
- Ask for more information
```

### 6. Error Handling
```
ERROR RECOVERY:
- If you don't understand, immediately offer transfer
- If system seems slow, acknowledge and transfer
- If user seems frustrated, transfer immediately
- Always have a fallback to human agent
```

## Implementation Priority

### High Priority (Immediate)
1. **Faster transfer recognition and execution**
2. **Improved bilingual handling**
3. **Shorter response times**

### Medium Priority
1. **Better error recovery**
2. **Improved greeting**
3. **Context awareness**

### Low Priority
1. **Advanced conversation analysis**
2. **Predictive transfer offers**

## Expected Impact
- **Reduce interruption rate from 60.5% to <30%**
- **Improve user satisfaction with faster transfers**
- **Better handling of bilingual customers**
- **Reduced "unknown" status failures**

## Testing Recommendations
1. Test with common French transfer requests
2. Test with English transfer requests  
3. Test interruption scenarios
4. Monitor response times
5. Track transfer success rates
