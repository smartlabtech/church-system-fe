# Bible Study Screen Updates Needed

Based on the MCQ DTO analysis, the `/dashboard/bible-study` screen needs several updates to align with backend capabilities and limitations.

---

## Current Implementation Issues

### 1. **Choices in Update Request** ❌

**File**: `src/components/dashboard/MCQManagement.jsx` (Line 238-256)

**Current Code**:
```javascript
const mcqData = {
  serviceId: formData.serviceId,
  service_bookId: formData.service_bookId,
  chapter: Number(formData.chapter) || 0,
  fromVerse: Number(formData.fromVerse) || 0,
  toVerse: Number(formData.toVerse) || 0,
  question: formData.question,
  points: Number(formData.points) || 10,
  choices: formData.choices.filter(choice =>  // ❌ SHOULD NOT BE IN UPDATE
    choice.text.en.trim() || choice.text.ar.trim()
  )
}

if (editingMCQ) {
  dispatch(updateMCQ(editingMCQ._id, mcqData))  // ❌ Includes choices
} else {
  dispatch(createMCQ(mcqData))  // ✅ Choices OK in create
}
```

**Issue**:
- Choices are included in BOTH create and update
- According to architecture, choices should be managed separately after creation
- UpdateMCQDTO does NOT support `choices` parameter

**Fix Needed**:
```javascript
const mcqData = {
  serviceId: formData.serviceId,
  service_bookId: formData.service_bookId,
  chapter: Number(formData.chapter) || 0,
  fromVerse: Number(formData.fromVerse) || 0,
  toVerse: Number(formData.toVerse) || 0,
  question: formData.question,
  points: Number(formData.points) || 10
}

// Only include choices when creating
if (!editingMCQ) {
  mcqData.choices = formData.choices.filter(choice =>
    choice.text.en.trim() || choice.text.ar.trim()
  )
}

if (editingMCQ) {
  dispatch(updateMCQ(editingMCQ._id, mcqData))  // ✅ No choices
} else {
  dispatch(createMCQ(mcqData))  // ✅ Includes choices
}
```

---

### 2. **Missing Filters** ❌

**Current Filters** (Line 116-128):
```javascript
const queryParams = {
  serviceId: selectedService,
  service_bookId: selectedBook
}
if (selectedChapter) {
  queryParams.chapter = selectedChapter
}
dispatch(listMCQs(queryParams))
```

**Missing**:
- ❌ No `status` filter (active/inactive questions)
- ❌ No `points` filter
- ❌ No `activeOn` filter (currently active questions)
- ❌ No `activeFrom`/`activeTo` filters (questions active in date range)

**Needed UI Elements**:
```javascript
// Add these state variables
const [filterStatus, setFilterStatus] = useState('') // '', 'active', 'inactive'
const [filterPoints, setFilterPoints] = useState('')
const [filterActiveDate, setFilterActiveDate] = useState(null)

// Update query params
const queryParams = {
  serviceId: selectedService,
  service_bookId: selectedBook
}
if (selectedChapter) {
  queryParams.chapter = selectedChapter
}
if (filterStatus) {
  queryParams.status = filterStatus === 'active' // boolean
}
if (filterPoints) {
  queryParams.points = Number(filterPoints)
}
if (filterActiveDate) {
  queryParams.activeOn = filterActiveDate // Get questions active on this date
}
dispatch(listMCQs(queryParams))
```

---

### 3. **Cannot Update Book Reference** ❌

**Current**: `service_bookId` is in the form but may not be updatable in backend

**Issue**: If backend UpdateMCQDTO doesn't support `service_bookId`, the frontend sends it but backend ignores it

**Fix**: Check backend support, if not supported:
- Disable book selection when editing
- Show warning: "Cannot change book for existing questions"
- OR implement backend fix first

---

### 4. **Missing Choices Management** ❌

**Current**: Choices are shown in read-only view in BibleStudyScreen.jsx

**Needed**: Separate interface to manage choices AFTER question creation

**Options**:

**Option A: Edit Choices Button**
```javascript
// In the Choices section, add edit button when question selected
{selectedQuestion && (
  <Button
    size="xs"
    variant="light"
    leftIcon={<FaEdit />}
    onClick={() => handleEditChoices(selectedQuestion)}
  >
    {t('Edit_Choices')}
  </Button>
)}
```

**Option B: Separate Choices Modal**
```javascript
const EditChoicesModal = ({ mcqId, currentChoices, onUpdate }) => {
  // Separate modal for managing choices
  // Uses different endpoint: PUT /api/mcq/{id}/choices
  // or PUT /api/choices/{mcqId}
}
```

**Option C: Inline Editing**
```javascript
// Add edit mode to each choice
const [editMode, setEditMode] = useState(false)
// Toggle between view and edit modes
```

---

## Recommended Updates

### Priority 0 - Critical Fixes:

#### 1. Remove Choices from Update Request
```javascript
// File: src/components/dashboard/MCQManagement.jsx
// Line: ~238-256

const handleSubmit = () => {
  // ... validation ...

  const mcqData = {
    serviceId: formData.serviceId,
    service_bookId: formData.service_bookId,
    chapter: Number(formData.chapter) || 0,
    fromVerse: Number(formData.fromVerse) || 0,
    toVerse: Number(formData.toVerse) || 0,
    question: formData.question,
    points: Number(formData.points) || 10
  }

  // Only include choices when creating (NOT updating)
  if (!editingMCQ) {
    mcqData.choices = formData.choices.filter(choice =>
      choice.text.en.trim() || choice.text.ar.trim()
    )
  }

  if (editingMCQ) {
    dispatch(updateMCQ(editingMCQ._id, mcqData))
  } else {
    dispatch(createMCQ(mcqData))
  }
}
```

#### 2. Disable Choices Editing in Update Mode
```javascript
// In the modal form
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tabs.List>
    <Tabs.Tab value="question">{t('Question_Details')}</Tabs.Tab>
    <Tabs.Tab
      value="choices"
      disabled={editingMCQ}  // ❌ Disable when editing
    >
      {t('Choices')}
    </Tabs.Tab>
  </Tabs.List>

  {editingMCQ && (
    <Alert color="orange" icon={<FaEdit />}>
      {t('Choices_must_be_edited_separately')}
    </Alert>
  )}
</Tabs>
```

---

### Priority 1 - Essential Filters:

#### 3. Add Status Filter
```javascript
// Add to filter section
<Select
  label={t('Status')}
  placeholder={t('All_Questions')}
  data={[
    { value: '', label: t('All') },
    { value: 'active', label: t('Active') },
    { value: 'inactive', label: t('Inactive') }
  ]}
  value={filterStatus}
  onChange={setFilterStatus}
  clearable
/>
```

#### 4. Add Points Filter
```javascript
<NumberInput
  label={t('Points')}
  placeholder={t('Filter_by_points')}
  value={filterPoints}
  onChange={setFilterPoints}
  min={0}
  clearable
/>
```

#### 5. Add Active Date Filter
```javascript
import { DateInput } from '@mantine/dates'

<DateInput
  label={t('Active_On_Date')}
  placeholder={t('Show_questions_active_on')}
  value={filterActiveDate}
  onChange={setFilterActiveDate}
  clearable
  description={t('Shows_questions_available_on_selected_date')}
/>
```

---

### Priority 2 - Choices Management:

#### 6. Create Separate Choices Editor

**New Component**: `src/components/dashboard/ChoicesEditor.jsx`

```javascript
import React, { useState, useEffect } from 'react'
import { Modal, Stack, TextInput, Checkbox, Button, Group, ActionIcon, Divider } from '@mantine/core'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { updateMCQChoices } from '../../actions/MCQActions'

const ChoicesEditor = ({ mcqId, initialChoices, onClose, onUpdate }) => {
  const [choices, setChoices] = useState(initialChoices || [])

  const handleAddChoice = () => {
    setChoices([...choices, { text: { en: '', ar: '' }, isTrue: false }])
  }

  const handleRemoveChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index))
  }

  const handleUpdateChoice = (index, field, value) => {
    const newChoices = [...choices]
    if (field === 'isTrue') {
      newChoices.forEach((choice, i) => {
        choice.isTrue = i === index ? value : false
      })
    } else {
      newChoices[index].text[field] = value
    }
    setChoices(newChoices)
  }

  const handleSave = () => {
    dispatch(updateMCQChoices(mcqId, { choices }))
    onUpdate()
    onClose()
  }

  return (
    <Modal opened onClose={onClose} title={t('Edit_Choices')} size="lg">
      <Stack>
        {choices.map((choice, index) => (
          <Stack key={index} p="sm" withBorder>
            <Group justify="space-between">
              <Text fw={600} size="sm">{t('Choice')} {index + 1}</Text>
              <ActionIcon color="red" onClick={() => handleRemoveChoice(index)}>
                <FaTrash size={14} />
              </ActionIcon>
            </Group>
            <TextInput
              label={t('English')}
              value={choice.text.en}
              onChange={(e) => handleUpdateChoice(index, 'en', e.target.value)}
            />
            <TextInput
              label={t('Arabic')}
              value={choice.text.ar}
              onChange={(e) => handleUpdateChoice(index, 'ar', e.target.value)}
            />
            <Checkbox
              label={t('Correct_Answer')}
              checked={choice.isTrue}
              onChange={(e) => handleUpdateChoice(index, 'isTrue', e.target.checked)}
            />
          </Stack>
        ))}

        <Button leftIcon={<FaPlus />} onClick={handleAddChoice} variant="light">
          {t('Add_Choice')}
        </Button>

        <Divider />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>{t('Cancel')}</Button>
          <Button onClick={handleSave}>{t('Save_Changes')}</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ChoicesEditor
```

**New Action**: `src/actions/MCQActions.js`

```javascript
// Add new action for updating choices separately
export const updateMCQChoices = (mcqId, choicesData) => async (dispatch, getState) => {
  try {
    dispatch({ type: MCQ_CHOICES_UPDATE_REQUEST })

    const { userLogin: { userInfo } } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.put(
      `/api/mcq/${mcqId}/choices`,  // Separate endpoint
      choicesData,
      config
    )

    dispatch({
      type: MCQ_CHOICES_UPDATE_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: MCQ_CHOICES_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message
    })
  }
}
```

**Integration in BibleStudyScreen.jsx**:

```javascript
import ChoicesEditor from '../components/dashboard/ChoicesEditor'

const [choicesEditorOpened, setChoicesEditorOpened] = useState(false)
const [editingChoicesMCQ, setEditingChoicesMCQ] = useState(null)

// In the Choices section
{selectedQuestion && (
  <Group justify="flex-end" mb="xs">
    <Button
      size="xs"
      variant="light"
      leftIcon={<FaEdit />}
      onClick={() => {
        setEditingChoicesMCQ(selectedQuestion)
        setChoicesEditorOpened(true)
      }}
    >
      {t('Edit_Choices')}
    </Button>
  </Group>
)}

{/* Choices Editor Modal */}
{choicesEditorOpened && (
  <ChoicesEditor
    mcqId={editingChoicesMCQ._id}
    initialChoices={editingChoicesMCQ.choices}
    onClose={() => {
      setChoicesEditorOpened(false)
      setEditingChoicesMCQ(null)
    }}
    onUpdate={() => {
      // Refresh MCQ list
      dispatch(listMCQs({
        serviceId: selectedService,
        service_bookId: selectedBook
      }))
    }}
  />
)}
```

---

## Required Translations

Add to `src/i18n/ar.json` and `en.json`:

```json
{
  "Active": "نشط",
  "Inactive": "غير نشط",
  "All_Questions": "جميع الأسئلة",
  "Filter_by_points": "تصفية حسب النقاط",
  "Active_On_Date": "نشط في تاريخ",
  "Show_questions_active_on": "إظهار الأسئلة النشطة في",
  "Shows_questions_available_on_selected_date": "يعرض الأسئلة المتاحة في التاريخ المحدد",
  "Edit_Choices": "تعديل الاختيارات",
  "Choices_must_be_edited_separately": "يجب تعديل الاختيارات بشكل منفصل",
  "Choice": "اختيار",
  "Correct_Answer": "الإجابة الصحيحة",
  "Add_Choice": "إضافة اختيار",
  "Save_Changes": "حفظ التغييرات",
  "Cannot_change_book_for_existing_questions": "لا يمكن تغيير الكتاب للأسئلة الموجودة"
}
```

---

## Testing Checklist

- [ ] Create new MCQ with choices ✅
- [ ] Update MCQ without modifying choices ✅
- [ ] Verify choices are NOT sent in update request
- [ ] Filter MCQs by status (active/inactive)
- [ ] Filter MCQs by points value
- [ ] Filter MCQs by active date
- [ ] Edit choices using separate editor
- [ ] Verify choices update endpoint works
- [ ] Test on mobile/tablet responsive layouts
- [ ] Verify all translations display correctly

---

## Summary

### What Needs to Change:

1. **Remove choices from update payload** - Only include in create
2. **Add status filter** - Filter active/inactive questions
3. **Add points filter** - Filter by point value
4. **Add date filters** - activeOn, activeFrom, activeTo
5. **Create separate choices editor** - Manage choices independently
6. **Disable book change in edit mode** - Until backend supports it

### Architecture Benefits:

✅ Aligns with backend separation of concerns
✅ Prevents sending unsupported parameters
✅ Enables better filtering capabilities
✅ Provides dedicated choices management UI
✅ Improves UX with clear workflows

The Bible Study screen will be more powerful and aligned with the backend architecture after these updates.
