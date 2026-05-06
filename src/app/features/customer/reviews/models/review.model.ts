export interface Review {
    id?: string;
    userId: string;
    letterId: string;
    stars: number;
    opinion: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
