# BottleRock Texting Demo

Date: April 10, 2026
Route: `/bottlerock`

## Purpose
This document captures the interactive iPhone-style texting demo used in the BottleRock FAQ section, including behavior, data wiring, styling decisions, and maintenance guidance.

## Scope Implemented
- Added an interactive, client-side texting demo component for FAQ/contact conversion support.
- Integrated the component into the BottleRock FAQ section.
- Implemented guided conversation flow using predefined prompt/response options.
- Styled the experience to resemble an iPhone light-mode Messages thread:
  - Dynamic Island treatment
  - Blue outgoing bubbles
  - Gray incoming bubbles
  - iOS-like message composer row and controls

## Files Involved
- `app/components/bottlerock-texting-demo.tsx`
- `app/bottlerock/page.tsx`
- `app/bottlerock/page.module.css`

## Placement In Page
The demo is rendered inside the FAQ card on `/bottlerock`:
- Section label: `FAQ`
- Heading: `BottleRock Beauty Bar questions, answered.`
- Component call:
  - `<BottleRockTextingDemo bookingUrl={BOOKSY_APPOINTMENT_URL} contactUrl="/contact" conversationOptions={BOTTLE_ROCK_FAQ_DEMO_OPTIONS} />`

## Conversation Data Source
Prompt/response content for the BottleRock page is assembled in `app/bottlerock/page.tsx`:

1. `BOTTLE_ROCK_FAQ_OPTIONS`
- Generated from `BOTTLE_ROCK_FAQS` (legacy static FAQ content moved into interactive prompts).

2. `BOTTLE_ROCK_EXTRA_PROMPT_OPTIONS`
- Additional guided prompts for conversion and clarity (appointments, jewelry, group booking, location).

3. `BOTTLE_ROCK_FAQ_DEMO_OPTIONS`
- Combined array passed into the texting component:
- `[...]BOTTLE_ROCK_FAQ_OPTIONS, ...BOTTLE_ROCK_EXTRA_PROMPT_OPTIONS`

## Component Behavior
Component: `BottleRockTextingDemo` (`"use client"`)

Interaction flow:
1. User taps a prompt chip.
2. User message appears as outgoing bubble.
3. Typing indicator appears after a short delay.
4. Scripted business response is appended.
5. Used prompts are removed from the quick prompt row.

State and guards:
- Prevents duplicate taps while a response is in progress.
- Tracks used prompt IDs to avoid replay from chips.
- Clears timeouts on unmount for safety.
- Auto-scrolls to newest content when messages/typing state change.

## Visual System (Current)
The phone UI is intentionally iPhone-inspired (not a full messenger clone):

- Outer shell: rounded hardware frame with subtle depth/shadow.
- Top hardware detail: Dynamic Island-like pill + lens accent.
- Header controls:
  - Back chip with `17`
  - Center avatar using `/logo.png`
  - FaceTime-style icon on the right
- Thread:
  - Outgoing (user): iOS blue bubbles
  - Incoming (studio): neutral gray bubbles
  - Typing indicator: gray bubble with animated dots
- Composer row (above quick prompts):
  - Left `+` control
  - Center `Messages` bubble placeholder
  - Right audio waveform control

## CTA Behavior
Below the phone:
- Primary CTA: `Book now` (Booksy URL)
- Secondary CTA: `Contact us` (`/contact`)

## No Extra Dependencies
- Uses existing stack only:
  - Next.js App Router
  - Tailwind CSS utility classes
  - Motion React via `motion/react`
- No chat library added.
- No typewriter library added.
- No backend required for simulation.

## How To Edit Prompt Copy
Preferred edit location:
- `app/bottlerock/page.tsx`

Edit arrays:
- `BOTTLE_ROCK_FAQS` for canonical FAQ Q/A
- `BOTTLE_ROCK_EXTRA_PROMPT_OPTIONS` for additional conversation prompts

Rules:
- Keep each option object shaped as:
  - `id`
  - `userLabel`
  - `userMessage`
  - `botResponse`
  - optional `responseDelayMs`
- Keep `id` unique.
- Keep copy concise to preserve mobile bubble readability.

## How To Reuse Elsewhere
`BottleRockTextingDemo` supports custom prompt data via prop:
- `conversationOptions?: readonly BottleRockConversationOption[]`

If no prop is provided, component falls back to internal defaults.

## QA Checklist
After edits to prompts or styling:
- Prompt chips render and are clickable.
- Clicking a chip adds outgoing message bubble.
- Typing indicator appears before business response.
- Response is appended and thread auto-scrolls.
- Prompt cannot be spam-clicked during response delay.
- Used prompt chip no longer appears.
- Phone frame remains balanced on desktop and mobile.
- Build passes (`npm run build`).

