import fs from "node:fs/promises";
import https from "node:https";
import { URL } from "node:url";

// Deployed Agent Failure Analysis Framework
class DeployedAgentAnalyzer {
  constructor(agentId, apiKey) {
    this.agentId = agentId;
    this.apiKey = apiKey;
    this.baseUrl = "https://api.elevenlabs.io/v1";
    this.failureConversations = [];
    this.analysisResults = [];
  }

  // Fetch failure conversations from deployed agent
  async fetchFailureConversations() {
    console.log("📡 Fetching failure conversations from deployed agent...");
    console.log(`🎯 Agent ID: ${this.agentId}`);
    
    try {
      // Fetch conversations with failure status
      const url = `${this.baseUrl}/convai/conversations?agent_id=${this.agentId}&status=failure`;
      const options = {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      };

      const response = await this.makeRequest(url, options);
      this.failureConversations = response.conversations || [];
      
      console.log(`✅ Found ${this.failureConversations.length} failure conversations`);
      
      // Also fetch all conversations to get success rate
      const allConversationsUrl = `${this.baseUrl}/convai/conversations?agent_id=${this.agentId}`;
      const allResponse = await this.makeRequest(allConversationsUrl, options);
      const allConversations = allResponse.conversations || [];
      
      const successRate = ((allConversations.length - this.failureConversations.length) / allConversations.length * 100).toFixed(1);
      
      console.log(`📊 Total conversations: ${allConversations.length}`);
      console.log(`📊 Success rate: ${successRate}%`);
      console.log(`📊 Failure rate: ${(100 - successRate).toFixed(1)}%`);
      
      return {
        failureConversations: this.failureConversations,
        totalConversations: allConversations.length,
        successRate: parseFloat(successRate),
        failureRate: parseFloat((100 - successRate).toFixed(1))
      };
    } catch (error) {
      console.error("❌ Error fetching failure conversations:", error.message);
      return null;
    }
  }

  // Fetch detailed conversation analysis
  async fetchConversationDetails(conversationId) {
    try {
      const url = `${this.baseUrl}/convai/conversations/${conversationId}`;
      const options = {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      };

      const response = await this.makeRequest(url, options);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching conversation ${conversationId}:`, error.message);
      return null;
    }
  }

  // Make HTTP request
  makeRequest(url, options) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Invalid JSON response: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  // Analyze failure patterns
  analyzeFailurePatterns(conversations) {
    console.log("\n🔍 Analyzing failure patterns...");
    
    const patterns = {
      interruptionRate: 0,
      emptyResponses: 0,
      toolFailures: 0,
      languageIssues: 0,
      transferFailures: 0,
      trackingFailures: 0,
      commonIssues: [],
      userIntentPatterns: [],
      agentResponsePatterns: []
    };

    conversations.forEach(conv => {
      // Check for interruptions
      if (conv.transcript && conv.transcript.some(turn => turn.interrupted)) {
        patterns.interruptionRate++;
      }

      // Check for empty responses
      if (conv.transcript) {
        const agentMessages = conv.transcript.filter(turn => turn.role === 'agent');
        const emptyResponses = agentMessages.filter(msg => !msg.message || msg.message.trim() === '');
        if (emptyResponses.length > 0) {
          patterns.emptyResponses++;
        }
      }

      // Check for tool failures
      if (conv.tool_calls) {
        const failedTools = conv.tool_calls.filter(tool => 
          tool.status === 'error' || tool.error
        );
        if (failedTools.length > 0) {
          patterns.toolFailures++;
        }
      }

      // Analyze user intents
      if (conv.transcript) {
        const userMessages = conv.transcript
          .filter(turn => turn.role === 'user' && turn.message)
          .map(turn => turn.message);
        
        userMessages.forEach(msg => {
          if (msg.toLowerCase().includes('track') || msg.toLowerCase().includes('shipment')) {
            patterns.trackingFailures++;
          }
          if (msg.toLowerCase().includes('transfer') || msg.toLowerCase().includes('agent') || msg.toLowerCase().includes('human')) {
            patterns.transferFailures++;
          }
          if (msg.toLowerCase().includes('french') || msg.toLowerCase().includes('français')) {
            patterns.languageIssues++;
          }
        });
      }
    });

    // Calculate percentages
    const totalConversations = conversations.length;
    patterns.interruptionRate = ((patterns.interruptionRate / totalConversations) * 100).toFixed(1);
    patterns.emptyResponses = ((patterns.emptyResponses / totalConversations) * 100).toFixed(1);
    patterns.toolFailures = ((patterns.toolFailures / totalConversations) * 100).toFixed(1);
    patterns.languageIssues = ((patterns.languageIssues / totalConversations) * 100).toFixed(1);
    patterns.transferFailures = ((patterns.transferFailures / totalConversations) * 100).toFixed(1);
    patterns.trackingFailures = ((patterns.trackingFailures / totalConversations) * 100).toFixed(1);

    return patterns;
  }

  // Analyze individual conversation details
  async analyzeConversationDetails(conversation) {
    const details = await this.fetchConversationDetails(conversation.id);
    if (!details) return null;

    const analysis = {
      conversationId: conversation.id,
      timestamp: conversation.created_at,
      duration: conversation.duration || 0,
      messageCount: conversation.transcript?.length || 0,
      failureReason: conversation.failure_reason || 'Unknown',
      issues: [],
      userIntent: null,
      agentResponse: null,
      transcript: conversation.transcript || [],
      toolCalls: conversation.tool_calls || [],
      metadata: conversation.metadata || {}
    };

    // Analyze transcript
    if (conversation.transcript) {
      const userMessages = conversation.transcript.filter(turn => turn.role === 'user');
      const agentMessages = conversation.transcript.filter(turn => turn.role === 'agent');

      // Get first user message
      const firstUserMessage = userMessages.find(turn => turn.message && turn.message.trim());
      if (firstUserMessage) {
        analysis.userIntent = firstUserMessage.message;
      }

      // Get last agent message
      const lastAgentMessage = agentMessages[agentMessages.length - 1];
      if (lastAgentMessage) {
        analysis.agentResponse = lastAgentMessage.message;
      }

      // Check for specific issues
      const interrupted = conversation.transcript.some(turn => turn.interrupted);
      if (interrupted) {
        analysis.issues.push('Interrupted conversation');
      }

      const emptyResponses = agentMessages.filter(msg => !msg.message || msg.message.trim() === '');
      if (emptyResponses.length > 0) {
        analysis.issues.push('Empty agent responses');
      }

      // Check for tool failures
      if (conversation.tool_calls) {
        const failedTools = conversation.tool_calls.filter(tool => 
          tool.status === 'error' || tool.error
        );
        if (failedTools.length > 0) {
          analysis.issues.push('Tool execution failures');
        }
      }

      // Check for language issues
      const hasFrench = conversation.transcript.some(turn => 
        turn.message && (turn.message.includes('french') || turn.message.includes('français'))
      );
      if (hasFrench) {
        analysis.issues.push('Language handling issues');
      }
    }

    return analysis;
  }

  // Run comprehensive analysis
  async runComprehensiveAnalysis() {
    console.log("🚀 Starting Deployed Agent Failure Analysis...");
    console.log("=" .repeat(60));

    // 1. Fetch failure conversations
    const conversationData = await this.fetchFailureConversations();
    if (!conversationData) {
      console.error("❌ Failed to fetch conversation data");
      return;
    }

    // 2. Analyze failure patterns
    const patterns = this.analyzeFailurePatterns(this.failureConversations);
    
    // 3. Analyze individual conversations (limit to first 20 for detailed analysis)
    console.log("\n🔍 Analyzing individual failure conversations...");
    const detailedAnalyses = [];
    
    for (let i = 0; i < Math.min(this.failureConversations.length, 20); i++) {
      const conversation = this.failureConversations[i];
      console.log(`\n📋 Analyzing conversation ${i + 1}/${Math.min(this.failureConversations.length, 20)}: ${conversation.id}`);
      
      const analysis = await this.analyzeConversationDetails(conversation);
      if (analysis) {
        detailedAnalyses.push(analysis);
        console.log(`   Issues: ${analysis.issues.join(', ') || 'None identified'}`);
        console.log(`   User Intent: ${analysis.userIntent || 'Not identified'}`);
        console.log(`   Duration: ${analysis.duration}s`);
      }
    }

    // 4. Generate comprehensive report
    this.generateComprehensiveReport(conversationData, patterns, detailedAnalyses);
  }

  // Generate comprehensive report
  generateComprehensiveReport(conversationData, patterns, detailedAnalyses) {
    console.log("\n" + "=".repeat(60));
    console.log("📊 DEPLOYED AGENT FAILURE ANALYSIS REPORT");
    console.log("=".repeat(60));

    // Overall statistics
    console.log(`\n📈 OVERALL STATISTICS:`);
    console.log(`   Total Conversations: ${conversationData.totalConversations}`);
    console.log(`   Failure Conversations: ${conversationData.failureConversations.length}`);
    console.log(`   Success Rate: ${conversationData.successRate}%`);
    console.log(`   Failure Rate: ${conversationData.failureRate}%`);

    // Failure patterns
    console.log(`\n🔍 FAILURE PATTERNS:`);
    console.log(`   Interruption Rate: ${patterns.interruptionRate}%`);
    console.log(`   Empty Responses: ${patterns.emptyResponses}%`);
    console.log(`   Tool Failures: ${patterns.toolFailures}%`);
    console.log(`   Language Issues: ${patterns.languageIssues}%`);
    console.log(`   Transfer Failures: ${patterns.transferFailures}%`);
    console.log(`   Tracking Failures: ${patterns.trackingFailures}%`);

    // Common issues
    const allIssues = detailedAnalyses.flatMap(analysis => analysis.issues);
    const issueCounts = {};
    allIssues.forEach(issue => {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });

    if (Object.keys(issueCounts).length > 0) {
      console.log(`\n⚠️  COMMON ISSUES:`);
      Object.entries(issueCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([issue, count]) => {
          console.log(`   - ${issue}: ${count} occurrences`);
        });
    }

    // User intent patterns
    const userIntents = detailedAnalyses
      .map(analysis => analysis.userIntent)
      .filter(intent => intent)
      .slice(0, 10);

    if (userIntents.length > 0) {
      console.log(`\n👤 COMMON USER INTENTS:`);
      userIntents.forEach((intent, index) => {
        console.log(`   ${index + 1}. "${intent}"`);
      });
    }

    // Save detailed results
    this.saveDetailedResults(conversationData, patterns, detailedAnalyses);
  }

  // Save detailed results
  async saveDetailedResults(conversationData, patterns, detailedAnalyses) {
    const report = {
      agentId: this.agentId,
      analysisDate: new Date().toISOString(),
      summary: {
        totalConversations: conversationData.totalConversations,
        failureConversations: conversationData.failureConversations.length,
        successRate: conversationData.successRate,
        failureRate: conversationData.failureRate,
        interruptionRate: parseFloat(patterns.interruptionRate),
        emptyResponses: parseFloat(patterns.emptyResponses),
        toolFailures: parseFloat(patterns.toolFailures),
        languageIssues: parseFloat(patterns.languageIssues),
        transferFailures: parseFloat(patterns.transferFailures),
        trackingFailures: parseFloat(patterns.trackingFailures)
      },
      failurePatterns: patterns,
      detailedAnalyses: detailedAnalyses,
      recommendations: this.generateRecommendations(patterns, detailedAnalyses)
    };

    try {
      await fs.writeFile('deployed_agent_failure_analysis.json', JSON.stringify(report, null, 2));
      console.log("\n💾 Detailed analysis saved to deployed_agent_failure_analysis.json");
    } catch (error) {
      console.error("❌ Failed to save results:", error.message);
    }
  }

  // Generate recommendations
  generateRecommendations(patterns, detailedAnalyses) {
    const recommendations = [];
    
    if (parseFloat(patterns.interruptionRate) > 30) {
      recommendations.push({
        priority: "HIGH",
        category: "Interruption Rate",
        issue: `High interruption rate: ${patterns.interruptionRate}%`,
        recommendation: "Review greeting length and response timing to reduce interruptions"
      });
    }
    
    if (parseFloat(patterns.emptyResponses) > 20) {
      recommendations.push({
        priority: "HIGH",
        category: "Empty Responses",
        issue: `High empty response rate: ${patterns.emptyResponses}%`,
        recommendation: "Investigate agent response generation and fix empty response issues"
      });
    }
    
    if (parseFloat(patterns.toolFailures) > 15) {
      recommendations.push({
        priority: "HIGH",
        category: "Tool Failures",
        issue: `High tool failure rate: ${patterns.toolFailures}%`,
        recommendation: "Review tool integrations and error handling"
      });
    }
    
    if (parseFloat(patterns.languageIssues) > 10) {
      recommendations.push({
        priority: "MEDIUM",
        category: "Language Issues",
        issue: `Language issues: ${patterns.languageIssues}%`,
        recommendation: "Improve language detection and switching capabilities"
      });
    }
    
    if (parseFloat(patterns.transferFailures) > 20) {
      recommendations.push({
        priority: "HIGH",
        category: "Transfer Failures",
        issue: `High transfer failure rate: ${patterns.transferFailures}%`,
        recommendation: "Review transfer logic and confirmation process"
      });
    }
    
    if (parseFloat(patterns.trackingFailures) > 25) {
      recommendations.push({
        priority: "HIGH",
        category: "Tracking Failures",
        issue: `High tracking failure rate: ${patterns.trackingFailures}%`,
        recommendation: "Review shipment tracking tool integration and error handling"
      });
    }
    
    return recommendations;
  }
}

// Run the analysis
async function main() {
  const agentId = "agent_5801k0x0n8vkfxs9z19e1n060hvr"; // Deployed agent ID
  const apiKey = "YOUR_ELEVENLABS_API_KEY"; // Replace with actual API key
  
  const analyzer = new DeployedAgentAnalyzer(agentId, apiKey);
  
  console.log("🚀 Starting Deployed Agent Failure Analysis...");
  console.log(`🎯 Analyzing Agent: ${agentId}`);
  console.log("📋 Fetching failure conversations and analyzing patterns");
  
  await analyzer.runComprehensiveAnalysis();
}

main().catch(console.error);
