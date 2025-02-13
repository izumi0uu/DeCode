interface CoursePlay {
  id: number;
  title: string;
  instructor: string;
  learners: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  tags: string[];
  lastUpdated: string;
}

const coursePlay: CoursePlay[] = [
  {
    id: 1,
    title: "Introduction to Web3",
    instructor: "John Doe",
    learners: 1000,
    difficulty: "Beginner",
    thumbnail: "https://via.placeholder.com/150",
    tags: ["Web3", "Blockchain", "Crypto"],
    lastUpdated: "2024-01-01",
  },
];
