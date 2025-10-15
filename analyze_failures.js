import fs from "node:fs/promises";
import path from "node:path";

async function analyzeFailures() {
  const failureDir = "failure_unknown_convs";
  const files = await fs.readdir(failureDir);
  
  const analysis = {
    totalConversations: 0,
    failureReasons: {},
    commonIssues: [],
    conversationPatterns: [],
    userMessages: [],
    agentResponses: [],
    interruptedConversations: 0,
    shortConversations: 0,
    languageIssues: 0
  };

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    try {
      const content = await fs.readFile(path.join(failureDir, file), 'utf8');
      const conv = JSON.parse(content);
      
      analysis.totalConversations++;
      
      // Get call_successful status
      const status = conv.metadata?.call_successful || 'unknown';
      analysis.failureReasons[status] = (analysis.failureReasons[status] || 0) + 1;
      
      // Analyze transcript
      const transcript = conv.transcript || [];
      const userMessages = transcript.filter(t => t.role === 'user').map(t => t.message);
      const agentMessages = transcript.filter(t => t.role === 'agent').map(t => t.message);
      
      // Check for interruptions
      const interrupted = transcript.some(t => t.interrupted);
      if (interrupted) analysis.interruptedConversations++;
      
      // Check conversation length
      if (transcript.length <= 2) analysis.shortConversations++;
      
      // Collect user messages for pattern analysis
      analysis.userMessages.push(...userMessages.filter(m => m && m.trim()));
      analysis.agentResponses.push(...agentMessages.filter(m => m && m.trim()));
      
      // Look for specific patterns
      const fullTranscript = transcript.map(t => t.message).join(' ').toLowerCase();
      
      if (fullTranscript.includes('french') || fullTranscript.includes('français')) {
        analysis.languageIssues++;
      }
      
      // Extract conversation context
      if (transcript.length > 0) {
        const firstUserMessage = userMessages.find(m => m && m.trim() && m !== '...');
        const lastAgentMessage = agentMessages[agentMessages.length - 1];
        
        analysis.conversationPatterns.push({
          conversationId: conv.conversation_id,
          status: status,
          messageCount: transcript.length,
          firstUserMessage: firstUserMessage || 'No clear user message',
          lastAgentMessage: lastAgentMessage || 'No agent response',
          interrupted: interrupted,
          duration: conv.metadata?.call_duration_secs || 0
        });
      }
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  // Analyze common user message patterns
  const messageCounts = {};
  analysis.userMessages.forEach(msg => {
    const words = msg.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    words.forEach(word => {
      messageCounts[word] = (messageCounts[word] || 0) + 1;
    });
  });
  
  // Get most common words
  const commonWords = Object.entries(messageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);
  
  console.log('=== FAILURE ANALYSIS REPORT ===');
  console.log(`Total conversations analyzed: ${analysis.totalConversations}`);
  console.log('\n=== FAILURE REASONS ===');
  Object.entries(analysis.failureReasons).forEach(([reason, count]) => {
    console.log(`${reason}: ${count} (${((count/analysis.totalConversations)*100).toFixed(1)}%)`);
  });
  
  console.log('\n=== CONVERSATION STATISTICS ===');
  console.log(`Interrupted conversations: ${analysis.interruptedConversations} (${((analysis.interruptedConversations/analysis.totalConversations)*100).toFixed(1)}%)`);
  console.log(`Short conversations (≤2 messages): ${analysis.shortConversations} (${((analysis.shortConversations/analysis.totalConversations)*100).toFixed(1)}%)`);
  console.log(`Language-related issues: ${analysis.languageIssues} (${((analysis.languageIssues/analysis.totalConversations)*100).toFixed(1)}%)`);
  
  console.log('\n=== COMMON USER WORDS ===');
  commonWords.forEach(([word, count]) => {
    console.log(`${word}: ${count} times`);
  });
  
  console.log('\n=== SAMPLE CONVERSATION PATTERNS ===');
  analysis.conversationPatterns.slice(0, 10).forEach(pattern => {
    console.log(`\n--- ${pattern.conversationId} (${pattern.status}) ---`);
    console.log(`Duration: ${pattern.duration}s, Messages: ${pattern.messageCount}`);
    console.log(`First user message: "${pattern.firstUserMessage}"`);
    console.log(`Last agent message: "${pattern.lastAgentMessage}"`);
    if (pattern.interrupted) console.log('⚠️  INTERRUPTED');
  });
  
  // Save detailed analysis
  await fs.writeFile('failure_analysis.json', JSON.stringify(analysis, null, 2));
  console.log('\n=== DETAILED ANALYSIS SAVED TO failure_analysis.json ===');
}

analyzeFailures().catch(console.error);
