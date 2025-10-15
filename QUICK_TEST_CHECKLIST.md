# ⚡ QUICK TEST CHECKLIST - Live Agent

**Agent URL**: [https://elevenlabs.io/app/agents/talk-to/agent_9101k7k93nkwf37976sfy4mdsc4n](https://elevenlabs.io/app/agents/talk-to/agent_9101k7k93nkwf37976sfy4mdsc4n)  
**Test Time**: 5-10 minutes  
**Priority**: 🚨 **CRITICAL TESTS**  

---

## 🎯 Essential Tests (Must Do)

### **✅ Test 1: Basic Greeting**
- [ ] Open agent URL
- [ ] Listen to greeting
- [ ] **Check**: Is it short (under 20 words)?
- [ ] **Check**: Is it single language (not bilingual)?
- [ ] **Result**: [ ] Pass [ ] Fail

### **✅ Test 2: Invalid Shipment ID "123" (CRITICAL)**
- [ ] Say: "I want to track a shipment"
- [ ] When asked for ID, say: "123"
- [ ] **Check**: Does agent reject it?
- [ ] **Check**: Does agent explain correct format?
- [ ] **Result**: [ ] Pass [ ] Fail

### **✅ Test 3: Valid Shipment ID**
- [ ] Say: "I want to track a shipment"
- [ ] When asked for ID, say: "513-361-60002"
- [ ] **Check**: Does agent process it?
- [ ] **Check**: Does agent provide status?
- [ ] **Result**: [ ] Pass [ ] Fail

### **✅ Test 4: French Transfer Request**
- [ ] Say: "J'aimerais parler à un agent"
- [ ] **Check**: Does agent respond in French?
- [ ] **Check**: Does agent initiate transfer?
- [ ] **Result**: [ ] Pass [ ] Fail

### **✅ Test 5: English Transfer Request**
- [ ] Say: "I want to speak to a human agent"
- [ ] **Check**: Does agent respond in English?
- [ ] **Check**: Does agent initiate transfer?
- [ ] **Result**: [ ] Pass [ ] Fail

---

## 📊 Quick Score

**Pass Rate**: ___/5 (Target: 5/5)

- **5/5**: ✅ **EXCELLENT** - Agent working perfectly
- **4/5**: ✅ **GOOD** - Minor issues, mostly working
- **3/5**: ⚠️ **NEEDS WORK** - Several issues identified
- **Below 3/5**: 🚨 **CRITICAL** - Major problems, needs immediate attention

---

## 🚨 Critical Issues to Watch For

### **If Test 2 Fails (Invalid ID "123"):**
- **Problem**: Agent accepts invalid input
- **Impact**: Users can't get proper help
- **Fix**: Update prompt to reject invalid formats

### **If Test 4 or 5 Fails (Transfer Requests):**
- **Problem**: Transfers not working
- **Impact**: Users can't reach human agents
- **Fix**: Check transfer configuration

### **If Test 1 Fails (Greeting):**
- **Problem**: Long or bilingual greeting
- **Impact**: Users hang up early
- **Fix**: Shorten greeting, use single language

---

## 📝 Quick Notes

**Test Date**: ___________
**Overall Performance**: [ ] Excellent [ ] Good [ ] Needs Work [ ] Critical Issues

**Issues Found**:
1. ___________
2. ___________
3. ___________

**Immediate Actions Needed**:
1. ___________
2. ___________
3. ___________

---

## 🚀 Next Steps

### **If All Tests Pass (5/5):**
- ✅ **Agent is working well**
- ✅ **Deploy with confidence**
- ✅ **Monitor performance**
- ✅ **Run full test suite weekly**

### **If Some Tests Fail (3-4/5):**
- ⚠️ **Identify specific issues**
- ⚠️ **Fix critical problems**
- ⚠️ **Re-test after fixes**
- ⚠️ **Consider prompt improvements**

### **If Most Tests Fail (Below 3/5):**
- 🚨 **Major issues identified**
- 🚨 **Do not deploy yet**
- 🚨 **Fix all critical issues first**
- 🚨 **Run comprehensive testing**

---

## 🔗 Full Testing Guide

For comprehensive testing, use the full guide:
**`LIVE_AGENT_TESTING_GUIDE.md`** - Complete testing framework with 15+ test scenarios

---

**Quick Checklist Created**: October 15, 2025  
**Status**: ⚡ **READY FOR IMMEDIATE TESTING**  
**Estimated Time**: 5-10 minutes
