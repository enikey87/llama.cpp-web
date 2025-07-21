# UI Refactoring Plan

## 🎯 **CRITICAL PRIORITIES** (Must Fix)

### **1. Testing Implementation** 
**Impact**: High - No test coverage means unreliable code
**Effort**: Medium

```typescript
// TASK: Create test files for critical components
// Files to create:
// - src/__tests__/ChatWindow.test.tsx
// - src/__tests__/chatStore.test.ts
// - src/__tests__/api.test.ts
// - src/__tests__/database.test.ts

// Example test structure:
describe('ChatWindow', () => {
  it('should send message and display response', async () => {
    // Test message sending flow
  });
  
  it('should handle streaming responses', async () => {
    // Test streaming functionality
  });
  
  it('should handle errors gracefully', async () => {
    // Test error scenarios
  });
});
```

### **2. Environment Configuration**
**Impact**: High - Hardcoded API endpoints are security risk
**Effort**: Low

```typescript
// TASK: Replace hardcoded API_BASE with environment variables
// File: src/services/api.ts

// BEFORE:
const API_BASE = 'http://localhost:11434/api';

// AFTER:
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:11434/api';

// TASK: Create .env files
// .env.development
REACT_APP_API_BASE=http://localhost:11434/api

// .env.production  
REACT_APP_API_BASE=https://your-production-api.com/api
```

### **3. Error Boundaries**
**Impact**: High - Unhandled errors crash the app
**Effort**: Low

```typescript
// TASK: Create error boundary component
// File: src/components/ErrorBoundary.tsx

class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chat Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// TASK: Wrap main components with ErrorBoundary
// File: src/App.tsx
<ErrorBoundary>
  <ChatWindow />
</ErrorBoundary>
```

---

## ⚠️ **HIGH PRIORITY** (Should Fix Soon)

### **4. Performance Optimization**
**Impact**: Medium-High - Large chats will be slow
**Effort**: High

```typescript
// TASK: Implement virtual scrolling for large message lists
// File: src/components/ChatWindow.tsx

// Add react-window for virtual scrolling
import { FixedSizeList as List } from 'react-window';

// TASK: Add pagination for chat list
// File: src/services/database.ts

async getChats(limit = 20, offset = 0): Promise<Chat[]> {
  return await db.chats
    .orderBy('updatedAt')
    .reverse()
    .offset(offset)
    .limit(limit)
    .toArray();
}

// TASK: Optimize re-renders with React.memo
// File: src/components/MessageBubble.tsx
export default React.memo(MessageBubble);
```

### **5. API Error Handling Enhancement**
**Impact**: Medium - Poor error messages confuse users
**Effort**: Medium

```typescript
// TASK: Improve API error handling
// File: src/services/api.ts

// BEFORE:
if (!response.ok) throw new Error('Failed to send chat message');

// AFTER:
if (!response.ok) {
  const errorText = await response.text();
  const status = response.status;
  
  switch (status) {
    case 404:
      throw new Error('Model not found. Please check your model selection.');
    case 500:
      throw new Error('Server error. Please try again later.');
    case 413:
      throw new Error('Message too long. Please shorten your message.');
    default:
      throw new Error(`Request failed: ${errorText || 'Unknown error'}`);
  }
}
```

### **6. Database Schema Consolidation**
**Impact**: Medium - Multiple migrations are confusing
**Effort**: Medium

```typescript
// TASK: Consolidate database migrations
// File: src/services/database.ts

// BEFORE: Multiple version migrations
this.version(1).stores({...});
this.version(2).stores({...});
this.version(3).stores({...});
this.version(4).stores({...});

// AFTER: Single comprehensive migration
this.version(1).stores({
  chats: 'id, title, model, createdAt, updatedAt, sendFullHistory',
  messages: 'id, chatId, role, content, timestamp, [chatId+timestamp]'
});
```

---

## 🔧 **MEDIUM PRIORITY** (Nice to Have)

### **7. Constants and Configuration**
**Impact**: Low-Medium - Hardcoded values are maintenance burden
**Effort**: Low

```typescript
// TASK: Create constants file
// File: src/constants/index.ts

export const DEFAULT_MODEL = 'phi3-mini-4k-instruct';
export const DEFAULT_CHAT_TITLE = 'New Chat';
export const MAX_MESSAGE_LENGTH = 4000;
export const TITLE_MAX_LENGTH = 30;

// TASK: Use constants in components
// File: src/components/ChatList.tsx
import { DEFAULT_MODEL, DEFAULT_CHAT_TITLE } from '../constants';

const handleNewChat = () => {
  createChat(DEFAULT_CHAT_TITLE, DEFAULT_MODEL);
};
```

### **8. Mobile Experience Improvements**
**Impact**: Medium - Poor mobile UX
**Effort**: Medium

```typescript
// TASK: Add mobile-specific features
// File: src/components/ChatList.tsx

// Add collapsible sidebar for mobile
const [sidebarOpen, setSidebarOpen] = useState(true);

// Add mobile menu button
<button 
  className="mobile-menu-btn"
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  ☰
</button>
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Critical Fixes (Week 1)**
- [ ] **Create test files** for ChatWindow, chatStore, api, database
- [ ] **Add environment variables** for API endpoints
- [ ] **Implement ErrorBoundary** component and wrap main components
- [ ] **Add .env files** for development and production

### **Phase 2: Performance & Error Handling (Week 2)**
- [ ] **Implement virtual scrolling** for message lists
- [ ] **Add pagination** for chat lists
- [ ] **Enhance API error handling** with specific error messages
- [ ] **Consolidate database migrations** into single version
- [ ] **Add React.memo** to performance-critical components

### **Phase 3: Code Quality (Week 3)**
- [ ] **Create constants file** and replace hardcoded values
- [ ] **Improve mobile experience** with collapsible sidebar
- [ ] **Add loading states** for all async operations
- [ ] **Implement proper TypeScript strict mode**

### **Phase 4: Advanced Features (Week 4)**
- [ ] **Add search functionality** for chats and messages
- [ ] **Implement message export** feature
- [ ] **Add offline capabilities** with service worker
- [ ] **Implement caching strategy** for API responses

---

## 🚨 **CRITICAL FILES TO MODIFY**

### **High Impact Changes**
1. `src/services/api.ts` - Environment variables, error handling
2. `src/services/database.ts` - Migration consolidation
3. `src/components/ChatWindow.tsx` - Virtual scrolling, error boundaries
4. `src/App.tsx` - Error boundary wrapper

### **Medium Impact Changes**
1. `src/components/ChatList.tsx` - Pagination, mobile features
2. `src/store/chatStore.ts` - Performance optimizations
3. `src/components/MessageBubble.tsx` - React.memo optimization
4. `src/constants/index.ts` - New constants file

---

## 🎯 **SUCCESS CRITERIA**

### **Phase 1 Complete When:**
- [ ] All critical components have test coverage >80%
- [ ] API endpoints use environment variables
- [ ] Error boundaries catch and handle crashes gracefully
- [ ] No hardcoded API URLs in production

### **Phase 2 Complete When:**
- [ ] Chat with 1000+ messages scrolls smoothly
- [ ] Chat list loads quickly with pagination
- [ ] API errors show specific, helpful messages
- [ ] Database migrations are simplified

### **Phase 3 Complete When:**
- [ ] No magic numbers or hardcoded strings in components
- [ ] Mobile experience is touch-friendly
- [ ] All async operations show loading states
- [ ] TypeScript strict mode passes without errors

---

## ⚡ **QUICK WINS** (Can be done in 1-2 hours)

1. **Environment Variables** - Replace hardcoded API_BASE
2. **Constants File** - Extract magic numbers and strings
3. **Error Boundaries** - Add basic error handling
4. **React.memo** - Optimize MessageBubble component
5. **Better Error Messages** - Improve API error handling

---

## 🔍 **TESTING STRATEGY**

### **Unit Tests Priority Order:**
1. `chatStore.ts` - State management logic
2. `api.ts` - API service functions
3. `database.ts` - Database operations
4. `ChatWindow.tsx` - Main component logic
5. `MessageBubble.tsx` - Message display

### **Integration Tests:**
1. Message sending flow
2. Chat creation and switching
3. Settings persistence
4. Streaming response handling

### **E2E Tests:**
1. Complete chat conversation
2. Error scenarios
3. Mobile responsiveness

---

*This plan focuses on the most critical issues that will have the biggest impact on code quality, performance, and maintainability.* 