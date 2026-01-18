# Database Schema

The Health & Fitness Tracker uses MongoDB with Mongoose for data modeling. Below are the detailed schemas for all collections.

---

## 👥 User (`User.js`)
Stores authentication and basic account information.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `name` | String | User's full name | Required, Trimmed |
| `email` | String | Unique login email | Required, Unique, Lowercase, Regex Match |
| `password` | String | Hashed password | Required, Min 6 chars, Hidden in select |
| `role` | String | Access level | Enum: `user`, `trainer`, `admin`, `doctor` |
| `isActive` | Boolean | Account status | Default: `true` |
| `profile` | ObjectId | Reference to Profile | Ref: `Profile` |
| `timestamps` | Date | Created/Updated at | Auto-generated |

---

## 🏃 Activity (`Activity.js`)
Tracks daily physical activities and calorie estimations.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Target user | Required, Ref: `User`, Indexed |
| `activityType`| String | Category | Enum: `steps`, `workout`, `running`, `cycling`, `swimming`, `yoga`, `sleep`, `other` |
| `date` | Date | Activity date | Required, Default: `now`, Indexed |
| `steps` | Number | Footsteps count | Min: 0 |
| `distance` | Number | Kilometers | Min: 0 |
| `duration` | Number | Minutes | Min: 0 |
| `caloriesBurned`| Number | Burned energy | Min: 0 (Auto-estimated if empty) |
| `heartRate` | Object | {average, max} | Optional |
| `sleepQuality` | String | Sleep depth | Enum: `poor`, `fair`, `good`, `excellent` |

---

## 🎯 Goal (`Goal.js`)
Manages fitness targets and progress tracking.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Target user | Required, Ref: `User`, Indexed |
| `goalType` | String | Goal category | Enum: `daily_steps`, `weekly_workouts`, `weight_loss`, etc. |
| `targetValue` | Number | Aiming for | Required, Min: 1 |
| `currentValue`| Number | Accomplished | Default: 0 |
| `deadline` | Date | Target finish | Optional |
| `isActive` | Boolean | Tracking status | Default: `true` |
| `isAchieved` | Boolean | Met target? | Default: `false` |
| `period` | String | Cycle frequency | Enum: `daily`, `weekly`, `monthly`, `one-time` |

---

## 🏋️ WorkoutPlan (`WorkoutPlan.js`)
Custom exercise routines created by trainers.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `trainer` | ObjectId | Creator | Required, Ref: `User` |
| `title` | String | Plan name | Required, Trimmed |
| `exercises` | Array | List of exercises | { name, sets, reps, duration, notes } |
| `difficulty` | String | Skill level | Enum: `beginner`, `intermediate`, `advanced` |
| `assignedUsers`| Array | Users following | Ref: `User` |

---

## 🥗 DietPlan (`DietPlan.js`)
Nutrition targets and meal structure.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Target user | Required, Ref: `User` |
| `dietitian` | ObjectId | Creator (Doctor/Trainer) | Required, Ref: `User` |
| `title` | String | Diet name | Required, Trimmed |
| `meals` | Object | Meal breakdown | { breakfast, lunch, dinner, snacks } |
| `calorieTarget`| Number | Total calories | Default: 0 |
| `macroTargets` | Number | Protein/Carbs/Fats | Default: 0 |

---

## 🍱 Meal (`Meal.js`)
Individual meal entries for daily tracking.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Owner | Required, Ref: `User` |
| `name` | String | Meal name | Required, Trimmed |
| `mealType` | String | Category | Enum: `breakfast`, `lunch`, `dinner`, `snack` |
| `macros` | Number | Cal/Pro/Carb/Fat | Defaults: 0 |

---

## � Profile (`Profile.js`)
Detailed physical information for health calculations.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Owner | Required, Unique, Ref: `User` |
| `age` | Number | Years | Min: 1, Max: 150 |
| `height` | Number | Centimeters | Min: 50, Max: 300 |
| `weight` | Number | Kilograms | Min: 20, Max: 500 |
| `gender` | String | Biological sex | Enum: `male`, `female`, `other` |

---

## 📨 Message (`Message.js`)
Communication system between users and professionals.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `sender` | ObjectId | Originator | Required, Ref: `User` |
| `receiver` | ObjectId | Target | Required, Ref: `User` |
| `content` | String | Message text | Required |
| `isRead` | Boolean | Status | Default: `false` |

---

## 🏥 MedicalRecord (`MedicalRecord.js`)
Confidential health records managed by doctors.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Patient | Required, Ref: `User` |
| `doctor` | ObjectId | Practitioner | Ref: `User` |
| `recordType` | String | Report type | Enum: `lab_report`, `prescription`, `checkup`, etc. |
| `vitals` | Object | Health stats | BP, Heart Rate, Temp, weight, etc. |
| `fileUrl` | String | Attachment path | Path to uploaded file |

---

## ⚖️ WeightLog (`WeightLog.js`)
Historical weight tracking for charts.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Owner | Required, Ref: `User` |
| `weight` | Number | Reading | Required, Min: 20, Max: 500 |
| `date` | Date | Timestamp | Default: `now` |

---

## 🔔 Notification (`Notification.js`)
System alerts and reminders.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Target | Required, Ref: `User` |
| `message` | String | Alert text | Required |
| `type` | String | Category | Enum: `reminder`, `alert`, `motivational`, `info` |
| `isRead` | Boolean | Status | Default: `false` |

---

## 💬 Feedback (`Feedback.js`)
User reviews and app feedback.

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Reporter | Required, Ref: `User` |
| `subject` | String | Brief topic | Required, Trimmed |
| `message` | String | Full detail | Required |
| `status` | String | Review status | Enum: `pending`, `reviewed`, `resolved` |
