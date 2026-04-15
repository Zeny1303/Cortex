// Mock question bank — replace with backend API calls later

export const DSA_QUESTIONS = {
  easy: [
    {
      id: 'dsa-e-1',
      title: 'Two Sum',
      difficulty: 'Easy',
      tags: ['Array', 'Hash Map'],
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
  Input: nums = [2,7,11,15], target = 9
  Output: [0,1]
  Explanation: nums[0] + nums[1] = 2 + 7 = 9`,
      starter_code: { python: 'def two_sum(nums, target):\n    # Your solution here\n    pass\n' },
      followUps: [
        'What is the time complexity of your solution?',
        'Can you solve it in O(n) time?',
        'What if the array was sorted — would you use a different approach?',
      ],
    },
    {
      id: 'dsa-e-2',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      tags: ['Stack', 'String'],
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
  - Open brackets must be closed by the same type of brackets.
  - Open brackets must be closed in the correct order.

Example:
  Input: s = "()[]{}"
  Output: true`,
      starter_code: { python: 'def is_valid(s):\n    # Your solution here\n    pass\n' },
      followUps: [
        'What data structure did you use and why?',
        'What is the space complexity?',
        'How would you handle an empty string?',
      ],
    },
  ],
  medium: [
    {
      id: 'dsa-m-1',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      tags: ['Sliding Window', 'Hash Map', 'String'],
      description: `Given a string s, find the length of the longest substring without repeating characters.

Example:
  Input: s = "abcabcbb"
  Output: 3
  Explanation: The answer is "abc", with the length of 3.`,
      starter_code: { python: 'def length_of_longest_substring(s):\n    # Your solution here\n    pass\n' },
      followUps: [
        'Walk me through your sliding window approach.',
        'What is the time and space complexity?',
        'How would you handle Unicode characters?',
      ],
    },
    {
      id: 'dsa-m-2',
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      tags: ['BFS', 'Tree', 'Queue'],
      description: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

Example:
  Input: root = [3,9,20,null,null,15,7]
  Output: [[3],[9,20],[15,7]]`,
      starter_code: { python: 'def level_order(root):\n    # Your solution here\n    pass\n' },
      followUps: [
        'Why did you choose BFS over DFS here?',
        'How would you modify this for a zigzag traversal?',
        'What is the space complexity in the worst case?',
      ],
    },
  ],
  hard: [
    {
      id: 'dsa-h-1',
      title: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      tags: ['Heap', 'Linked List', 'Divide & Conquer'],
      description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example:
  Input: lists = [[1,4,5],[1,3,4],[2,6]]
  Output: [1,1,2,3,4,4,5,6]`,
      starter_code: { python: 'def merge_k_lists(lists):\n    # Your solution here\n    pass\n' },
      followUps: [
        'What is the time complexity of your heap approach?',
        'How does divide and conquer compare to the heap approach?',
        'What edge cases did you consider?',
      ],
    },
  ],
};

export const FRONTEND_QUESTIONS = {
  easy: [
    {
      id: 'fe-e-1',
      title: 'Build a Toggle Button',
      difficulty: 'Easy',
      tags: ['React', 'State', 'CSS'],
      description: `Build a toggle button component in React that:
  - Shows "ON" when active (green background)
  - Shows "OFF" when inactive (grey background)
  - Toggles state on click
  - Is accessible (keyboard navigable, proper aria attributes)

Bonus: Add a smooth CSS transition between states.`,
      starter_code: null,
      followUps: [
        'How would you make this component reusable?',
        'What accessibility attributes did you add and why?',
        'How would you test this component?',
      ],
    },
  ],
  medium: [
    {
      id: 'fe-m-1',
      title: 'Implement Infinite Scroll',
      difficulty: 'Medium',
      tags: ['React', 'Intersection Observer', 'Performance'],
      description: `Implement an infinite scroll list that:
  - Loads 10 items initially
  - Fetches more items when the user scrolls near the bottom
  - Shows a loading spinner while fetching
  - Handles errors gracefully
  - Avoids unnecessary re-renders

Use the Intersection Observer API (not scroll events).`,
      starter_code: null,
      followUps: [
        'Why use Intersection Observer instead of scroll events?',
        'How would you handle the case where there are no more items?',
        'How would you debounce or throttle this?',
      ],
    },
    {
      id: 'fe-m-2',
      title: 'CSS Grid Layout Challenge',
      difficulty: 'Medium',
      tags: ['CSS', 'Grid', 'Responsive'],
      description: `Build a responsive dashboard layout using CSS Grid:
  - Sidebar (fixed 240px on desktop, hidden on mobile)
  - Header (full width, 60px height)
  - Main content area (fills remaining space)
  - Footer (full width, 40px height)

On mobile (< 768px): sidebar becomes a bottom nav bar.`,
      starter_code: null,
      followUps: [
        'When would you use Grid vs Flexbox?',
        'How does your layout handle very long content?',
        'How would you animate the sidebar open/close?',
      ],
    },
  ],
  hard: [
    {
      id: 'fe-h-1',
      title: 'Build a Virtual List',
      difficulty: 'Hard',
      tags: ['React', 'Performance', 'DOM'],
      description: `Implement a virtualized list component that can render 100,000 items without performance issues.

Requirements:
  - Only render visible items + a small buffer
  - Support variable item heights
  - Maintain scroll position correctly
  - No external libraries (react-window, etc.)`,
      starter_code: null,
      followUps: [
        'How do you calculate which items are visible?',
        'How do you handle variable height items?',
        'What is the memory footprint of your approach?',
      ],
    },
  ],
};

export const BACKEND_QUESTIONS = {
  easy: [
    {
      id: 'be-e-1',
      title: 'Design a Rate Limiter',
      difficulty: 'Easy',
      tags: ['API Design', 'Redis', 'Algorithms'],
      description: `Design a simple rate limiter that:
  - Allows 100 requests per minute per user
  - Returns HTTP 429 when limit is exceeded
  - Resets the counter every minute

Describe your approach, data structures, and any trade-offs.
You can write pseudocode or actual code.`,
      starter_code: { python: '# Design your rate limiter\n# Consider: storage, algorithm, edge cases\n\nclass RateLimiter:\n    def __init__(self):\n        pass\n    \n    def is_allowed(self, user_id: str) -> bool:\n        pass\n' },
      followUps: [
        'What algorithm did you use — token bucket, sliding window, or fixed window?',
        'How would you handle distributed systems with multiple servers?',
        'What happens if Redis goes down?',
      ],
    },
  ],
  medium: [
    {
      id: 'be-m-1',
      title: 'Design a URL Shortener API',
      difficulty: 'Medium',
      tags: ['REST API', 'Database', 'Hashing'],
      description: `Design the backend for a URL shortener (like bit.ly):

Endpoints needed:
  POST /shorten  → { url } → { short_code, short_url }
  GET  /:code    → redirect to original URL
  GET  /stats/:code → { clicks, created_at, original_url }

Consider: collision handling, expiry, analytics, scale.`,
      starter_code: { python: '# Design your URL shortener\n# Define your data models and API logic\n\nfrom typing import Optional\n\nclass URLShortener:\n    def shorten(self, url: str) -> str:\n        pass\n    \n    def resolve(self, code: str) -> Optional[str]:\n        pass\n' },
      followUps: [
        'How do you generate unique short codes?',
        'How would you handle 1 billion URLs?',
        'How would you implement analytics without slowing down redirects?',
      ],
    },
  ],
  hard: [
    {
      id: 'be-h-1',
      title: 'Design a Distributed Job Queue',
      difficulty: 'Hard',
      tags: ['Distributed Systems', 'Queue', 'Reliability'],
      description: `Design a distributed job queue system that:
  - Accepts jobs via REST API
  - Distributes jobs to multiple workers
  - Guarantees at-least-once delivery
  - Handles worker failures gracefully
  - Supports job priorities and retries

Discuss architecture, failure modes, and consistency guarantees.`,
      starter_code: null,
      followUps: [
        'How do you prevent duplicate job execution?',
        'How do you handle a worker that crashes mid-job?',
        'How would you scale this to 10,000 jobs/second?',
      ],
    },
  ],
};

export const SYSTEM_QUESTIONS = {
  easy: [
    {
      id: 'sys-e-1',
      title: 'Design a Parking Lot System',
      difficulty: 'Easy',
      tags: ['OOP', 'System Design', 'Data Modeling'],
      description: `Design a parking lot system that supports:
  - Multiple floors and spots (compact, regular, large)
  - Entry/exit tracking
  - Fee calculation based on duration
  - Finding the nearest available spot

Start with the object model, then discuss the data flow.`,
      starter_code: null,
      followUps: [
        'How would you handle concurrent entries?',
        'How would you add EV charging spots?',
        'How would you scale this to 100 parking lots?',
      ],
    },
  ],
  medium: [
    {
      id: 'sys-m-1',
      title: 'Design Twitter/X Feed',
      difficulty: 'Medium',
      tags: ['Feed Design', 'Caching', 'Scale'],
      description: `Design the Twitter home feed system:
  - Users follow other users
  - Home feed shows tweets from followed users, newest first
  - Support 100M daily active users
  - Feed must load in < 200ms

Discuss: fan-out on write vs read, caching strategy, database schema.`,
      starter_code: null,
      followUps: [
        'Fan-out on write vs fan-out on read — which would you choose and why?',
        'How do you handle celebrities with 50M followers?',
        'How would you implement the ranking algorithm?',
      ],
    },
  ],
  hard: [
    {
      id: 'sys-h-1',
      title: 'Design a Global CDN',
      difficulty: 'Hard',
      tags: ['CDN', 'Distributed Systems', 'Networking'],
      description: `Design a Content Delivery Network (CDN) that:
  - Serves static assets globally with < 50ms latency
  - Handles 10TB of content
  - Supports cache invalidation
  - Handles 1M requests/second at peak

Cover: PoP placement, routing, cache hierarchy, invalidation strategies.`,
      starter_code: null,
      followUps: [
        'How do you route users to the nearest PoP?',
        'How do you handle cache invalidation at global scale?',
        'How do you handle a PoP going down?',
      ],
    },
  ],
};

export function getQuestionsForSession(type, difficulty, count) {
  const bank = {
    dsa: DSA_QUESTIONS,
    frontend: FRONTEND_QUESTIONS,
    backend: BACKEND_QUESTIONS,
    system: SYSTEM_QUESTIONS,
  }[type] || DSA_QUESTIONS;

  const pool = bank[difficulty?.toLowerCase()] || bank.medium || [];
  // Return up to `count` questions, cycling if needed
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
}
