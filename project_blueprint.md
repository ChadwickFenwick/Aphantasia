Project Blueprint: "Monocle" – Visualization Training App
1. Project Overview
Objective: Create a web-based application designed to train the "mind's eye." The app helps users move from Aphantasia (no mental imagery) to Phantasia (vivid mental imagery) and eventually Prophantasia (projected imagery).

Core Philosophy: Utilize neuroplasticity through repetitive visual stimulation, sensory bridging, and afterimage retention.

2. Technical Stack
Framework: Next.js (React) for a snappy, single-page experience.

Graphics: Three.js (via @react-three/fiber) for generating high-contrast 3D shapes and patterns.

State Management: Zustand for tracking user progress and VVIQ scores.

Styling: Tailwind CSS (Dark Mode focused to reduce eye strain).

Deployment: Vercel/Netlify.

3. Application Structure & Features
Module 1: The Diagnostic (VVIQ Test)
An interactive quiz based on the Vividness of Visual Imagery Questionnaire.

Calculates a baseline score and stores it in localStorage.

Module 2: The Afterimage "Burn" (Level 1)
The Exercise: Display high-contrast, primary-colored geometric shapes (e.g., a bright yellow star on a black background) for 30–60 seconds.

The Trigger: A "Dissolve" button that hides the image and prompts the user to "hold" the negative afterimage.

Module 3: Sensory Bridging (Level 2)
The Exercise: Spatial navigation prompts.

The UI: A minimalist text interface that asks the user to "walk" through their house.

Feature: A "Describe out loud" button that uses the Web Speech API to transcribe their spatial descriptions, encouraging "Image Streaming."

Module 4: Prophantasic Projection (Level 3)
The Exercise: Using the device camera to project mental shapes.

The UI: A camera feed overlayed with a low-opacity SVG shape.

Functionality: A slider that allows the user to manually decrease the digital shape's opacity to 0% as they try to "maintain" the image with their mind.

Module 5: Mental Rotation (Mind's Eye)
The Exercise: Spatial manipulation training.
The Flow:
1. Observation: Display a 3D shape (e.g., a Tetris block).
2. Retention: Screen goes dark.
3. Manipulation: Audio/Text prompt: "Rotate it 90 degrees clockwise."
4. Verification: User selects the correct new orientation from multiple choices.
Goal: Strengthen visuospatial working memory and internal imagery manipulation, distinct from external projection.

4. Implementation Tasks (For AI Agent)
Initialize Project: Setup Next.js with Tailwind and Three.js dependencies.

Layout Components:

Dashboard.tsx: Progress tracking and level selection.

ExerciseCanvas.tsx: The main Three.js viewport for visual stimuli.

Core Logic:

Create a useProgress hook to manage user "levels" based on session completion.

Implement a timer component for the "Afterimage" exercises.

Accessibility: Ensure "Dark Mode" is the default to maximize the contrast of the visual exercises.

5. Success Metrics
Daily Streaks: Encourage 10-minute daily sessions.

VVIQ Delta: Track the change in the user's self-reported vividness score over 30 days.