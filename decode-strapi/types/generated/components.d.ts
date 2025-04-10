import type { Schema, Struct } from '@strapi/strapi';

export interface GeneralAiPromptTemplate extends Struct.ComponentSchema {
  collectionName: 'components_general_ai_prompt_templates';
  info: {
    displayName: 'AIPromptTemplate';
    icon: 'alien';
  };
  attributes: {
    content: Schema.Attribute.String;
    quiz_question: Schema.Attribute.Relation<
      'oneToOne',
      'api::quiz-question.quiz-question'
    >;
  };
}

export interface GeneralCodeSnippet extends Struct.ComponentSchema {
  collectionName: 'components_general_code_snippets';
  info: {
    description: '';
    displayName: 'CodeSnippet';
  };
  attributes: {
    code: Schema.Attribute.Text & Schema.Attribute.Required;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'description'>;
    language: Schema.Attribute.Enumeration<
      ['javascript', 'solidity', 'jsx', 'tsx']
    > &
      Schema.Attribute.DefaultTo<'javascript'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Unnamed'>;
  };
}

export interface GeneralCourseRequirement extends Struct.ComponentSchema {
  collectionName: 'components_general_course_requirements';
  info: {
    displayName: 'CourseRequirement';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'description'>;
    isRequired: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Unnamed'>;
  };
}

export interface GeneralFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_general_faq_items';
  info: {
    displayName: 'FAQItem';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface GeneralLearningOutcome extends Struct.ComponentSchema {
  collectionName: 'components_general_learning_outcomes';
  info: {
    displayName: 'LearningOutcome';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'description'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Unnamed'>;
  };
}

export interface GeneralMediaItem extends Struct.ComponentSchema {
  collectionName: 'components_general_media_items';
  info: {
    displayName: 'MediaItem';
  };
  attributes: {
    description: Schema.Attribute.Text;
    media: Schema.Attribute.Media;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['image', 'video', 'document']>;
    url: Schema.Attribute.String;
  };
}

export interface GeneralMetaTags extends Struct.ComponentSchema {
  collectionName: 'components_general_meta_tags';
  info: {
    displayName: 'MetaTags';
  };
  attributes: {
    description: Schema.Attribute.Text;
    keywords: Schema.Attribute.Text;
    ogImage: Schema.Attribute.Media;
    title: Schema.Attribute.String;
  };
}

export interface GeneralProgrammingExercise extends Struct.ComponentSchema {
  collectionName: 'components_general_programming_exercise';
  info: {
    displayName: 'ProgrammingExercise';
  };
  attributes: {
    aiAssistEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    expectedOutput: Schema.Attribute.Text;
    hints: Schema.Attribute.RichText;
    instructions: Schema.Attribute.RichText & Schema.Attribute.Required;
    startingCode: Schema.Attribute.Text;
  };
}

export interface GeneralQuizSettings extends Struct.ComponentSchema {
  collectionName: 'components_general_quiz_settings';
  info: {
    displayName: 'QuizSettings';
  };
  attributes: {
    allowRetry: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    maxAttempts: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    passingScore: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<70>;
    showAnswersAfterSubmission: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    timeLimit: Schema.Attribute.Integer;
  };
}

export interface GeneralSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_general_social_links';
  info: {
    displayName: 'SocialLinks';
    icon: 'emotionHappy';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['twitter', 'github', 'linkedin', 'insta', 'website', 'bilibili']
    >;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GeneralTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_general_testimonial_items';
  info: {
    displayName: 'TestimonialItem';
  };
  attributes: {
    avatar: Schema.Attribute.Media;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    role: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'general.ai-prompt-template': GeneralAiPromptTemplate;
      'general.code-snippet': GeneralCodeSnippet;
      'general.course-requirement': GeneralCourseRequirement;
      'general.faq-item': GeneralFaqItem;
      'general.learning-outcome': GeneralLearningOutcome;
      'general.media-item': GeneralMediaItem;
      'general.meta-tags': GeneralMetaTags;
      'general.programming-exercise': GeneralProgrammingExercise;
      'general.quiz-settings': GeneralQuizSettings;
      'general.social-links': GeneralSocialLinks;
      'general.testimonial-item': GeneralTestimonialItem;
    }
  }
}
