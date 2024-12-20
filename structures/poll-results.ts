import { PollAnswerCount } from '../types';

class PollResults {
  private _results: Map<number, PollAnswerCount> = new Map();

  public constructor(results: Array<PollAnswerCount>) {
    results.forEach((result) => this._results.set(result.id, result));
  }

  public getCount(answerId: number): number | undefined {
    return this._results.get(answerId)?.count;
  }

  public getResults(answerId: number): PollAnswerCount | undefined {
    return this._results.get(answerId);
  }

  public get totalVotes(): number {
    return Array.from(this._results.values()).reduce((sum, result) => sum + result.count, 0);
  }

  public get highestVotedAnswer(): number | undefined {
    const sortedResults = Array.from(this._results.values()).sort((a, b) => b.count - a.count);
    return sortedResults[0].id;
  }
}

export { PollResults };
