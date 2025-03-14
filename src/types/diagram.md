@startuml

!define PRIMARY_KEY(x) <color:#b8861b><&key></color> x
!define FOREIGN_KEY(x) <color:#aaaaaa><&key></color> x
!define REQUIRED(x) <b>x</b>
!define ENUM(x) <color:green><i>enum</i></color> x
!define JSON(x) <color:purple><i>json</i></color> x

' 主要实体颜色主题
skinparam class {
BackgroundColor #f5f5f5
BorderColor #8a8a8a
ArrowColor #2c3e50
}

' 用户和学习进度
entity "User" as User {
PRIMARY_KEY(id) : string
--
REQUIRED(name) : string
REQUIRED(email) : string
avatar : string
created_at : timestamp
updated_at : timestamp
ENUM(role) : "admin" | "user"
reputationScore : integer
--
JSON(socialAccounts) : object
JSON(preferences) : object
}

entity "OnChainIdentity" as OnChainIdentity {
PRIMARY_KEY(user_id) : string <<FK>>
--
JSON(sbtCertifications) : array
JSON(codeSubmissions) : array
reputationScore : integer
}

entity "LearningProgress" as LearningProgress {
PRIMARY_KEY(id) : string
--
FOREIGN_KEY(user_id) : string
totalCourses : integer
completedCourses : integer
totalLessons : integer
completedLessons : integer
totalQuizzes : integer
passedQuizzes : integer
totalTimeSpent : integer
averageScore : float
}

entity "CourseProgress" as CourseProgress {
PRIMARY_KEY(id) : string
--
FOREIGN_KEY(user_id) : string
FOREIGN_KEY(course_id) : number
progress : float
lastAccessed : timestamp
completed : boolean
startedAt : timestamp
completedAt : timestamp
}

entity "LessonProgress" as LessonProgress {
PRIMARY_KEY(id) : string
--
FOREIGN_KEY(user_id) : string
FOREIGN_KEY(lesson_id) : number
progress : float
lastAccessed : timestamp
completed : boolean
startedAt : timestamp
completedAt : timestamp
timeSpent : integer
}

entity "QuizProgress" as QuizProgress {
PRIMARY_KEY(id) : string
--
FOREIGN_KEY(user_id) : string
FOREIGN_KEY(quiz_id) : string
attempts : integer
highestScore : integer
lastAttempt : timestamp
passed : boolean
attemptsLeft : integer
lastScore : integer
}

' 课程内容
entity "Author" as Author {
PRIMARY_KEY(id) : number
--
name : string
bio : text
avatar : string
email : string
username : string
github_id : number
JSON(social_links) : object
verified_contract_address : string
}

entity "Course" as Course {
PRIMARY_KEY(id) : number
--
REQUIRED(title) : string
shortDescription : string
ENUM(lang) : "en" | "zh"
ENUM(difficulty) : "Beginner" | "Intermediate" | "Advanced"
ENUM(status) : "draft" | "published" | "archived"
tags : string[]
passers : integer
learners : integer
study_time : integer
created_at : timestamp
updated_at : timestamp
sort : integer
content : text
FOREIGN_KEY(author_id) : number
sbt_contract_address : string
ipfs_hash : string
}

entity "Lesson" as Lesson {
PRIMARY_KEY(id) : number
--
FOREIGN_KEY(course_id) : number
sort : integer
path : string
ENUM(lang) : "en" | "zh"
REQUIRED(title) : string
ENUM(status) : "draft" | "published" | "archived"
keywords : string
study_time : integer
content : text
content_url : string
created_at : timestamp
updated_at : timestamp
}

' 测验相关
entity "QuizMeta" as QuizMeta {
PRIMARY_KEY(id) : string
--
FOREIGN_KEY(course_id) : number
FOREIGN_KEY(lesson_id) : number
required_score : integer
retry_limit : integer
JSON(sbt_reward) : object
}

entity "QuizQuestion" as QuizQuestion {
PRIMARY_KEY(id) : number
--
FOREIGN_KEY(course_id) : number
FOREIGN_KEY(lesson_id) : number
REQUIRED(title) : string
explanation : text
ENUM(difficulty) : "easy" | "medium" | "hard"
weight : integer
ENUM(type) : "single" | "multiple" | "fill_blank" | "code_submission"
JSON(options) : array
JSON(correct_option_index) : any
template : string
JSON(correct) : array
language : string
starter_code : text
JSON(test_cases) : array
ai_evaluation : boolean
created_at : timestamp
updated_at : timestamp
}

entity "QuizAttempt" as QuizAttempt {
PRIMARY_KEY(id) : string
--
FOREIGN_KEY(user_id) : string
FOREIGN_KEY(quiz_id) : string
start_time : timestamp
end_time : timestamp
score : integer
passed : boolean
JSON(answers) : object
}

' 区块链相关
entity "Transaction" as Transaction {
PRIMARY_KEY(hash) : string
--
REQUIRED(from) : string
REQUIRED(to) : string
value : string
data : string
timestamp : integer
ENUM(status) : "pending" | "confirmed" | "failed"
confirmations : integer
blockNumber : integer
}

entity "WalletConnection" as WalletConnection {
PRIMARY_KEY(address) : string
--
chainId : integer
isConnected : boolean
JSON(provider) : any
networkName : string
balance : string
}

entity "SBTMetadata" as SBTMetadata {
PRIMARY_KEY(id) : string
--
name : string
description : text
image : string
JSON(attributes) : array
FOREIGN_KEY(courseId) : number
completionDate : string
score : integer
issuer : string
}

' 存储相关
entity "IPFSContent" as IPFSContent {
PRIMARY_KEY(cid) : string
--
size : integer
mimeType : string
filename : string
uploadedAt : timestamp
ENUM(pinStatus) : "pinned" | "pinning" | "failed"
}

' 代币经济
entity "TokenBalance" as TokenBalance {
PRIMARY_KEY(id) : string
--
FOREIGN_KEY(user_id) : string
symbol : string
balance : string
decimals : integer
address : string
}

entity "TokenTransaction" as TokenTransaction {
PRIMARY_KEY(txHash) : string
--
FOREIGN_KEY(user_id) : string
amount : string
ENUM(type) : "reward" | "spend" | "transfer"
timestamp : integer
reason : string
ENUM(status) : "pending" | "confirmed" | "failed"
}

entity "RewardActivity" as RewardActivity {
PRIMARY_KEY(id) : string
--
FOREIGN_KEY(userId) : string
ENUM(activityType) : "course_completion" | "quiz_pass" | "code_contribution" | "community_help"
tokenAmount : string
timestamp : integer
sourceId : string
}

' 关系定义
User ||--|| OnChainIdentity : has
User ||--|| LearningProgress : tracks
User ||--o{ CourseProgress : has
User ||--o{ LessonProgress : has
User ||--o{ QuizProgress : has
User ||--o{ QuizAttempt : submits
User ||--o{ TokenBalance : owns
User ||--o{ TokenTransaction : involved_in
User ||--o{ RewardActivity : earns
User ||--|| WalletConnection : connects

Course ||--o{ Lesson : contains
Course ||--o{ CourseProgress : tracked_by
Course ||--o{ QuizMeta : has

Lesson ||--o{ LessonProgress : tracked_by
Lesson ||--o{ QuizQuestion : has

QuizMeta ||--o{ QuizQuestion : contains
QuizMeta ||--o{ QuizAttempt : has
QuizMeta ||--o{ QuizProgress : tracked_by

QuizAttempt }o--o{ QuizQuestion : answers

Course }o--|| Author : authored_by

SBTMetadata }o--|| Course : certifies
SBTMetadata }o--|| User : owned_by

IPFSContent }|--o{ Course : stores_content
IPFSContent }|--o{ Lesson : stores_content

' 分组和颜色
together {
User
OnChainIdentity
LearningProgress
}

together {
Course
Lesson
Author
}

together {
QuizMeta
QuizQuestion
QuizAttempt
QuizProgress
}

together {
TokenBalance
TokenTransaction
RewardActivity
}

together {
Transaction
WalletConnection
SBTMetadata
}

' 注释说明
note bottom of User
核心用户实体，包含基础信息和链上身份
end note

note bottom of Course
课程实体，包含详细信息和区块链验证
end note

note bottom of QuizMeta
测验元数据，包含 SBT 奖励信息
end note

note right of SBTMetadata
非同质化代币元数据，用于课程完成证书
end note

note right of TokenTransaction
代币经济系统中的交易记录
end note

note bottom of IPFSContent
去中心化存储的内容引用
end note

@enduml
