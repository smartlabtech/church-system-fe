# Backend MCQ DTO Fixes Required

## Issues Summary

The Bible MCQ DTOs have several inconsistencies and missing parameters that affect API functionality.

---

## 1. UpdateMCQDTO - Missing Parameters

### Architecture Clarification:
**Note:** According to the system design, `choices` (answers) are updated through a separate module/endpoint, NOT through UpdateMCQDTO. This is a good separation of concerns.

### Current Issues:
- ❌ Cannot update `service_bookId` (book reference)
- ✅ `choices` handled by separate module (CORRECT - not an issue)
- ❌ Missing ability to change the book/chapter combination

### Recommended Fix:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { MongoIdSchema } from 'src/dtos';
import { QuestionDTO, QuestionSchema } from './dto.question';
import { choicesDTO, choicesSchema } from './dto.choices';

export class UpdateMCQDTO {
  @ApiProperty({ description: 'serviceId', type: String, required: true })
  serviceId?: string;

  @ApiProperty({ description: 'bookId', type: String, required: false })
  service_bookId?: string;  // ADD THIS

  @ApiProperty({ description: 'chapter', type: Number, required: false })
  chapter?: number;

  @ApiProperty({ description: 'from Verse', type: Number, required: false })
  fromVerse?: number;

  @ApiProperty({ description: 'to Verse', type: Number, required: false })
  toVerse?: number;

  @ApiProperty({ description: 'points', type: Number, required: false })
  points?: number;

  @ApiProperty({ description: 'status', type: Boolean, required: false })
  status?: boolean;

  @ApiProperty({ description: 'question', type: QuestionDTO, required: false })
  question?: QuestionDTO;

  @ApiProperty({ description: 'start Date', type: Date, required: false })
  startDate?: Date;

  @ApiProperty({ description: 'end Date', type: Date, required: false })
  endDate?: Date;

  // NOTE: choices are NOT updated here
  // They are managed through a separate choices/answers module
}

export const UpdateMCQSchema = Joi.object().keys({
  serviceId: MongoIdSchema.required(),
  service_bookId: MongoIdSchema,  // ADD THIS - enable changing book reference
  chapter: Joi.number().min(1),
  fromVerse: Joi.number().min(1),
  toVerse: Joi.number().min(1),
  points: Joi.number().min(1),
  status: Joi.boolean(),
  question: QuestionSchema,
  startDate: Joi.date(),
  endDate: Joi.date(),
  // choices: NOT INCLUDED - handled by separate endpoint
});
```

---

## 2. QueryMCQDTO - Missing Filter Parameters

### Current Issues:
- ❌ Cannot filter by `status` (active/inactive questions)
- ❌ Cannot filter by `points` value
- ❌ `page` and `size` typed as `string` but validated as `number`

### Recommended Fix:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { MongoIdSchema } from 'src/dtos';
import { MCQOrderEnum } from './enum';
import { SortTypeEnum } from 'src/enums';

export class QueryMCQDTO {
  @ApiProperty({ description: 'serviceId', type: String, required: true })
  serviceId?: string;

  @ApiProperty({ description: 'bookId', type: String, required: false })
  service_bookId?: string;

  @ApiProperty({ description: 'chapter', type: Number, required: false })
  chapter?: number;

  @ApiProperty({ description: 'from Verse', type: Number, required: false })
  fromVerse?: number;

  @ApiProperty({ description: 'to Verse', type: Number, required: false })
  toVerse?: number;

  @ApiProperty({ description: 'status', type: Boolean, required: false })
  status?: boolean;  // ADD THIS - Filter active/inactive

  @ApiProperty({ description: 'points', type: Number, required: false })
  points?: number;  // ADD THIS - Filter by points value

  @ApiProperty({ description: 'start Date', type: Date, required: false })
  startDate?: Date;

  @ApiProperty({ description: 'end Date', type: Date, required: false })
  endDate?: Date;

  @ApiProperty({ description: `order by ${Object.keys(MCQOrderEnum).join()}`, enum: MCQOrderEnum, required: false })
  sortProperty: MCQOrderEnum;

  @ApiProperty({ description: 'Sort type "ASCENDING, DESCENDING"', enum: SortTypeEnum, required: false })
  sortType?: SortTypeEnum;

  @ApiProperty({ description: 'the page no for pagination, default is 1', required: false })
  page: number;  // FIX: Change from string to number

  @ApiProperty({ description: 'the size of the page for pagination with max 1000, default is 20', required: false })
  size: number;  // FIX: Change from string to number
}

export const QueryMCQSchema = Joi.object().keys({
  serviceId: MongoIdSchema.required(),
  service_bookId: MongoIdSchema,  // CHANGE: Make optional (should use .required() if mandatory)
  chapter: Joi.number().min(1),
  fromVerse: Joi.number().min(1),
  toVerse: Joi.number().min(1),
  status: Joi.boolean(),  // ADD THIS
  points: Joi.number().min(1),  // ADD THIS
  startDate: Joi.date(),
  endDate: Joi.date(),
  sortType: Joi.string(),
  sortProperty: Joi.string().valid(...Object.keys(MCQOrderEnum)),
  page: Joi.number().min(1),
  size: Joi.number().min(1).max(1000),
});
```

---

## 3. Naming Consistency Issues

### Current Issues:
- Property name: `service_bookId`
- API description says: `"bookId"`
- Inconsistent naming convention (snake_case vs camelCase)

### Recommendation:
Choose one naming convention and stick to it:

**Option A: Use `bookId` (Recommended - follows JavaScript/TypeScript conventions)**
```typescript
@ApiProperty({ description: 'Book ID', type: String, required: true })
bookId?: string;
```

**Option B: Keep `service_bookId` but fix description**
```typescript
@ApiProperty({ description: 'Service Book ID', type: String, required: true })
service_bookId?: string;
```

---

## 4. Start Date and End Date Issues

### Current Issues with Date Filtering:

**QueryMCQDTO has `startDate` and `endDate` but unclear usage:**

```typescript
@ApiProperty({ description: 'start Date', type: Date, required: false })
startDate?: Date;

@ApiProperty({ description: 'end Date', type: Date, required: false })
endDate?: Date;
```

### **Problem: Ambiguous Query Intent**

When querying with `startDate` and `endDate`, what does it mean?

**Option A: Filter questions BY their start/end dates (range matching)**
```javascript
// Find questions that START between Jan 1 - Jan 31
GET /api/mcq?startDate=2025-01-01&endDate=2025-01-31
```

**Option B: Filter questions ACTIVE during a date range**
```javascript
// Find questions that are ACTIVE during Jan 1 - Jan 31
// (question.startDate <= 2025-01-31 AND question.endDate >= 2025-01-01)
GET /api/mcq?activeFrom=2025-01-01&activeTo=2025-01-31
```

**Option C: Filter questions CREATED during a date range**
```javascript
// Find questions created between Jan 1 - Jan 31
GET /api/mcq?createdFrom=2025-01-01&createdTo=2025-01-31
```

### **Recommended Solution:**

Add clear, specific date filter parameters:

```typescript
export class QueryMCQDTO {
  @ApiProperty({ description: 'serviceId', type: String, required: true })
  serviceId?: string;

  @ApiProperty({ description: 'bookId', type: String, required: false })
  service_bookId?: string;

  @ApiProperty({ description: 'chapter', type: Number, required: false })
  chapter?: number;

  @ApiProperty({ description: 'from Verse', type: Number, required: false })
  fromVerse?: number;

  @ApiProperty({ description: 'to Verse', type: Number, required: false })
  toVerse?: number;

  @ApiProperty({ description: 'status', type: Boolean, required: false })
  status?: boolean;

  @ApiProperty({ description: 'points', type: Number, required: false })
  points?: number;

  // OPTION 1: Filter by question start date range
  @ApiProperty({ description: 'Filter questions with startDate >= this value', type: Date, required: false })
  questionStartFrom?: Date;

  @ApiProperty({ description: 'Filter questions with startDate <= this value', type: Date, required: false })
  questionStartTo?: Date;

  // OPTION 2: Filter by question end date range
  @ApiProperty({ description: 'Filter questions with endDate >= this value', type: Date, required: false })
  questionEndFrom?: Date;

  @ApiProperty({ description: 'Filter questions with endDate <= this value', type: Date, required: false })
  questionEndTo?: Date;

  // OPTION 3: Filter questions active during a specific date
  @ApiProperty({ description: 'Filter questions active on this date (startDate <= date <= endDate)', type: Date, required: false })
  activeOn?: Date;

  // OPTION 4: Filter questions active during a date range
  @ApiProperty({ description: 'Filter questions active from this date', type: Date, required: false })
  activeFrom?: Date;

  @ApiProperty({ description: 'Filter questions active until this date', type: Date, required: false })
  activeTo?: Date;

  @ApiProperty({ description: `order by ${Object.keys(MCQOrderEnum).join()}`, enum: MCQOrderEnum, required: false })
  sortProperty: MCQOrderEnum;

  @ApiProperty({ description: 'Sort type "ASCENDING, DESCENDING"', enum: SortTypeEnum, required: false })
  sortType?: SortTypeEnum;

  @ApiProperty({ description: 'the page no for pagination, default is 1', required: false })
  page: number;

  @ApiProperty({ description: 'the size of the page for pagination with max 1000, default is 20', required: false })
  size: number;
}

export const QueryMCQSchema = Joi.object().keys({
  serviceId: MongoIdSchema.required(),
  service_bookId: MongoIdSchema,
  chapter: Joi.number().min(1),
  fromVerse: Joi.number().min(1),
  toVerse: Joi.number().min(1),
  status: Joi.boolean(),
  points: Joi.number().min(1),

  // Date filters
  questionStartFrom: Joi.date(),
  questionStartTo: Joi.date().min(Joi.ref('questionStartFrom')),
  questionEndFrom: Joi.date(),
  questionEndTo: Joi.date().min(Joi.ref('questionEndFrom')),
  activeOn: Joi.date(),
  activeFrom: Joi.date(),
  activeTo: Joi.date().min(Joi.ref('activeFrom')),

  sortType: Joi.string(),
  sortProperty: Joi.string().valid(...Object.keys(MCQOrderEnum)),
  page: Joi.number().min(1),
  size: Joi.number().min(1).max(1000),
});
```

### **Backend Query Logic Examples:**

```typescript
// Filter questions active on a specific date
if (query.activeOn) {
  filter.startDate = { $lte: query.activeOn };
  filter.endDate = { $gte: query.activeOn };
}

// Filter questions active during a date range
if (query.activeFrom || query.activeTo) {
  // Questions that overlap with the given range
  // Question is active if: (question.startDate <= activeTo) AND (question.endDate >= activeFrom)
  if (query.activeFrom) {
    filter.endDate = { $gte: query.activeFrom };
  }
  if (query.activeTo) {
    filter.startDate = { $lte: query.activeTo };
  }
}

// Filter by question start date range
if (query.questionStartFrom) {
  filter.startDate = { ...filter.startDate, $gte: query.questionStartFrom };
}
if (query.questionStartTo) {
  filter.startDate = { ...filter.startDate, $lte: query.questionStartTo };
}

// Filter by question end date range
if (query.questionEndFrom) {
  filter.endDate = { ...filter.endDate, $gte: query.questionEndFrom };
}
if (query.questionEndTo) {
  filter.endDate = { ...filter.endDate, $lte: query.questionEndTo };
}
```

### **Common Use Cases:**

1. **Get currently active questions:**
   ```javascript
   GET /api/mcq?serviceId=xxx&activeOn=2025-01-15
   ```

2. **Get questions active during a specific period:**
   ```javascript
   GET /api/mcq?serviceId=xxx&activeFrom=2025-01-01&activeTo=2025-01-31
   ```

3. **Get questions starting in January:**
   ```javascript
   GET /api/mcq?serviceId=xxx&questionStartFrom=2025-01-01&questionStartTo=2025-01-31
   ```

4. **Get questions ending in February:**
   ```javascript
   GET /api/mcq?serviceId=xxx&questionEndFrom=2025-02-01&questionEndTo=2025-02-28
   ```

### **Minimal Recommended Change (If full solution is too complex):**

At minimum, rename the current ambiguous fields:

```typescript
// BEFORE (Ambiguous)
startDate?: Date;
endDate?: Date;

// AFTER (Clear intent)
@ApiProperty({ description: 'Filter questions active from this date', type: Date, required: false })
activeFrom?: Date;

@ApiProperty({ description: 'Filter questions active until this date', type: Date, required: false })
activeTo?: Date;
```

And implement the backend filter:
```typescript
if (query.activeFrom || query.activeTo) {
  if (query.activeFrom) {
    filter.endDate = { $gte: query.activeFrom };
  }
  if (query.activeTo) {
    filter.startDate = { $lte: query.activeTo };
  }
}
```

---

## 5. Additional Improvements

### Add Validation Rules:

```typescript
// In CreateMCQSchema and UpdateMCQSchema
export const CreateMCQSchema = Joi.object().keys({
  serviceId: MongoIdSchema.required(),
  service_bookId: MongoIdSchema.required(),
  chapter: Joi.number().min(1).required(),
  fromVerse: Joi.number().min(1).required(),
  toVerse: Joi.number()
    .min(Joi.ref('fromVerse'))  // toVerse must be >= fromVerse
    .required(),
  points: Joi.number().min(1),
  status: Joi.boolean(),
  question: QuestionSchema.required(),
  startDate: Joi.date(),
  endDate: Joi.date()
    .min(Joi.ref('startDate'))  // endDate must be >= startDate
    .when('startDate', {
      is: Joi.exist(),
      then: Joi.required()
    }),
  choices: Joi.array().items(choicesSchema).min(2).required()
});
```

---

## 5. Frontend Impact

If these parameters are missing, the frontend cannot:

1. ✅ Update MCQ answer choices - **HANDLED BY SEPARATE MODULE** (not an issue)
2. ❌ Move a question to a different book
3. ❌ Filter questions by active/inactive status
4. ❌ Filter questions by points value
5. ❌ Properly handle pagination types
6. ❌ Get "currently active" questions reliably

### Frontend Code That Might Be Affected:

```javascript
// When editing an MCQ question
const updateMCQ = async (mcqId, data) => {
  // Currently CANNOT update:
  // - service_bookId (book reference) ❌ NOT SUPPORTED - NEEDS FIX

  const payload = {
    serviceId: data.serviceId,
    chapter: data.chapter,
    fromVerse: data.fromVerse,
    toVerse: data.toVerse,
    points: data.points,
    status: data.status,
    question: data.question,
    startDate: data.startDate,
    endDate: data.endDate,
    // service_bookId: data.service_bookId  // ❌ NOT SUPPORTED - NEEDS FIX
  }

  await axios.put(`/api/mcq/${mcqId}`, payload)
}

// Updating choices/answers - handled separately (CORRECT)
const updateMCQChoices = async (mcqId, choices) => {
  // This uses a separate endpoint/module
  await axios.put(`/api/mcq/${mcqId}/choices`, { choices })
  // OR
  await axios.put(`/api/choices/${mcqId}`, { choices })
}
```

---

## Priority Recommendations

### P0 - Critical:
1. ~~Add `choices` to UpdateMCQDTO~~ - **NOT NEEDED** - Handled by separate module ✅
2. ✅ Add `service_bookId` to UpdateMCQDTO - Cannot change book reference
3. ✅ Fix `page` and `size` types in QueryMCQDTO (string → number)
4. ✅ **Clarify date filter parameters** - Current `startDate`/`endDate` in QueryMCQDTO are ambiguous

### P1 - High:
5. ✅ Add `status` filter to QueryMCQDTO - Cannot filter active/inactive
6. ✅ Add `points` filter to QueryMCQDTO - Cannot filter by point value
7. ✅ **Add `activeOn` or `activeFrom`/`activeTo`** - Essential for filtering currently available questions

### P2 - Medium:
8. ✅ Fix naming consistency (`service_bookId` vs `bookId`)
9. ✅ Add cross-field validation (toVerse >= fromVerse, endDate >= startDate)
10. ✅ Add granular date filters (questionStartFrom, questionStartTo, etc.)

### Architecture Note:
✅ **Choices/Answers Module** - The system correctly separates MCQ question management from answer/choice management using different modules. This is good architecture and should be maintained.

---

## Testing Checklist

After implementing fixes:

- [ ] Create MCQ with all fields
- [ ] ~~Update MCQ choices~~ - Use separate choices module endpoint
- [ ] Update MCQ book reference (service_bookId)
- [ ] Query MCQs filtered by status
- [ ] Query MCQs filtered by points
- [ ] Query currently active MCQs (activeOn parameter)
- [ ] Query MCQs active in date range (activeFrom/activeTo)
- [ ] Verify pagination works with number types
- [ ] Test validation: toVerse >= fromVerse
- [ ] Test validation: endDate >= startDate

---

## Summary

### Architecture Strengths:
✅ **Separation of Concerns** - Choices/answers managed in separate module (good design)

### Current DTO Limitations:
1. ~~Editing MCQ answer choices~~ - **Handled by separate module** ✅
2. ❌ Moving questions between books (missing `service_bookId` in UpdateMCQDTO)
3. ❌ Filtering by question status (missing `status` in QueryMCQDTO)
4. ❌ Filtering by point values (missing `points` in QueryMCQDTO)
5. ❌ Querying currently active questions (ambiguous date filters in QueryMCQDTO)
6. ❌ Type-safe pagination (wrong types for `page`/`size`)

These limitations reduce the flexibility and usability of the MCQ management system, but the separation of MCQ questions from answers is a good architectural decision that should be maintained.
