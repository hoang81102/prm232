export interface CreateVotePayload {
  coOwnerGroupId: number;
  topic: string;
  description: string | null;
}

export interface VoteSchema {
  voteId: number;
  topic: string;
  description: string;
  status: string;
  createAt: string;
  totalYes: number;
  totalNo: number;
  choices: VoteChoice[];
}

export interface VoteChoice {
  userId: number;
  choice: string;
  voteAt: string;
}
