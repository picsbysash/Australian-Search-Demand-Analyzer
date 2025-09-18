
export interface DemandData {
  state: string;
  stateFullName: string;
  demandScore: number;
}

export interface AnalysisResult {
  demandByState: DemandData[];
  relatedKeywords: string[];
  trendingTopics: string[];
  topCustomerQuestions: string[];
}

// New type for historical data from API
export interface ApiHistoricalDataPoint {
  month: string;
  trends: {
    keyword: string;
    score: number;
  }[];
}

// Type for data transformed for the chart
export interface HistoricalDataPoint {
  month: string;
  [keyword: string]: string | number;
}

// New types for content ideas
export interface ContentIdea {
    title: string;
    description: string;
}

export interface ContentIdeasResult {
    blogIdeas: ContentIdea[];
    instagramIdeas: ContentIdea[];
    tiktokIdeas: ContentIdea[];
}

export interface SuburbDemandData {
  suburb: string;
  demandScore: number;
}
