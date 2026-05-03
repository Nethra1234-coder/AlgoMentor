#  AI DSA Mentor

An intelligent coding companion that teaches you **how to think**, not just how to solve.

##  Overview

AI DSA Mentor is an interactive learning system designed for students preparing Data Structures and Algorithms (DSA).

Unlike traditional platforms that provide direct solutions, this tool acts as a **personal mentor** that:

* Analyzes your code
* Identifies your mistakes
* Detects conceptual gaps
* Guides you step-by-step until *you* solve the problem

##  Problem Statement

Most learners struggle with DSA because they:

* Rely on solutions instead of understanding concepts
* Cannot identify where their thinking goes wrong
* Practice randomly without targeted improvement

This leads to:

* Weak problem-solving skills
* Poor retention
* Lack of confidence in interviews

---

##  Solution

AI DSA Mentor introduces a **guided learning approach** powered by AI:

> Instead of giving answers, it teaches the *process of thinking*.

---

## ⚙️ How It Works

1. **User Input**

   * Submit a coding problem
   * Provide your code (partial or complete)

2. **AI Analysis**

   * Detects syntax and logical errors
   * Understands your approach
   * Identifies inefficient patterns

3. **Concept Gap Detection**

   * Finds missing knowledge (e.g., recursion, DP, sliding window)
   * Tracks repeated mistakes

4. **Guided Hints (Multi-Level)**

   * Level 1: Directional hint
   * Level 2: Focused guidance
   * Level 3: Strong hint (no full solution)

5. **Socratic Learning**

   * Asks questions to trigger thinking
   * Encourages self-correction

6. **Personalized Practice**

   * Recommends similar problems
   * Adapts difficulty based on performance

---

##  Key Features

* **Thinking-Based Feedback**
  Focuses on *how* you solve, not just *what* you solve

*  **Concept Gap Detection**
  Identifies weak areas like DP, graphs, recursion

*  **Step-by-Step Hints**
  Prevents spoon-feeding while guiding effectively

*  **Progress Tracking**
  Tracks mistakes, improvements, and learning patterns

* **Adaptive Practice**
  Suggests problems based on your weaknesses

* **No-Solution Mode**
  Forces learning without revealing answers

---

##  Tech Stack

### Frontend

* React (Next.js / Vite)

### Backend

* FastAPI (Python)

### AI Layer

* Google Vertex AI (Gemini)

### Code Execution

* Judge0 API

### Database

* PostgreSQL / Firebase (optional)

### Deployment

* Vercel (Frontend)
* Google Cloud Run (Backend)

---

##  Architecture

```
Frontend (React)
        ↓
Backend (FastAPI)
        ↓
 ┌───────────────┬───────────────┐
 │               │               │
AI (Gemini)   Code Runner    Database
(Vertex AI)   (Judge0)       (Postgres)
```

---

##  Unique Innovations

* **Thinking Replay**
  Visualizes how your approach differs from an optimal one

* **Mistake Fingerprint**
  Builds a profile of your common errors

* **Struggle Score**
  Measures effort, not just correctness

---

##  Use Cases

* Students preparing for coding interviews
* Beginners learning DSA fundamentals
* Competitive programmers improving problem-solving skills

---

## Future Improvements

* Code execution visualization
* Voice-based mentoring
* Real-time collaborative problem solving
* Integration with coding platforms

---

##  Contributing

Contributions are welcome!
Feel free to fork the repo and submit pull requests.

---

## Final Note

This project is built on a simple belief:

> The best way to learn DSA is not by seeing solutions…
> but by being guided to discover them.

---
