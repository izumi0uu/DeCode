@startuml ER Diagram

' 实体定义
entity "User" as User {

- id : string <<PK>>
  --
  name : string
  email : string
  avatar : string
  created_at : timestamp
  updated_at : timestamp
  role : enum("admin", "user")
  reputationScore : integer
  --
  user_progress_id : string <<FK>> <<optional>> ' References UserProgress.id
  preferences : object ' JSON structure for user preferences (language, notifications, etc.)
  socialAccounts : object ' JSON structure for GitHub, Discord, Twitter
  }

entity "UserProgress" as UserProgress {

- ## id : string <<PK>>
- user_id : string <<FK>>
  --
  courses : object ' JSON structure { [courseId: number]: CourseProgress }
  lessons : object ' JSON structure { [lessonId: number]: LessonProgress }
  quizzes : object ' JSON structure { [quizId: string]: QuizProgress }
  statistics : object <<optional>> ' JSON structure for totalCourses, completedCourses, etc.
  }

entity "CourseProgress" as CourseProgress {

- ## id : string <<PK>>
- user_progress_id : string <<FK>>
- course_id : number <<FK>>
  progress : float ' 课程总进度（0-100）
  lastAccessed : timestamp ' 最后访问时间
  completed : boolean <<optional>> ' 是否完成
  startedAt : timestamp <<optional>> ' 开始学习时间
  completedAt : timestamp <<optional>> ' 完成时间
  }

entity "LessonProgress" as LessonProgress {

- ## id : string <<PK>>
- user_progress_id : string <<FK>>
- lesson_id : number <<FK>>
  progress : float ' 章节进度（0-100）
  lastAccessed : timestamp ' 最后访问时间
  completed : boolean <<optional>> ' 是否完成
  startedAt : timestamp <<optional>> ' 开始学习时间
  completedAt : timestamp <<optional>> ' 完成时间
  timeSpent : integer <<optional>> ' 学习时长（分钟）
  }

entity "QuizProgress" as QuizProgress {

- ## id : string <<PK>>
- user_progress_id : string <<FK>>
- quiz_id : string <<FK>>
  attempts : integer ' 尝试次数
  highestScore : integer ' 最高分数
  lastAttempt : timestamp ' 最后尝试时间
  passed : boolean <<optional>> ' 是否通过
  attemptsLeft : integer <<optional>> ' 剩余尝试次数
  lastScore : integer <<optional>> ' 最近一次分数
  }

entity "Author" as Author {

- id : number <<PK>>
  --
  bio : string <<optional>>
  name : string <<optional>>
  avatar : string <<optional>>
  email : string
  username : string <<optional>>
  nickname : string <<optional>>
  github_id : number <<optional>>
  social_links : object <<optional>> ' JSON structure for linkedin, twitter, personal_website
  verified_contract_address : string <<optional>> ' 认证的智能合约地址
  }

entity "CourseDetail" as CourseDetail {

- id : number <<PK>>
  --
  title : string
  shortDescription : string
  lang : enum("en", "zh")
  difficulty : enum("Beginner", "Intermediate", "Advanced")
  status : enum("draft", "published", "archived")
  tags : string[] ' Array of tags
  passers : number
  learners : number
  study_time : number
  created_at : timestamp
  updated_at : timestamp
  sort : number
  --
  author_id : number <<FK>> ' References Author.id
  sbt_contract_address : string <<optional>>
  ipfs_hash : string
  content : string
  content_url : string
  progress : number
  requirements : string[]
  related_courses : object <<optional>> ' JSON structure for related courses
  }

entity "LessonDetail" as LessonDetail {

- ## id : number <<PK>>
- course_id : number <<FK>>
  sort : number
  path : string
  lang : enum("en", "zh")
  title : string
  status : enum("draft", "published", "archived")
  keywords : string
  study_time : number
  created_at : timestamp
  updated_at : timestamp
  --
  author_id : number <<FK>> ' References Author.id
  content : string
  content_url : string
  passers : number
  learners : number
  progress : number
  }

entity "QuizMeta" as QuizMeta {

- ## id : string <<PK>>
- course_id : number <<FK>>
- lesson_id : number <<FK>>
  required_score : number ' 通过分数
  retry_limit : number ' 重试次数限制
  sbt_reward : object <<optional>> ' JSON structure for contract_address and token_id
  }

entity "QuizQuestion" as QuizQuestion {

- ## id : number <<PK>>
- course_id : number <<FK>>
- lesson_id : number <<FK>>
  title : string
  explanation : string ' 题目解析
  difficulty : enum("easy", "medium", "hard")
  weight : number ' 题目分值
  updated_at : timestamp
  created_at : timestamp
  --
  type : enum("single", "multiple", "fill_blank", "code_submission")
  options : object <<optional>> ' JSON structure for options/correct_option_index
  template : string <<optional>> ' 填空模板
  correct : object <<optional>> ' JSON structure for correct answers
  language : string <<optional>> ' For code_submission
  starter_code : string <<optional>> ' For code_submission
  test_cases : object <<optional>> ' JSON structure for test cases
  ai_evaluation : boolean
  }

entity "QuizAttempt" as QuizAttempt {

- ## id : string <<PK>>
- user_id : string <<FK>>
- quiz_id : string <<FK>>
  start_time : timestamp
  end_time : timestamp <<optional>>
  score : number
  passed : boolean
  answers : object ' JSON structure for answers with questionId and response
  }

entity "AIFeedback" as AIFeedback {

- ## id : string <<PK>>
- quiz_attempt_id : string <<FK>>
- question_id : number <<FK>>
  feedback_text : text
  suggestions : text <<optional>>
  score : integer <<optional>>
  }

entity "CourseStatistics" as CourseStatistics {

- ## id : string <<PK>>
- course_id : number <<FK>>
  total_learners : number
  completed_learners : number
  avg_progress : float
  avg_score : float
  updated_at : timestamp
  }

entity "Achievement" as Achievement {

- ## id : string <<PK>>
- user_id : string <<FK>>
  type : enum("certificate", "badge")
  name : string
  description : text <<optional>>
  earned_at : timestamp
  }

entity "Resource" as Resource {

- id : string <<PK>>
  --
  course_id : number <<FK>> <<optional>>
  lesson_id : number <<FK>> <<optional>>
  type : enum("document", "video", "link")
  url : string
  description : text <<optional>>
  }

entity "IPFSContent" as IPFSContent {

- cid : string <<PK>>
  --
  size : number
  mimeType : string
  filename : string
  uploadedAt : timestamp
  pinStatus : enum("pinned", "pinning", "failed")
  }

entity "TheGraphQuery" as TheGraphQuery {

- id : string <<PK>>
  --
  entity : string
  filters : object ' JSON structure for filters
  orderBy : string <<optional>>
  orderDirection : enum("asc", "desc") <<optional>>
  first : number <<optional>>
  skip : number <<optional>>
  }

entity "TheGraphResponse" as TheGraphResponse {

- id : string <<PK>>
  --
  query_id : string <<FK>>
  data : object ' JSON structure for response data
  error : string <<optional>>
  }

entity "TokenBalance" as TokenBalance {

- id : string <<PK>>
  --
  user_id : string <<FK>>
  symbol : string
  balance : string
  decimals : number
  address : string
  }

entity "TokenTransaction" as TokenTransaction {

- txHash : string <<PK>>
  --
  user_id : string <<FK>>
  amount : string
  type : enum("reward", "spend", "transfer")
  timestamp : number
  reason : string
  status : enum("pending", "confirmed", "failed")
  }

entity "RewardActivity" as RewardActivity {

- id : string <<PK>>
  --
  user_id : string <<FK>>
  activityType : enum("course_completion", "quiz_pass", "code_contribution", "community_help")
  tokenAmount : string
  timestamp : number
  sourceId : string ' 关联的课程/测验/贡献 ID
  }

entity "Transaction" as Transaction {

- hash : string <<PK>>
  --
  from : string
  to : string
  value : string
  data : string <<optional>>
  timestamp : number
  status : enum("pending", "confirmed", "failed")
  confirmations : number <<optional>>
  blockNumber : number <<optional>>
  }

entity "WalletConnection" as WalletConnection {

- id : string <<PK>>
  --
  user_id : string <<FK>>
  address : string
  chainId : number
  isConnected : boolean
  networkName : string
  balance : string <<optional>>
  }

entity "ContractInteraction" as ContractInteraction {

- id : string <<PK>>
  --
  user_id : string <<FK>>
  contractAddress : string
  method : string
  params : object ' JSON structure for parameters
  value : string <<optional>>
  gasLimit : string <<optional>>
  gasPrice : string <<optional>>
  }

entity "SBTMetadata" as SBTMetadata {

- id : string <<PK>>
  --
  sbt_id : string <<FK>> ' References Achievement.id or a new SBT entity
  name : string
  description : string
  image : string
  attributes : object ' JSON structure for attributes
  courseId : number
  completionDate : timestamp
  score : number <<optional>>
  issuer : string
  }

' 关系定义
User ||--o{ UserProgress : tracks
UserProgress ||--o{ CourseProgress : includes
UserProgress ||--o{ LessonProgress : includes
UserProgress ||--o{ QuizProgress : includes
CourseDetail ||--o{ CourseProgress : tracked_by
LessonDetail ||--o{ LessonProgress : tracked_by
QuizMeta ||--o{ QuizProgress : tracked_by
User ||--o{ QuizAttempt : has
CourseDetail ||--o{ LessonDetail : contains
CourseDetail ||--o| CourseStatistics : tracked_by
CourseDetail ||--o{ Resource : has
LessonDetail ||--o{ Resource : has
QuizMeta ||--o{ QuizAttempt : has
QuizAttempt ||--o{ AIFeedback : generates
User ||--o{ Achievement : earns
AIFeedback ||--o QuizQuestion : references
CourseDetail ||--o{ IPFSContent : stores
User ||--o{ TokenBalance : holds
User ||--o{ TokenTransaction : performs
User ||--o{ RewardActivity : earns
User ||--o{ WalletConnection : manages
User ||--o{ ContractInteraction : initiates
Achievement ||--o{ SBTMetadata : describes
Transaction ||--o{ TokenTransaction : includes
TheGraphQuery ||--o{ TheGraphResponse : generates

' 注释
note right of UserProgress
Tracks user learning progress across courses, lessons, and quizzes
end note

note right of CourseProgress
Records user progress for each course
end note

note right of LessonProgress
Records user progress for each lesson
end note

note right of QuizProgress
Records user progress for each quiz
end note

note right of Achievement
Flexible achievement system beyond SBT certificates
end note

note right of Resource
Manages additional learning resources
end note

note right of AIFeedback
Stores AI-generated feedback for improvement
end note

note right of CourseStatistics
Aggregates learning analytics for course optimization
end note

note right of QuizQuestion
Defines questions for quizzes with associated feedback
end note

note right of IPFSContent
Stores decentralized course content
end note

note right of TokenBalance
Tracks user token holdings
end note

note right of RewardActivity
Logs reward activities for users
end note

note right of SBTMetadata
Metadata for Soulbound Tokens (SBTs)
end note

@enduml
