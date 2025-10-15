# 🧪 LIVE AGENT TESTING GUIDE

**Agent URL**: [https://elevenlabs.io/app/agents/talk-to/agent_9101k7k93nkwf37976sfy4mdsc4n](https://elevenlabs.io/app/agents/talk-to/agent_9101k7k93nkwf37976sfy4mdsc4n)  
**Agent ID**: `agent_9101k7k93nkwf37976sfy4mdsc4n`  
**Test Date**: October 15, 2025  
**Status**: 🚀 **READY FOR TESTING**  

---

## 🎯 Testing Overview

This guide provides a systematic approach to test your live ElevenLabs agent using the official testing framework. Based on our comprehensive analysis of 1,707 failed conversations, we've identified the critical test scenarios that will validate your agent's performance.

## 📋 Pre-Test Checklist

### **Before You Start Testing:**
- [ ] **Agent is accessible** - Can you reach the agent URL?
- [ ] **Microphone permissions** - Browser allows microphone access
- [ ] **Audio working** - You can hear the agent's voice
- [ ] **Test environment ready** - Quiet space for testing
- [ ] **Recording capability** - Can record conversations for analysis

---

## 🧪 Test Scenarios

### **Phase 1: Basic Functionality Tests**

#### **Test 1.1: Greeting Test**
**Objective**: Verify agent uses short, single-language greeting
**Test Steps**:
1. Open agent URL
2. Wait for agent to speak
3. Listen to greeting length and language

**Expected Results**:
- ✅ **Short greeting** (under 20 words)
- ✅ **Single language** (not bilingual)
- ✅ **Professional tone**
- ✅ **Clear pronunciation**

**Success Criteria**: Agent greets you briefly in one language

---

#### **Test 1.2: Language Detection Test**
**Objective**: Test agent's language detection capability
**Test Steps**:
1. Start conversation
2. Speak in French: "Bonjour, je voudrais suivre un colis"
3. Observe agent's response language

**Expected Results**:
- ✅ **Detects French** and responds in French
- ✅ **Consistent language** throughout conversation
- ✅ **Natural conversation flow**

**Success Criteria**: Agent switches to French and maintains it

---

#### **Test 1.3: English Language Test**
**Objective**: Test English language handling
**Test Steps**:
1. Start new conversation
2. Speak in English: "Hi, I need to track a package"
3. Observe agent's response

**Expected Results**:
- ✅ **Detects English** and responds in English
- ✅ **Natural English conversation**
- ✅ **Professional tone**

**Success Criteria**: Agent responds naturally in English

---

### **Phase 2: Core Functionality Tests**

#### **Test 2.1: Valid Shipment ID Test**
**Objective**: Test successful shipment tracking
**Test Steps**:
1. Start conversation
2. Say: "I want to track a shipment"
3. When asked for ID, say: "513-361-60002"
4. Observe agent's response

**Expected Results**:
- ✅ **Asks for shipment ID**
- ✅ **Uses getShipment tool**
- ✅ **Provides status information**
- ✅ **Offers follow-up help**

**Success Criteria**: Agent successfully tracks the shipment

---

#### **Test 2.2: Invalid Shipment ID Test (Critical)**
**Objective**: Test handling of invalid shipment ID "123"
**Test Steps**:
1. Start conversation
2. Say: "I want to track a shipment"
3. When asked for ID, say: "123"
4. Observe agent's response

**Expected Results**:
- ✅ **Rejects invalid format**
- ✅ **Explains correct format**
- ✅ **Asks for proper ID**
- ✅ **Maintains helpful tone**

**Success Criteria**: Agent properly rejects "123" and explains format

---

#### **Test 2.3: Other Invalid Inputs Test**
**Objective**: Test various invalid shipment ID formats
**Test Steps**:
1. Test with "abc123" - should reject alphanumeric
2. Test with "123!@#" - should reject special characters
3. Test with "123 456 789" - should reject spaces
4. Test with empty input - should ask again

**Expected Results**:
- ✅ **Rejects all invalid formats**
- ✅ **Explains format requirements**
- ✅ **Asks for correct input**
- ✅ **Handles gracefully**

**Success Criteria**: Agent rejects all invalid inputs appropriately

---

### **Phase 3: Transfer Request Tests**

#### **Test 3.1: French Transfer Request**
**Objective**: Test French transfer request handling
**Test Steps**:
1. Start conversation in French
2. Say: "J'aimerais parler à un agent"
3. Observe agent's response and follow-up

**Expected Results**:
- ✅ **Acknowledges request in French**
- ✅ **Confirms transfer intention**
- ✅ **Initiates transfer process**
- ✅ **Completes transfer**

**Success Criteria**: Transfer request handled smoothly in French

---

#### **Test 3.2: English Transfer Request**
**Objective**: Test English transfer request handling
**Test Steps**:
1. Start conversation in English
2. Say: "I want to speak to a human agent"
3. Observe agent's response

**Expected Results**:
- ✅ **Acknowledges request in English**
- ✅ **Confirms transfer**
- ✅ **Completes transfer process**

**Success Criteria**: Transfer request handled smoothly in English

---

#### **Test 3.3: Specific Person Transfer**
**Objective**: Test specific person transfer request
**Test Steps**:
1. Start conversation
2. Say: "I want to speak to John Smith"
3. Observe agent's response

**Expected Results**:
- ✅ **Explains limitation**
- ✅ **Offers extension line transfer**
- ✅ **Asks for confirmation**
- ✅ **Maintains professional tone**

**Success Criteria**: Agent handles specific person request appropriately

---

### **Phase 4: Edge Case Tests**

#### **Test 4.1: Language Switching Test**
**Objective**: Test language switching during conversation
**Test Steps**:
1. Start in French: "Bonjour, je voudrais suivre un colis"
2. After agent responds, say: "Can you switch to English?"
3. Continue conversation in English

**Expected Results**:
- ✅ **Starts in French**
- ✅ **Switches to English smoothly**
- ✅ **Maintains conversation context**
- ✅ **Natural language transition**

**Success Criteria**: Smooth language switching without confusion

---

#### **Test 4.2: Interruption Handling Test**
**Objective**: Test agent's handling of interruptions
**Test Steps**:
1. Start conversation
2. Interrupt agent while speaking
3. Continue with your request
4. Observe agent's response

**Expected Results**:
- ✅ **Handles interruption gracefully**
- ✅ **Continues conversation naturally**
- ✅ **Maintains professional tone**
- ✅ **Processes your request**

**Success Criteria**: Agent handles interruptions without confusion

---

#### **Test 4.3: Multiple Requests Test**
**Objective**: Test handling of multiple rapid requests
**Test Steps**:
1. Start conversation
2. Say: "I want to track 123 and 456 and 789"
3. Observe agent's response

**Expected Results**:
- ✅ **Asks for one at a time**
- ✅ **Handles multiple requests appropriately**
- ✅ **Maintains conversation flow**

**Success Criteria**: Agent manages multiple requests effectively

---

### **Phase 5: Error Handling Tests**

#### **Test 5.1: Empty Response Test**
**Objective**: Test agent's handling of empty responses
**Test Steps**:
1. Start conversation
2. Stay silent when agent asks a question
3. Observe agent's response

**Expected Results**:
- ✅ **Asks for clarification**
- ✅ **Maintains helpful tone**
- ✅ **Doesn't repeat endlessly**

**Success Criteria**: Agent handles silence appropriately

---

#### **Test 5.2: Unclear Input Test**
**Objective**: Test agent's handling of unclear input
**Test Steps**:
1. Start conversation
2. Say something unclear: "I need help with... um... something"
3. Observe agent's response

**Expected Results**:
- ✅ **Asks for clarification**
- ✅ **Offers specific help options**
- ✅ **Maintains patience**

**Success Criteria**: Agent handles unclear input gracefully

---

## 📊 Testing Scorecard

### **Test Results Tracking**

| Test Category | Test Name | Pass/Fail | Notes | Score |
|---------------|-----------|-----------|-------|-------|
| **Basic Functionality** | Greeting Test | [ ] Pass [ ] Fail | | /10 |
| | Language Detection | [ ] Pass [ ] Fail | | /10 |
| | English Language | [ ] Pass [ ] Fail | | /10 |
| **Core Functionality** | Valid Shipment ID | [ ] Pass [ ] Fail | | /10 |
| | Invalid ID "123" | [ ] Pass [ ] Fail | | /10 |
| | Other Invalid Inputs | [ ] Pass [ ] Fail | | /10 |
| **Transfer Requests** | French Transfer | [ ] Pass [ ] Fail | | /10 |
| | English Transfer | [ ] Pass [ ] Fail | | /10 |
| | Specific Person | [ ] Pass [ ] Fail | | /10 |
| **Edge Cases** | Language Switching | [ ] Pass [ ] Fail | | /10 |
| | Interruption Handling | [ ] Pass [ ] Fail | | /10 |
| | Multiple Requests | [ ] Pass [ ] Fail | | /10 |
| **Error Handling** | Empty Response | [ ] Pass [ ] Fail | | /10 |
| | Unclear Input | [ ] Pass [ ] Fail | | /10 |

**Total Score**: ___/130 (Target: 110+ for excellent performance)

---

## 🎯 Success Criteria

### **Excellent Performance (110+ points)**
- All critical tests pass
- Agent handles edge cases well
- Professional, helpful responses
- Smooth conversation flow

### **Good Performance (90-109 points)**
- Most tests pass
- Minor issues with edge cases
- Generally helpful responses
- Occasional conversation hiccups

### **Needs Improvement (Below 90 points)**
- Several tests fail
- Significant issues identified
- Requires prompt/system improvements

---

## 📝 Testing Notes Template

### **For Each Test Session:**

```
Test Date: ___________
Tester: ___________
Agent URL: https://elevenlabs.io/app/agents/talk-to/agent_9101k7k93nkwf37976sfy4mdsc4n

Test Results:
- Greeting: [ ] Pass [ ] Fail - Notes: ___________
- Language Detection: [ ] Pass [ ] Fail - Notes: ___________
- Valid Shipment ID: [ ] Pass [ ] Fail - Notes: ___________
- Invalid ID "123": [ ] Pass [ ] Fail - Notes: ___________
- Transfer Requests: [ ] Pass [ ] Fail - Notes: ___________
- Edge Cases: [ ] Pass [ ] Fail - Notes: ___________

Overall Score: ___/130
Performance Level: [ ] Excellent [ ] Good [ ] Needs Improvement

Key Issues Identified:
1. ___________
2. ___________
3. ___________

Recommendations:
1. ___________
2. ___________
3. ___________
```

---

## 🚀 Testing Schedule

### **Immediate Testing (Today)**
1. ✅ **Basic Functionality** - Greeting, language detection
2. ✅ **Core Functionality** - Shipment tracking, invalid inputs
3. ✅ **Transfer Requests** - French and English transfers

### **Comprehensive Testing (This Week)**
1. ✅ **Edge Cases** - Language switching, interruptions
2. ✅ **Error Handling** - Empty responses, unclear input
3. ✅ **Performance Validation** - Overall score assessment

### **Ongoing Testing (Regular)**
1. ✅ **Weekly Spot Checks** - Random testing
2. ✅ **Monthly Comprehensive** - Full test suite
3. ✅ **After Changes** - Test after any modifications

---

## 🔧 Troubleshooting

### **Common Issues and Solutions**

#### **Agent Not Responding**
- Check microphone permissions
- Refresh the page
- Try different browser
- Check internet connection

#### **Audio Quality Issues**
- Use headphones
- Check microphone quality
- Ensure quiet environment
- Test with different devices

#### **Language Detection Problems**
- Speak clearly
- Use standard phrases
- Try different languages
- Check agent configuration

#### **Tool Execution Failures**
- Verify agent configuration
- Check tool integrations
- Test with valid inputs
- Review error messages

---

## 📊 Expected Results

Based on our comprehensive testing framework, your agent should achieve:

- **85%+ Overall Pass Rate** - Most tests should pass
- **Perfect Invalid Input Handling** - "123" should be rejected properly
- **100% Language Support** - Smooth French/English handling
- **100% Transfer Success** - All transfer requests should work
- **Robust Edge Case Handling** - Graceful handling of unusual scenarios

---

## 🏁 Conclusion

This testing guide provides a systematic approach to validate your agent's performance. Follow the test scenarios in order, document your results, and use the scorecard to track progress.

**Remember**: The goal is to ensure your agent provides excellent customer service and handles all scenarios gracefully.

---

**Guide Created**: October 15, 2025  
**Testing Framework**: ElevenLabs Agent Testing  
**Status**: 🚀 **READY FOR TESTING**  
**Next Step**: Begin with Phase 1 Basic Functionality Tests
