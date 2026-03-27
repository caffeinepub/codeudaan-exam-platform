import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ExamResult {
    username: string;
    email: string;
    score: bigint;
    totalQuestions: bigint;
}
export interface backendInterface {
    getAllResults(): Promise<Array<ExamResult>>;
    getExamResult(username: string): Promise<ExamResult>;
    submitResult(username: string, email: string, score: bigint, totalQuestions: bigint): Promise<void>;
}
