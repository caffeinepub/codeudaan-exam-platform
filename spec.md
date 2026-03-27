# CodeUdaan Exam Platform

## Current State
- Backend stores: username, score, totalQuestions
- StartPage collects only name
- No admin panel
- No email storage
- No leaderboard/ranking feature

## Requested Changes (Diff)

### Add
- Email field to ExamResult type in backend
- Email input on StartPage (collected alongside name)
- Admin panel page at /admin with password protection (password: "codeudaan@admin")
- Leaderboard table in admin panel showing all submissions sorted by score (highest first), with rank, name, email, score, percentage
- Export/copy ability in admin panel

### Modify
- submitResult backend function: accept email parameter
- StartPage: add email input field, store in sessionStorage
- ExamPage: pass email when calling submitResult
- Backend ExamResult type: add email field

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate Motoko backend with email in ExamResult and submitResult
2. Update StartPage to collect email + store in sessionStorage
3. Update ExamPage to read email from sessionStorage and pass to submitResult
4. Create AdminPage at /admin with password gate and leaderboard sorted by score desc
5. Add /admin route to App.tsx router
