# AI Dental Clinic Assistant

A Complete Multi-Agent AI System for Modern Dental Clinics

## Executive Summary

The AI Dental Clinic Assistant is an intelligent multi-agent platform that automates patient
communication, appointment scheduling, follow-ups, billing support, and clinic operations. It acts
as a 24/7 AI receptionist, helping clinics save time, improve patient satisfaction, and increase
operational efficiency.

## Problems It Solves

### For Patients
- Long waiting times on calls
- Difficulty booking appointments
- Limited access outside clinic hours
- Confusion about treatments
- Forgetting appointments
- No post-treatment guidance

### For Clinics
- High receptionist workload
- Missed appointments
- Manual follow-ups
- Repetitive patient questions
- Poor patient engagement
- No centralized analytics

## Solution

A Multi-Agent AI System where each agent performs a specialized task while working together to
provide a seamless patient experience.

## System Architecture

```
                    AI Dental Assistant
                           │
                 Clinic Manager Agent
                           │
 ┌──────────┬──────────┬──────────┬──────────┬──────────┐
 │          │          │          │          │
Reception Appointment Patient  Billing  Analytics
 Agent      Agent      Agent     Agent     Agent
 │          │          │          │          │
 ├──────────┼──────────┼──────────┼──────────┤
 │
Reminder Agent
 │
Follow-up Agent
 │
Treatment Info Agent
 │
Prescription Agent
 │
Marketing Agent
 │
Voice Call Agent
```

## 1. Clinic Manager Agent (Main Orchestrator)

**Role:** Coordinates all other agents.

**Responsibilities**
- Understand patient requests.
- Route tasks to the correct agent.
- Maintain conversation context.
- Combine responses.

**Example**

Patient: "I need an appointment for a toothache tomorrow."

The Manager Agent:
1. Identifies the intent.
2. Calls the Appointment Agent.
3. Calls the Doctor Availability service.
4. Books the appointment.
5. Triggers the Reminder Agent.

## 2. AI Receptionist Agent

**Purpose:** Acts as the clinic's virtual receptionist.

**Features**
- Clinic timings
- Doctor availability
- Consultation fees
- Address & maps
- Parking details
- Insurance information
- Emergency contact
- Languages spoken

**Example**

Patient: "What time do you open?"

AI: "We are open Monday to Saturday from 9:00 AM to 8:00 PM."

## 3. Appointment Agent

**Responsibilities**
- Book appointments
- Reschedule
- Cancel
- Waiting list
- Emergency bookings

**Workflow**

```
Patient
    │
Choose Doctor
    │
Check Availability
    │
Book Slot
    │
Confirmation
    │
Reminder Scheduled
```

## 4. Patient Support Agent

Handles patient questions, e.g.:
- Tooth pain
- Swollen gums
- Braces
- Root canal
- Dental implant

Provides educational guidance and recommends visiting the clinic when appropriate.

## 5. Symptom Assessment Agent

Asks structured questions.

**Example**

Patient: "I have tooth pain."

AI asks:
- Which tooth hurts?
- Pain level (1–10)?
- Swelling?
- Fever?
- Sensitivity to hot or cold?

Output:
```
Possible Issue: Dental cavity
Recommendation: Visit within 24 hours.
```

The AI provides information only and does not replace a dentist's diagnosis.

## 6. Treatment Information Agent

Explains treatments in simple language. Supports:
- Teeth Cleaning
- Root Canal
- Fillings
- Braces
- Aligners
- Dental Implant
- Tooth Extraction
- Crowns
- Bridges
- Whitening

For each treatment: Purpose, Procedure, Duration, Recovery, Benefits, Risks, Approximate cost
(clinic-configurable).

## 7. Patient Record Agent

Stores:
- Patient profile
- Medical history
- Dental history
- X-rays
- Prescriptions
- Allergies
- Treatment history
- Visit history

## 8. Reminder Agent

Automatically sends:
- Appointment reminders
- Medicine reminders
- Follow-up reminders
- 6-month cleaning reminders

Channels: WhatsApp, SMS, Email.

## 9. Follow-up Agent

Automatically contacts patients after treatment.

**Example**
- Day 1: "How are you feeling today?"
- Day 3: "Are you taking your medicines?"
- Day 7: "Please upload a photo if you'd like the dentist to review your healing."

If the patient reports severe pain or bleeding, the clinic is notified.

## 10. Prescription Assistant Agent

Explains prescriptions.

**Example**

Medicine: Amoxicillin

AI explains: why it's prescribed, dosage, when to take it, common precautions.

## 11. Billing & Payment Agent

Functions:
- Treatment estimates
- Outstanding balance
- Invoice download
- Payment links
- Payment confirmations

## 12. Review & Feedback Agent

After treatment:
- Collect patient rating
- Ask for comments
- Invite satisfied patients to leave a Google review
- Notify staff about negative feedback for follow-up

## 13. Analytics Agent

Provides dashboards for:

**Daily** — Appointments, new patients, walk-ins

**Weekly** — Missed appointments, follow-ups completed, most common treatments

**Monthly** — Revenue, patient retention, treatment trends, appointment conversion rate

## 14. Marketing Agent

Automates communication:
- Birthday wishes
- Festival greetings
- Oral health tips
- Teeth cleaning reminders
- Promotional offers
- New treatment announcements

## 15. Voice AI Agent (Optional)

Patients call the clinic. The AI can:
- Answer calls
- Book appointments
- Reschedule visits
- Answer FAQs
- Transfer urgent calls to staff

## Patient Journey

```
Patient Visits Website/WhatsApp
            │
            ▼
AI Receptionist
            │
            ▼
Ask Question
            │
            ▼
Book Appointment
            │
            ▼
Confirmation
            │
            ▼
Reminder
            │
            ▼
Clinic Visit
            │
            ▼
Treatment
            │
            ▼
AI Follow-up
            │
            ▼
Feedback
            │
            ▼
Review Request
```

## Admin Dashboard

Clinic staff can manage:
- Patient records
- Appointments
- Doctor schedules
- AI conversations
- Follow-ups
- Feedback
- Billing
- Reports
- Analytics

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React / Next.js |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| AI Models | OpenAI GPT or Gemini |
| Agent Framework | LangGraph |
| Vector Search | pgvector (Supabase) |
| WhatsApp | WhatsApp Business API |
| Voice Calls | Twilio + ElevenLabs |
| Calendar | Google Calendar API |
| Payments | Dodo Payments / Razorpay |
| Hosting | Hostinger VPS |
| Security | Cloudflare |
