const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'data.json');

const INITIAL_USERS = [
    {
      "id": "usr-demo",
      "name": "Nawab Studio",
      "handle": "nawab_studio",
      "email": "demo@nawab.social",
      "bio": "B.Tech CSE Student | Full Stack Development | C++ & Data Structures and Algorithms (DSA) | Software Engineering Enthusiast",
      "location": "Hyderabad, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "September 2026",
      "following": [
        "usr-2",
        "usr-4"
      ],
      "followers": [
        "usr-10",
        "usr-8"
      ]
    },
    {
      "id": "usr-2",
      "name": "Aditi Rao",
      "handle": "aditi.builds",
      "email": "aditi@example.com",
      "bio": "Frontend explorer turning clean layouts into accessible, responsive experiences. 🎨",
      "location": "Bengaluru, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "August 2026",
      "following": [
        "usr-3",
        "usr-5"
      ],
      "followers": [
        "usr-demo",
        "usr-9"
      ]
    },
    {
      "id": "usr-3",
      "name": "Vihaan Mehta",
      "handle": "vihaan.cloud",
      "email": "vihaan@example.com",
      "bio": "Cloud learner documenting deployments, automation, and lessons from production. ☁️",
      "location": "Pune, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "July 2026",
      "following": [
        "usr-4",
        "usr-6"
      ],
      "followers": [
        "usr-2",
        "usr-10"
      ]
    },
    {
      "id": "usr-4",
      "name": "Zoya Khan",
      "handle": "zoya.codes",
      "email": "zoya@example.com",
      "bio": "Full-stack developer sharing experiments with APIs, databases, and product thinking. 💻",
      "location": "Hyderabad, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "June 2026",
      "following": [
        "usr-5",
        "usr-7"
      ],
      "followers": [
        "usr-3",
        "usr-demo"
      ]
    },
    {
      "id": "usr-5",
      "name": "Arjun Nair",
      "handle": "arjun.data",
      "email": "arjun@example.com",
      "bio": "Exploring data stories with Python, SQL, and simple visual explanations. 📊",
      "location": "Kochi, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "September 2026",
      "following": [
        "usr-6",
        "usr-8"
      ],
      "followers": [
        "usr-4",
        "usr-2"
      ]
    },
    {
      "id": "usr-6",
      "name": "Mira Shah",
      "handle": "mira.designlab",
      "email": "mira@example.com",
      "bio": "Product design notes on thoughtful UX, wireframes, and tiny details that matter. ✨",
      "location": "Mumbai, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "August 2026",
      "following": [
        "usr-7",
        "usr-9"
      ],
      "followers": [
        "usr-5",
        "usr-3"
      ]
    },
    {
      "id": "usr-7",
      "name": "Dev Malhotra",
      "handle": "dev.dsa",
      "email": "dev@example.com",
      "bio": "Practising C++, algorithms, and problem-solving one concept at a time. 🧩",
      "location": "Delhi, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "July 2026",
      "following": [
        "usr-8",
        "usr-10"
      ],
      "followers": [
        "usr-6",
        "usr-4"
      ]
    },
    {
      "id": "usr-8",
      "name": "Ira Sen",
      "handle": "ira.mobile",
      "email": "ira@example.com",
      "bio": "Mobile app maker learning smooth interactions, performance, and delightful details. 📱",
      "location": "Kolkata, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "June 2026",
      "following": [
        "usr-9",
        "usr-demo"
      ],
      "followers": [
        "usr-7",
        "usr-5"
      ]
    },
    {
      "id": "usr-9",
      "name": "Rehan Ali",
      "handle": "rehan.security",
      "email": "rehan@example.com",
      "bio": "Security-minded builder learning safer defaults, testing, and privacy-first design. 🔐",
      "location": "Hyderabad, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "May 2026",
      "following": [
        "usr-10",
        "usr-2"
      ],
      "followers": [
        "usr-8",
        "usr-6"
      ]
    },
    {
      "id": "usr-10",
      "name": "Tara Joshi",
      "handle": "tara.product",
      "email": "tara@example.com",
      "bio": "Turning customer questions into product ideas, experiments, and clearer roadmaps. 🧭",
      "location": "Ahmedabad, India",
      "website": "https://github.com/",
      "avatar": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=300&q=80",
      "banner": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      "joinedDate": "August 2026",
      "following": [
        "usr-demo",
        "usr-3"
      ],
      "followers": [
        "usr-9",
        "usr-7"
      ]
    }
  ];

const INITIAL_POSTS = [
    {
      "id": "post-demo-001",
      "authorId": "usr-demo",
      "content": "Today I shipped a small improvement instead of waiting for a perfect version. Small releases make the next step clearer. 🚀 What would you improve first? #BuildInPublic #WebDev",
      "image": "https://picsum.photos/seed/nawab-refresh-01/1000/700",
      "tags": [
        "BuildInPublic",
        "WebDev"
      ],
      "createdAt": "2026-10-20T20:00:00.000Z",
      "likes": [
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-001",
          "authorId": "usr-4",
          "authorName": "Zoya Khan",
          "authorHandle": "zoya.codes",
          "authorAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-20T20:00:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-002",
      "authorId": "usr-demo",
      "content": "I am keeping API responses predictable and errors useful. Future debugging gets much easier when the contract is clear. 🔌 I am saving the lesson here so I can build on it tomorrow. #FullStack #APIs",
      "image": "https://picsum.photos/seed/nawab-refresh-02/1000/700",
      "tags": [
        "FullStack",
        "APIs"
      ],
      "createdAt": "2026-10-19T19:07:00.000Z",
      "likes": [
        "usr-2",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-002",
          "authorId": "usr-5",
          "authorName": "Arjun Nair",
          "authorHandle": "arjun.data",
          "authorAvatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-19T19:07:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-003",
      "authorId": "usr-demo",
      "content": "Practised explaining the approach before writing code today. Clear reasoning is part of solving the problem. 🧩 Keeping the first version simple made it easier to test. #DSA #Cpp",
      "image": "https://picsum.photos/seed/nawab-refresh-03/1000/700",
      "tags": [
        "DSA",
        "Cpp"
      ],
      "createdAt": "2026-10-18T18:14:00.000Z",
      "likes": [
        "usr-2",
        "usr-3",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-003",
          "authorId": "usr-6",
          "authorName": "Mira Shah",
          "authorHandle": "mira.designlab",
          "authorAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-18T18:14:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-004",
      "authorId": "usr-demo",
      "content": "A useful product idea starts with a real frustration. I am collecting questions before committing to a feature list. 🧭 The next step is to get feedback from someone who will use it. #Product #Startups",
      "image": "https://picsum.photos/seed/nawab-refresh-04/1000/700",
      "tags": [
        "Product",
        "Startups"
      ],
      "createdAt": "2026-10-17T17:21:00.000Z",
      "likes": [
        "usr-2",
        "usr-3",
        "usr-4",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-004",
          "authorId": "usr-7",
          "authorName": "Dev Malhotra",
          "authorHandle": "dev.dsa",
          "authorAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-17T17:21:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-005",
      "authorId": "usr-demo",
      "content": "A focused commit message tells the story of a change. I am trying to make my future reviews easier. 🌱 Small, repeatable progress is the goal this week. #Git #OpenSource",
      "image": "https://picsum.photos/seed/nawab-refresh-05/1000/700",
      "tags": [
        "Git",
        "OpenSource"
      ],
      "createdAt": "2026-10-16T16:28:00.000Z",
      "likes": [
        "usr-2",
        "usr-3",
        "usr-4",
        "usr-5",
        "usr-6"
      ],
      "comments": [
        {
          "id": "comment-refresh-005",
          "authorId": "usr-8",
          "authorName": "Ira Sen",
          "authorHandle": "ira.mobile",
          "authorAvatar": "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-16T16:28:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-006",
      "authorId": "usr-2",
      "content": "I treat AI output as a starting point: test the result, check assumptions, and understand the code before shipping. 🤖 What would you improve first? #AI #Learning",
      "image": "https://picsum.photos/seed/nawab-refresh-06/1000/700",
      "tags": [
        "AI",
        "Learning"
      ],
      "createdAt": "2026-10-15T15:35:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-006",
          "authorId": "usr-9",
          "authorName": "Rehan Ali",
          "authorHandle": "rehan.security",
          "authorAvatar": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-15T15:35:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-007",
      "authorId": "usr-2",
      "content": "My plan for today is intentionally small: finish one task, test it, and write down the next action. 🎯 I am saving the lesson here so I can build on it tomorrow. #Focus #Productivity",
      "image": "https://picsum.photos/seed/nawab-refresh-07/1000/700",
      "tags": [
        "Focus",
        "Productivity"
      ],
      "createdAt": "2026-10-14T14:42:00.000Z",
      "likes": [
        "usr-demo",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-007",
          "authorId": "usr-10",
          "authorName": "Tara Joshi",
          "authorHandle": "tara.product",
          "authorAvatar": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-14T14:42:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-008",
      "authorId": "usr-2",
      "content": "My deployment checklist now starts with health checks, environment variables, and a rollback plan. Reliability is built before launch. ☁️ Keeping the first version simple made it easier to test. #DevOps #Cloud",
      "image": "https://picsum.photos/seed/nawab-refresh-08/1000/700",
      "tags": [
        "DevOps",
        "Cloud"
      ],
      "createdAt": "2026-10-20T13:49:00.000Z",
      "likes": [
        "usr-demo",
        "usr-3",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-008",
          "authorId": "usr-demo",
          "authorName": "Nawab Studio",
          "authorHandle": "nawab_studio",
          "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-20T13:49:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-009",
      "authorId": "usr-2",
      "content": "Before polishing a screen, I wrote down the one thing the user needs to accomplish. It changed the whole layout. ✨ The next step is to get feedback from someone who will use it. #UX #Design",
      "image": "https://picsum.photos/seed/nawab-refresh-09/1000/700",
      "tags": [
        "UX",
        "Design"
      ],
      "createdAt": "2026-10-19T12:56:00.000Z",
      "likes": [
        "usr-demo",
        "usr-3",
        "usr-4",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-009",
          "authorId": "usr-2",
          "authorName": "Aditi Rao",
          "authorHandle": "aditi.builds",
          "authorAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-19T12:56:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-010",
      "authorId": "usr-2",
      "content": "I am reviewing the default path first: validate input, return safe errors, and never expose secrets in logs. 🔐 Small, repeatable progress is the goal this week. #Security #Privacy",
      "image": "https://picsum.photos/seed/nawab-refresh-10/1000/700",
      "tags": [
        "Security",
        "Privacy"
      ],
      "createdAt": "2026-10-18T11:03:00.000Z",
      "likes": [
        "usr-demo",
        "usr-3",
        "usr-4",
        "usr-5",
        "usr-6"
      ],
      "comments": [
        {
          "id": "comment-refresh-010",
          "authorId": "usr-3",
          "authorName": "Vihaan Mehta",
          "authorHandle": "vihaan.cloud",
          "authorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-18T11:03:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-011",
      "authorId": "usr-3",
      "content": "A focused commit message tells the story of a change. I am trying to make my future reviews easier. 🌱 What would you improve first? #Git #OpenSource",
      "image": "https://picsum.photos/seed/nawab-refresh-11/1000/700",
      "tags": [
        "Git",
        "OpenSource"
      ],
      "createdAt": "2026-10-17T10:10:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-011",
          "authorId": "usr-4",
          "authorName": "Zoya Khan",
          "authorHandle": "zoya.codes",
          "authorAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-17T10:10:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-012",
      "authorId": "usr-3",
      "content": "A portfolio project is stronger when it explains the problem, the trade-offs, and what I learned—not only the screenshots. 💼 I am saving the lesson here so I can build on it tomorrow. #Career #Portfolio",
      "image": "https://picsum.photos/seed/nawab-refresh-12/1000/700",
      "tags": [
        "Career",
        "Portfolio"
      ],
      "createdAt": "2026-10-16T09:17:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-012",
          "authorId": "usr-5",
          "authorName": "Arjun Nair",
          "authorHandle": "arjun.data",
          "authorAvatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-16T09:17:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-013",
      "authorId": "usr-3",
      "content": "Reusable components help a product feel consistent, but they should still leave room for the actual content. 🎛️ Keeping the first version simple made it easier to test. #UI #DesignSystems",
      "image": "https://picsum.photos/seed/nawab-refresh-13/1000/700",
      "tags": [
        "UI",
        "DesignSystems"
      ],
      "createdAt": "2026-10-15T20:24:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-013",
          "authorId": "usr-6",
          "authorName": "Mira Shah",
          "authorHandle": "mira.designlab",
          "authorAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-15T20:24:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-014",
      "authorId": "usr-3",
      "content": "A good interface should work with a keyboard, a screen reader, and a small phone—not just on my laptop. ♿ The next step is to get feedback from someone who will use it. #Frontend #Accessibility",
      "image": "https://picsum.photos/seed/nawab-refresh-14/1000/700",
      "tags": [
        "Frontend",
        "Accessibility"
      ],
      "createdAt": "2026-10-14T19:31:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-4",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-014",
          "authorId": "usr-7",
          "authorName": "Dev Malhotra",
          "authorHandle": "dev.dsa",
          "authorAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-14T19:31:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-015",
      "authorId": "usr-3",
      "content": "A chart is only useful when it answers a real question. Today I removed noise and made the takeaway easier to see. 📊 Small, repeatable progress is the goal this week. #Data #Python",
      "image": "https://picsum.photos/seed/nawab-refresh-15/1000/700",
      "tags": [
        "Data",
        "Python"
      ],
      "createdAt": "2026-10-20T18:38:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-4",
        "usr-5",
        "usr-6"
      ],
      "comments": [
        {
          "id": "comment-refresh-015",
          "authorId": "usr-8",
          "authorName": "Ira Sen",
          "authorHandle": "ira.mobile",
          "authorAvatar": "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-20T18:38:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-016",
      "authorId": "usr-4",
      "content": "I am reviewing the default path first: validate input, return safe errors, and never expose secrets in logs. 🔐 What would you improve first? #Security #Privacy",
      "image": "https://picsum.photos/seed/nawab-refresh-16/1000/700",
      "tags": [
        "Security",
        "Privacy"
      ],
      "createdAt": "2026-10-19T17:45:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-016",
          "authorId": "usr-9",
          "authorName": "Rehan Ali",
          "authorHandle": "rehan.security",
          "authorAvatar": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-19T17:45:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-017",
      "authorId": "usr-4",
      "content": "Responsive design is more than shrinking a desktop layout. Content order and comfortable spacing matter at every width. 📐 I am saving the lesson here so I can build on it tomorrow. #CSS #ResponsiveDesign",
      "image": "https://picsum.photos/seed/nawab-refresh-17/1000/700",
      "tags": [
        "CSS",
        "ResponsiveDesign"
      ],
      "createdAt": "2026-10-18T16:52:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-017",
          "authorId": "usr-10",
          "authorName": "Tara Joshi",
          "authorHandle": "tara.product",
          "authorAvatar": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-18T16:52:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-018",
      "authorId": "usr-4",
      "content": "Stable IDs and clear relationships make demo data easier to update without breaking likes, comments, or follows. 🗃️ Keeping the first version simple made it easier to test. #Database #Backend",
      "image": "https://picsum.photos/seed/nawab-refresh-18/1000/700",
      "tags": [
        "Database",
        "Backend"
      ],
      "createdAt": "2026-10-17T15:59:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-018",
          "authorId": "usr-demo",
          "authorName": "Nawab Studio",
          "authorHandle": "nawab_studio",
          "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-17T15:59:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-019",
      "authorId": "usr-4",
      "content": "Sharing a lesson from a bug can help someone else skip the same detour. Progress includes the messy middle. 🤝 The next step is to get feedback from someone who will use it. #Community #BuildInPublic",
      "image": "https://picsum.photos/seed/nawab-refresh-19/1000/700",
      "tags": [
        "Community",
        "BuildInPublic"
      ],
      "createdAt": "2026-10-16T14:06:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-019",
          "authorId": "usr-2",
          "authorName": "Aditi Rao",
          "authorHandle": "aditi.builds",
          "authorAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-16T14:06:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-020",
      "authorId": "usr-4",
      "content": "Today I shipped a small improvement instead of waiting for a perfect version. Small releases make the next step clearer. 🚀 Small, repeatable progress is the goal this week. #BuildInPublic #WebDev",
      "image": "https://picsum.photos/seed/nawab-refresh-20/1000/700",
      "tags": [
        "BuildInPublic",
        "WebDev"
      ],
      "createdAt": "2026-10-15T13:13:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-5",
        "usr-6"
      ],
      "comments": [
        {
          "id": "comment-refresh-020",
          "authorId": "usr-3",
          "authorName": "Vihaan Mehta",
          "authorHandle": "vihaan.cloud",
          "authorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-15T13:13:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-021",
      "authorId": "usr-5",
      "content": "A chart is only useful when it answers a real question. Today I removed noise and made the takeaway easier to see. 📊 What would you improve first? #Data #Python",
      "image": "https://picsum.photos/seed/nawab-refresh-21/1000/700",
      "tags": [
        "Data",
        "Python"
      ],
      "createdAt": "2026-10-14T12:20:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-021",
          "authorId": "usr-4",
          "authorName": "Zoya Khan",
          "authorHandle": "zoya.codes",
          "authorAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-14T12:20:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-022",
      "authorId": "usr-5",
      "content": "A smooth mobile experience comes from many small decisions: image sizes, loading states, and avoiding unnecessary work. 📱 I am saving the lesson here so I can build on it tomorrow. #Mobile #Performance",
      "image": "https://picsum.photos/seed/nawab-refresh-22/1000/700",
      "tags": [
        "Mobile",
        "Performance"
      ],
      "createdAt": "2026-10-20T11:27:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-022",
          "authorId": "usr-5",
          "authorName": "Arjun Nair",
          "authorHandle": "arjun.data",
          "authorAvatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-20T11:27:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-023",
      "authorId": "usr-5",
      "content": "One concept, one tiny example, one note for future me. Consistent practice beats collecting tabs I never revisit. 📝 Keeping the first version simple made it easier to test. #JavaScript #Learning",
      "image": "https://picsum.photos/seed/nawab-refresh-23/1000/700",
      "tags": [
        "JavaScript",
        "Learning"
      ],
      "createdAt": "2026-10-19T10:34:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-023",
          "authorId": "usr-6",
          "authorName": "Mira Shah",
          "authorHandle": "mira.designlab",
          "authorAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-19T10:34:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-024",
      "authorId": "usr-5",
      "content": "The happy path is not the whole feature. Empty states, invalid input, and slow requests deserve attention too. 🧪 The next step is to get feedback from someone who will use it. #Testing #Quality",
      "image": "https://picsum.photos/seed/nawab-refresh-24/1000/700",
      "tags": [
        "Testing",
        "Quality"
      ],
      "createdAt": "2026-10-18T09:41:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-024",
          "authorId": "usr-7",
          "authorName": "Dev Malhotra",
          "authorHandle": "dev.dsa",
          "authorAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-18T09:41:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-025",
      "authorId": "usr-5",
      "content": "I treat AI output as a starting point: test the result, check assumptions, and understand the code before shipping. 🤖 Small, repeatable progress is the goal this week. #AI #Learning",
      "image": "https://picsum.photos/seed/nawab-refresh-25/1000/700",
      "tags": [
        "AI",
        "Learning"
      ],
      "createdAt": "2026-10-17T20:48:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4",
        "usr-6"
      ],
      "comments": [
        {
          "id": "comment-refresh-025",
          "authorId": "usr-8",
          "authorName": "Ira Sen",
          "authorHandle": "ira.mobile",
          "authorAvatar": "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-17T20:48:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-026",
      "authorId": "usr-6",
      "content": "Today I shipped a small improvement instead of waiting for a perfect version. Small releases make the next step clearer. 🚀 What would you improve first? #BuildInPublic #WebDev",
      "image": "https://picsum.photos/seed/nawab-refresh-26/1000/700",
      "tags": [
        "BuildInPublic",
        "WebDev"
      ],
      "createdAt": "2026-10-16T19:55:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-026",
          "authorId": "usr-9",
          "authorName": "Rehan Ali",
          "authorHandle": "rehan.security",
          "authorAvatar": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-16T19:55:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-027",
      "authorId": "usr-6",
      "content": "I am keeping API responses predictable and errors useful. Future debugging gets much easier when the contract is clear. 🔌 I am saving the lesson here so I can build on it tomorrow. #FullStack #APIs",
      "image": "https://picsum.photos/seed/nawab-refresh-27/1000/700",
      "tags": [
        "FullStack",
        "APIs"
      ],
      "createdAt": "2026-10-15T18:02:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-027",
          "authorId": "usr-10",
          "authorName": "Tara Joshi",
          "authorHandle": "tara.product",
          "authorAvatar": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-15T18:02:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-028",
      "authorId": "usr-6",
      "content": "Practised explaining the approach before writing code today. Clear reasoning is part of solving the problem. 🧩 Keeping the first version simple made it easier to test. #DSA #Cpp",
      "image": "https://picsum.photos/seed/nawab-refresh-28/1000/700",
      "tags": [
        "DSA",
        "Cpp"
      ],
      "createdAt": "2026-10-14T17:09:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-028",
          "authorId": "usr-demo",
          "authorName": "Nawab Studio",
          "authorHandle": "nawab_studio",
          "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-14T17:09:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-029",
      "authorId": "usr-6",
      "content": "A useful product idea starts with a real frustration. I am collecting questions before committing to a feature list. 🧭 The next step is to get feedback from someone who will use it. #Product #Startups",
      "image": "https://picsum.photos/seed/nawab-refresh-29/1000/700",
      "tags": [
        "Product",
        "Startups"
      ],
      "createdAt": "2026-10-20T16:16:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-029",
          "authorId": "usr-2",
          "authorName": "Aditi Rao",
          "authorHandle": "aditi.builds",
          "authorAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-20T16:16:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-030",
      "authorId": "usr-6",
      "content": "A focused commit message tells the story of a change. I am trying to make my future reviews easier. 🌱 Small, repeatable progress is the goal this week. #Git #OpenSource",
      "image": "https://picsum.photos/seed/nawab-refresh-30/1000/700",
      "tags": [
        "Git",
        "OpenSource"
      ],
      "createdAt": "2026-10-19T15:23:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-030",
          "authorId": "usr-3",
          "authorName": "Vihaan Mehta",
          "authorHandle": "vihaan.cloud",
          "authorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-19T15:23:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-031",
      "authorId": "usr-7",
      "content": "I treat AI output as a starting point: test the result, check assumptions, and understand the code before shipping. 🤖 What would you improve first? #AI #Learning",
      "image": "https://picsum.photos/seed/nawab-refresh-31/1000/700",
      "tags": [
        "AI",
        "Learning"
      ],
      "createdAt": "2026-10-18T14:30:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-031",
          "authorId": "usr-4",
          "authorName": "Zoya Khan",
          "authorHandle": "zoya.codes",
          "authorAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-18T14:30:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-032",
      "authorId": "usr-7",
      "content": "My plan for today is intentionally small: finish one task, test it, and write down the next action. 🎯 I am saving the lesson here so I can build on it tomorrow. #Focus #Productivity",
      "image": "https://picsum.photos/seed/nawab-refresh-32/1000/700",
      "tags": [
        "Focus",
        "Productivity"
      ],
      "createdAt": "2026-10-17T13:37:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-032",
          "authorId": "usr-5",
          "authorName": "Arjun Nair",
          "authorHandle": "arjun.data",
          "authorAvatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-17T13:37:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-033",
      "authorId": "usr-7",
      "content": "My deployment checklist now starts with health checks, environment variables, and a rollback plan. Reliability is built before launch. ☁️ Keeping the first version simple made it easier to test. #DevOps #Cloud",
      "image": "https://picsum.photos/seed/nawab-refresh-33/1000/700",
      "tags": [
        "DevOps",
        "Cloud"
      ],
      "createdAt": "2026-10-16T12:44:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-033",
          "authorId": "usr-6",
          "authorName": "Mira Shah",
          "authorHandle": "mira.designlab",
          "authorAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-16T12:44:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-034",
      "authorId": "usr-7",
      "content": "Before polishing a screen, I wrote down the one thing the user needs to accomplish. It changed the whole layout. ✨ The next step is to get feedback from someone who will use it. #UX #Design",
      "image": "https://picsum.photos/seed/nawab-refresh-34/1000/700",
      "tags": [
        "UX",
        "Design"
      ],
      "createdAt": "2026-10-15T11:51:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-034",
          "authorId": "usr-7",
          "authorName": "Dev Malhotra",
          "authorHandle": "dev.dsa",
          "authorAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-15T11:51:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-035",
      "authorId": "usr-7",
      "content": "I am reviewing the default path first: validate input, return safe errors, and never expose secrets in logs. 🔐 Small, repeatable progress is the goal this week. #Security #Privacy",
      "image": "https://picsum.photos/seed/nawab-refresh-35/1000/700",
      "tags": [
        "Security",
        "Privacy"
      ],
      "createdAt": "2026-10-14T10:58:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-035",
          "authorId": "usr-8",
          "authorName": "Ira Sen",
          "authorHandle": "ira.mobile",
          "authorAvatar": "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-14T10:58:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-036",
      "authorId": "usr-8",
      "content": "A focused commit message tells the story of a change. I am trying to make my future reviews easier. 🌱 What would you improve first? #Git #OpenSource",
      "image": "https://picsum.photos/seed/nawab-refresh-36/1000/700",
      "tags": [
        "Git",
        "OpenSource"
      ],
      "createdAt": "2026-10-20T09:05:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-036",
          "authorId": "usr-9",
          "authorName": "Rehan Ali",
          "authorHandle": "rehan.security",
          "authorAvatar": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-20T09:05:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-037",
      "authorId": "usr-8",
      "content": "A portfolio project is stronger when it explains the problem, the trade-offs, and what I learned—not only the screenshots. 💼 I am saving the lesson here so I can build on it tomorrow. #Career #Portfolio",
      "image": "https://picsum.photos/seed/nawab-refresh-37/1000/700",
      "tags": [
        "Career",
        "Portfolio"
      ],
      "createdAt": "2026-10-19T20:12:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-037",
          "authorId": "usr-10",
          "authorName": "Tara Joshi",
          "authorHandle": "tara.product",
          "authorAvatar": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-19T20:12:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-038",
      "authorId": "usr-8",
      "content": "Reusable components help a product feel consistent, but they should still leave room for the actual content. 🎛️ Keeping the first version simple made it easier to test. #UI #DesignSystems",
      "image": "https://picsum.photos/seed/nawab-refresh-38/1000/700",
      "tags": [
        "UI",
        "DesignSystems"
      ],
      "createdAt": "2026-10-18T19:19:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-038",
          "authorId": "usr-demo",
          "authorName": "Nawab Studio",
          "authorHandle": "nawab_studio",
          "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-18T19:19:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-039",
      "authorId": "usr-8",
      "content": "A good interface should work with a keyboard, a screen reader, and a small phone—not just on my laptop. ♿ The next step is to get feedback from someone who will use it. #Frontend #Accessibility",
      "image": "https://picsum.photos/seed/nawab-refresh-39/1000/700",
      "tags": [
        "Frontend",
        "Accessibility"
      ],
      "createdAt": "2026-10-17T18:26:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-039",
          "authorId": "usr-2",
          "authorName": "Aditi Rao",
          "authorHandle": "aditi.builds",
          "authorAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-17T18:26:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-040",
      "authorId": "usr-8",
      "content": "A chart is only useful when it answers a real question. Today I removed noise and made the takeaway easier to see. 📊 Small, repeatable progress is the goal this week. #Data #Python",
      "image": "https://picsum.photos/seed/nawab-refresh-40/1000/700",
      "tags": [
        "Data",
        "Python"
      ],
      "createdAt": "2026-10-16T17:33:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-040",
          "authorId": "usr-3",
          "authorName": "Vihaan Mehta",
          "authorHandle": "vihaan.cloud",
          "authorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-16T17:33:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-041",
      "authorId": "usr-9",
      "content": "I am reviewing the default path first: validate input, return safe errors, and never expose secrets in logs. 🔐 What would you improve first? #Security #Privacy",
      "image": "https://picsum.photos/seed/nawab-refresh-41/1000/700",
      "tags": [
        "Security",
        "Privacy"
      ],
      "createdAt": "2026-10-15T16:40:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-041",
          "authorId": "usr-4",
          "authorName": "Zoya Khan",
          "authorHandle": "zoya.codes",
          "authorAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-15T16:40:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-042",
      "authorId": "usr-9",
      "content": "Responsive design is more than shrinking a desktop layout. Content order and comfortable spacing matter at every width. 📐 I am saving the lesson here so I can build on it tomorrow. #CSS #ResponsiveDesign",
      "image": "https://picsum.photos/seed/nawab-refresh-42/1000/700",
      "tags": [
        "CSS",
        "ResponsiveDesign"
      ],
      "createdAt": "2026-10-14T15:47:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-042",
          "authorId": "usr-5",
          "authorName": "Arjun Nair",
          "authorHandle": "arjun.data",
          "authorAvatar": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-14T15:47:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-043",
      "authorId": "usr-9",
      "content": "Stable IDs and clear relationships make demo data easier to update without breaking likes, comments, or follows. 🗃️ Keeping the first version simple made it easier to test. #Database #Backend",
      "image": "https://picsum.photos/seed/nawab-refresh-43/1000/700",
      "tags": [
        "Database",
        "Backend"
      ],
      "createdAt": "2026-10-20T14:54:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-043",
          "authorId": "usr-6",
          "authorName": "Mira Shah",
          "authorHandle": "mira.designlab",
          "authorAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-20T14:54:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-044",
      "authorId": "usr-9",
      "content": "Sharing a lesson from a bug can help someone else skip the same detour. Progress includes the messy middle. 🤝 The next step is to get feedback from someone who will use it. #Community #BuildInPublic",
      "image": "https://picsum.photos/seed/nawab-refresh-44/1000/700",
      "tags": [
        "Community",
        "BuildInPublic"
      ],
      "createdAt": "2026-10-19T13:01:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-044",
          "authorId": "usr-7",
          "authorName": "Dev Malhotra",
          "authorHandle": "dev.dsa",
          "authorAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-19T13:01:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-045",
      "authorId": "usr-9",
      "content": "Today I shipped a small improvement instead of waiting for a perfect version. Small releases make the next step clearer. 🚀 Small, repeatable progress is the goal this week. #BuildInPublic #WebDev",
      "image": "https://picsum.photos/seed/nawab-refresh-45/1000/700",
      "tags": [
        "BuildInPublic",
        "WebDev"
      ],
      "createdAt": "2026-10-18T12:08:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-045",
          "authorId": "usr-8",
          "authorName": "Ira Sen",
          "authorHandle": "ira.mobile",
          "authorAvatar": "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-18T12:08:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-046",
      "authorId": "usr-10",
      "content": "A chart is only useful when it answers a real question. Today I removed noise and made the takeaway easier to see. 📊 What would you improve first? #Data #Python",
      "image": "https://picsum.photos/seed/nawab-refresh-46/1000/700",
      "tags": [
        "Data",
        "Python"
      ],
      "createdAt": "2026-10-17T11:15:00.000Z",
      "likes": [
        "usr-demo"
      ],
      "comments": [
        {
          "id": "comment-refresh-046",
          "authorId": "usr-9",
          "authorName": "Rehan Ali",
          "authorHandle": "rehan.security",
          "authorAvatar": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-17T11:15:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-047",
      "authorId": "usr-10",
      "content": "A smooth mobile experience comes from many small decisions: image sizes, loading states, and avoiding unnecessary work. 📱 I am saving the lesson here so I can build on it tomorrow. #Mobile #Performance",
      "image": "https://picsum.photos/seed/nawab-refresh-47/1000/700",
      "tags": [
        "Mobile",
        "Performance"
      ],
      "createdAt": "2026-10-16T10:22:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2"
      ],
      "comments": [
        {
          "id": "comment-refresh-047",
          "authorId": "usr-10",
          "authorName": "Tara Joshi",
          "authorHandle": "tara.product",
          "authorAvatar": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=300&q=80",
          "content": "Saving this idea for my next build.",
          "createdAt": "2026-10-16T10:22:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-048",
      "authorId": "usr-10",
      "content": "One concept, one tiny example, one note for future me. Consistent practice beats collecting tabs I never revisit. 📝 Keeping the first version simple made it easier to test. #JavaScript #Learning",
      "image": "https://picsum.photos/seed/nawab-refresh-48/1000/700",
      "tags": [
        "JavaScript",
        "Learning"
      ],
      "createdAt": "2026-10-15T09:29:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3"
      ],
      "comments": [
        {
          "id": "comment-refresh-048",
          "authorId": "usr-demo",
          "authorName": "Nawab Studio",
          "authorHandle": "nawab_studio",
          "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          "content": "Clear and useful progress update.",
          "createdAt": "2026-10-15T09:29:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-049",
      "authorId": "usr-10",
      "content": "The happy path is not the whole feature. Empty states, invalid input, and slow requests deserve attention too. 🧪 The next step is to get feedback from someone who will use it. #Testing #Quality",
      "image": "https://picsum.photos/seed/nawab-refresh-49/1000/700",
      "tags": [
        "Testing",
        "Quality"
      ],
      "createdAt": "2026-10-14T20:36:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4"
      ],
      "comments": [
        {
          "id": "comment-refresh-049",
          "authorId": "usr-2",
          "authorName": "Aditi Rao",
          "authorHandle": "aditi.builds",
          "authorAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
          "content": "Great practical takeaway!",
          "createdAt": "2026-10-14T20:36:00.000Z"
        }
      ]
    },
    {
      "id": "post-demo-050",
      "authorId": "usr-10",
      "content": "I treat AI output as a starting point: test the result, check assumptions, and understand the code before shipping. 🤖 Small, repeatable progress is the goal this week. #AI #Learning",
      "image": "https://picsum.photos/seed/nawab-refresh-50/1000/700",
      "tags": [
        "AI",
        "Learning"
      ],
      "createdAt": "2026-10-20T19:43:00.000Z",
      "likes": [
        "usr-demo",
        "usr-2",
        "usr-3",
        "usr-4",
        "usr-5"
      ],
      "comments": [
        {
          "id": "comment-refresh-050",
          "authorId": "usr-3",
          "authorName": "Vihaan Mehta",
          "authorHandle": "vihaan.cloud",
          "authorAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          "content": "Love the focus on making it usable.",
          "createdAt": "2026-10-20T19:43:00.000Z"
        }
      ]
    }
  ];

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('password123', salt);

    const seededUsers = INITIAL_USERS.map(u => ({
      ...u,
      passwordHash: demoPasswordHash
    }));

    const initialData = {
      users: seededUsers,
      posts: INITIAL_POSTS,
      hashtags: [
              {
                      "tag": "BuildInPublic",
                      "count": 3
              },
              {
                      "tag": "UX",
                      "count": 3
              },
              {
                      "tag": "Frontend",
                      "count": 2
              },
              {
                      "tag": "UI",
                      "count": 2
              },
              {
                      "tag": "AI",
                      "count": 2
              },
              {
                      "tag": "DataViz",
                      "count": 2
              },
              {
                      "tag": "Analytics",
                      "count": 2
              },
              {
                      "tag": "DSA",
                      "count": 2
              },
              {
                      "tag": "Cpp",
                      "count": 2
              },
              {
                      "tag": "ProductDesign",
                      "count": 2
              },
              {
                      "tag": "MVP",
                      "count": 2
              },
              {
                      "tag": "SQL",
                      "count": 2
              }
      ]
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readDb() {
  initDb();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  const data = JSON.parse(raw);
  // Backward-compatible migration for older JSON database files.
  if (!Array.isArray(data.notifications)) data.notifications = [];
  return data;
}

function writeDb(data) {
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, DB_FILE);
}

const db = {
  getPosts(filter = 'all', currentUserId = null) {
    const data = readDb();
    let posts = [...data.posts];

    if (filter === 'following' && currentUserId) {
      const user = data.users.find(u => u.id === currentUserId);
      const followingIds = user ? [...user.following, user.id] : [currentUserId];
      posts = posts.filter(p => followingIds.includes(p.authorId));
    } else if (filter === 'trending') {
      posts.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
    } else {
      // 'all' default - newest first
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Attach author details & isLiked flag
    return posts.map(p => {
      const author = data.users.find(u => u.id === p.authorId) || {
        name: "Unknown User",
        handle: "anonymous",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Anon"
      };

      const isLiked = currentUserId ? p.likes.includes(currentUserId) : false;
      const isFollowingAuthor = (currentUserId && currentUserId !== p.authorId)
        ? (data.users.find(u => u.id === currentUserId)?.following.includes(p.authorId) || false)
        : false;

      return {
        ...p,
        author: {
          id: author.id,
          name: author.name,
          handle: author.handle,
          avatar: author.avatar
        },
        likesCount: p.likes.length,
        commentsCount: p.comments.length,
        isLiked,
        isFollowingAuthor
      };
    });
  },

  getPostById(postId, currentUserId = null) {
    const data = readDb();
    const post = data.posts.find(p => p.id === postId);
    if (!post) return null;

    const foundAuthor = data.users.find(u => u.id === post.authorId);
    const author = foundAuthor ? { id: foundAuthor.id, name: foundAuthor.name, handle: foundAuthor.handle, avatar: foundAuthor.avatar } : { id: post.authorId, name: 'Unknown User', handle: 'anonymous', avatar: '' };
    return {
      ...post,
      author,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      isLiked: currentUserId ? post.likes.includes(currentUserId) : false
    };
  },

  createPost(postData) {
    const data = readDb();
    const newPost = {
      id: `post-${Date.now()}`,
      authorId: postData.authorId,
      content: postData.content,
      image: postData.image || null,
      tags: postData.tags || [],
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };

    data.posts.unshift(newPost);
    writeDb(data);
    return this.getPostById(newPost.id, postData.authorId);
  },

  toggleLike(postId, userId) {
    const data = readDb();
    const post = data.posts.find(p => p.id === postId);
    if (!post) return null;

    const index = post.likes.indexOf(userId);
    let isLiked = false;

    if (index === -1) {
      post.likes.push(userId);
      isLiked = true;
    } else {
      post.likes.splice(index, 1);
      isLiked = false;
    }

    writeDb(data);
    return { isLiked, likesCount: post.likes.length };
  },

  addComment(postId, commentData) {
    const data = readDb();
    const post = data.posts.find(p => p.id === postId);
    if (!post) return null;

    const author = data.users.find(u => u.id === commentData.authorId) || {
      name: "Guest",
      handle: "guest",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Guest"
    };

    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      authorHandle: author.handle,
      authorAvatar: author.avatar,
      content: commentData.content,
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    writeDb(data);
    return newComment;
  },

  getUserById(userId, currentUserId = null) {
    const data = readDb();
    const user = data.users.find(u => u.id === userId);
    if (!user) return null;

    const userPosts = data.posts.filter(p => p.authorId === user.id);
    const isFollowing = currentUserId && currentUserId !== user.id
      ? user.followers.includes(currentUserId)
      : false;

    return {
      id: user.id,
      name: user.name,
      handle: user.handle,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      banner: user.banner,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      postsCount: userPosts.length,
      isFollowing,
      joinedDate: user.joinedDate
    };
  },

  getUserByEmail(email) {
    const data = readDb();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  getUserByHandle(handle) {
    const data = readDb();
    const normalized = String(handle || '').trim().replace(/^@/, '').toLowerCase();
    return data.users.find(u => String(u.handle || '').toLowerCase() === normalized) || null;
  },

  createUser(userData) {
    const data = readDb();
    const baseHandle = String(userData.handle || userData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')).trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24) || 'creator';
    let handle = baseHandle;
    let suffix = 2;
    while (data.users.some(u => String(u.handle).toLowerCase() === handle)) { handle = `${baseHandle}${suffix++}`; }
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, 
      name: userData.name,
      handle: handle,
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      bio: userData.bio || "Hello, I am using Nawab!",
      location: "India",
      website: "",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
      followers: [],
      following: [],
      joinedDate: "September 2026"
    };

    data.users.push(newUser);
    writeDb(data);
    return newUser;
  },

  toggleFollow(targetUserId, currentUserId) {
    if (targetUserId === currentUserId) return null;
    const data = readDb();

    const targetUser = data.users.find(u => u.id === targetUserId);
    const currentUser = data.users.find(u => u.id === currentUserId);

    if (!targetUser || !currentUser) return null;

    const followerIdx = targetUser.followers.indexOf(currentUserId);
    const followingIdx = currentUser.following.indexOf(targetUserId);
    let isFollowing = false;

    if (followerIdx === -1) {
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
      isFollowing = true;
    } else {
      targetUser.followers.splice(followerIdx, 1);
      currentUser.following.splice(followingIdx, 1);
      isFollowing = false;
    }

    writeDb(data);
    return {
      isFollowing,
      targetFollowersCount: targetUser.followers.length,
      currentFollowingCount: currentUser.following.length
    };
  },

  getWhoToFollow(currentUserId = null) {
    const data = readDb();
    let suggestions = data.users.filter(u => u.id !== currentUserId);
    if (currentUserId) {
      const currentUser = data.users.find(u => u.id === currentUserId);
      if (currentUser) {
        suggestions = suggestions.filter(u => !currentUser.following.includes(u.id));
      }
    }
    return suggestions.slice(0, 3).map(u => ({
      id: u.id,
      name: u.name,
      handle: u.handle,
      avatar: u.avatar,
      bio: u.bio
    }));
  },

  searchUsers(query, currentUserId = null) {
    const data = readDb();
    const term = String(query || '').trim().replace(/^@/, '').toLowerCase();
    if (!term) return [];
    return data.users.filter(u => u.id !== currentUserId && (`${u.name} ${u.handle} ${u.bio || ''}`).toLowerCase().includes(term))
      .slice(0, 8).map(u => ({ id: u.id, name: u.name, handle: u.handle, avatar: u.avatar, bio: u.bio }));
  },

  addNotification({ recipientId, actorId, type, postId = null, message }) {
    if (!recipientId || !actorId || recipientId === actorId) return null;
    const data = readDb();
    if (!data.users.some(u => u.id === recipientId) || !data.users.some(u => u.id === actorId)) return null;
    const notification = {
      id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      recipientId, actorId, type, postId, message: String(message || '').slice(0, 240),
      createdAt: new Date().toISOString(), read: false
    };
    data.notifications.unshift(notification);
    data.notifications = data.notifications.slice(0, 1000);
    writeDb(data);
    return notification;
  },

  getNotifications(userId) {
    const data = readDb();
    return data.notifications.filter(n => n.recipientId === userId).slice(0, 50).map(n => {
      const actor = data.users.find(u => u.id === n.actorId);
      return { ...n, actor: actor ? { id: actor.id, name: actor.name, handle: actor.handle, avatar: actor.avatar } : null };
    });
  },

  markNotificationsRead(userId) {
    const data = readDb();
    let changed = 0;
    data.notifications.forEach(n => { if (n.recipientId === userId && !n.read) { n.read = true; changed++; } });
    writeDb(data);
    return changed;
  },

  getTrendingTags() {
    const data = readDb();
    return data.hashtags || [];
  }
};

initDb();

module.exports = db;
