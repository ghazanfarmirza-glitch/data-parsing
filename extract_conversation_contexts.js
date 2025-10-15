import fs from "node:fs/promises";
import path from "node:path";

async function extractConversationContexts() {
  const failureDir = "failure_unknown_convs";
  const files = await fs.readdir(failureDir);
  
  const conversationContexts = [];
  
  // Analyze first 20 conversations for detailed context
  const filesToAnalyze = files.slice(0, 20);
  
  for (const file of filesToAnalyze) {
    if (!file.endsWith('.json')) continue;
    
    try {
      const content = await fs.readFile(path.join(failureDir, file), 'utf8');
      const conv = JSON.parse(content);
      
      const context = {
        conversationId: conv.conversation_id,
        status: conv.metadata?.call_successful || 'unknown',
        duration: conv.metadata?.call_duration_secs || 0,
        messageCount: conv.transcript?.length || 0,
        transcript: [],
        failurePoint: null,
        userIntent: null,
        agentResponse: null,
        issues: []
      };
      
      // Extract detailed transcript
      if (conv.transcript && conv.transcript.length > 0) {
        conv.transcript.forEach((turn, index) => {
          const turnData = {
            role: turn.role,
            message: turn.message,
            timeInCall: turn.time_in_call_secs || 0,
            interrupted: turn.interrupted || false,
            turnNumber: index + 1
          };
          context.transcript.push(turnData);
        });
        
        // Find user messages
        const userMessages = conv.transcript.filter(t => t.role === 'user' && t.message && t.message.trim() && t.message !== '...');
        const agentMessages = conv.transcript.filter(t => t.role === 'agent' && t.message && t.message.trim());
        
        // Identify user intent
        if (userMessages.length > 0) {
          context.userIntent = userMessages[0].message;
        }
        
        // Identify last agent response
        if (agentMessages.length > 0) {
          context.agentResponse = agentMessages[agentMessages.length - 1].message;
        }
        
        // Analyze failure points
        const lastTurn = conv.transcript[conv.transcript.length - 1];
        if (lastTurn) {
          if (lastTurn.interrupted) {
            context.failurePoint = "User interrupted during agent response";
            context.issues.push("Interrupted conversation");
          } else if (lastTurn.role === 'user' && !agentMessages.some(m => m.timeInCall > lastTurn.time_in_call_secs)) {
            context.failurePoint = "Agent failed to respond to user";
            context.issues.push("No agent response");
          } else if (conv.transcript.length <= 2) {
            context.failurePoint = "Very short conversation";
            context.issues.push("Short conversation");
          }
        }
        
        // Check for specific issues
        const fullText = conv.transcript.map(t => t.message).join(' ').toLowerCase();
        
        if (fullText.includes('parler') && fullText.includes('agent')) {
          context.issues.push("User requested human agent");
        }
        if (fullText.includes('service') && fullText.includes('clientèle')) {
          context.issues.push("User requested customer service");
        }
        if (fullText.includes('french') || fullText.includes('français')) {
          context.issues.push("Language switching issue");
        }
        if (fullText.includes('merci') && conv.transcript.length <= 3) {
          context.issues.push("Quick thank you and hang up");
        }
      }
      
      conversationContexts.push(context);
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  // Create detailed report
  console.log('=== DETAILED CONVERSATION CONTEXTS ===\n');
  
  conversationContexts.forEach((context, index) => {
    console.log(`--- CONVERSATION ${index + 1}: ${context.conversationId} ---`);
    console.log(`Status: ${context.status}`);
    console.log(`Duration: ${context.duration}s`);
    console.log(`Messages: ${context.messageCount}`);
    console.log(`Issues: ${context.issues.join(', ') || 'None identified'}`);
    console.log(`Failure Point: ${context.failurePoint || 'Not identified'}`);
    
    if (context.userIntent) {
      console.log(`\nUser Intent: "${context.userIntent}"`);
    }
    
    if (context.agentResponse) {
      console.log(`\nLast Agent Response: "${context.agentResponse.substring(0, 100)}${context.agentResponse.length > 100 ? '...' : ''}"`);
    }
    
    console.log('\n--- CONVERSATION FLOW ---');
    context.transcript.forEach(turn => {
      const role = turn.role === 'user' ? '👤 USER' : '🤖 AGENT';
      const interrupted = turn.interrupted ? ' ⚠️ INTERRUPTED' : '';
      const message = turn.message || '';
      console.log(`${role} (${turn.timeInCall}s): ${message.substring(0, 150)}${message.length > 150 ? '...' : ''}${interrupted}`);
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
  });
  
  // Save detailed contexts
  await fs.writeFile('conversation_contexts.json', JSON.stringify(conversationContexts, null, 2));
  console.log('Detailed conversation contexts saved to conversation_contexts.json');
  
  // Create summary of common patterns
  const commonIssues = {};
  const commonIntents = {};
  const commonFailurePoints = {};
  
  conversationContexts.forEach(context => {
    context.issues.forEach(issue => {
      commonIssues[issue] = (commonIssues[issue] || 0) + 1;
    });
    
    if (context.userIntent) {
      const intent = context.userIntent.toLowerCase();
      if (intent.includes('parler') && intent.includes('agent')) {
        commonIntents['Request human agent'] = (commonIntents['Request human agent'] || 0) + 1;
      } else if (intent.includes('service')) {
        commonIntents['Request customer service'] = (commonIntents['Request customer service'] || 0) + 1;
      } else if (intent.includes('merci')) {
        commonIntents['Thank you'] = (commonIntents['Thank you'] || 0) + 1;
      } else {
        commonIntents['Other'] = (commonIntents['Other'] || 0) + 1;
      }
    }
    
    if (context.failurePoint) {
      commonFailurePoints[context.failurePoint] = (commonFailurePoints[context.failurePoint] || 0) + 1;
    }
  });
  
  console.log('\n=== COMMON PATTERNS SUMMARY ===');
  console.log('\nMost Common Issues:');
  Object.entries(commonIssues).sort(([,a], [,b]) => b - a).forEach(([issue, count]) => {
    console.log(`- ${issue}: ${count} conversations`);
  });
  
  console.log('\nMost Common User Intents:');
  Object.entries(commonIntents).sort(([,a], [,b]) => b - a).forEach(([intent, count]) => {
    console.log(`- ${intent}: ${count} conversations`);
  });
  
  console.log('\nMost Common Failure Points:');
  Object.entries(commonFailurePoints).sort(([,a], [,b]) => b - a).forEach(([point, count]) => {
    console.log(`- ${point}: ${count} conversations`);
  });
}

extractConversationContexts().catch(console.error);
