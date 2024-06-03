export interface ClaimCreateRequest {
  neighborhood: string;
  invent_num: string;
  address: string;
  direction: string;
  res: string;
  date_of_excavation: string;
  open_square: string;
  street_type: string;
  type_of_work: string;
}
export interface ClaimCreateResponse {
  data?: {
    message: string;
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface ClaimDeleteResponse {
  data?: {
    message: string;
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface ClaimUpdateRequest {
  _id: string;
  neighborhood: string;
  invent_num: string;
  address: string;
  direction: string;
  res: string | any;
  date_of_excavation: string;
  open_square: string;
  claim_number: string;
  date_recovery_ABP: string;
  street_type: string;
  type_of_work: string;
  is_deleted: boolean;
  square_restored_area: string;
  date_of_signing: string;
  image1: string | File;
  image2: string | File;
  image3: string | File;
  image4: string | File;
  date_of_obtaining_fail: string;
  date_of_sending_claim_by_obtaining_fail: string;
  date_of_sending: string;
  date_of_fixing: string;
  image5: string | File;
  image6: string | File;
  image7: string | File;
  govern: boolean;
}
export interface ClaimUpdateResponse {
  data?: {
    message: string;
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface ClaimType {
  neighborhood: string;
  invent_num: string;
  address: string;
  direction: string;
  govern: false;
  date_of_excavation: date;
  open_square: string;
  street_type: string;
  type_of_work: string;
  date_of_sending: date;
  claim_number: string;
  date_of_fixing?: date;
  date_of_obtaing_fail?: date;
  date_of_sending_claim_by_obtaining_fail?: date;
  date_of_signing?: date;
  date_recovery_ABP?: date;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  image7?: string;
  res: {
    _id: string;
    name: string;
  };
  _id: string;
}
export interface Claim {
  neighborhood: string;
  invent_num: string;
  address: string;
  direction: string;
  govern: false;
  date_of_excavation: string;
  square_restored_area: string;
  open_square: string;
  street_type: string;
  type_of_work: string;
  date_of_sending: string;
  claim_number: string;
  date_of_fixing?: string;
  date_of_obtaing_fail?: string;
  date_of_sending_claim_by_obtaining_fail?: string;
  date_of_signing?: string;
  date_recovery_ABP?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  image7?: string;
  res: {
    _id: string;
    name: string;
  };
  _id: string;
}
export interface ClaimGetByIdSuccess {
  claim: Claim;
}
export interface ClaimsGetByIdResponse {
  data?: {
    claim: Claim;
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface StatisticsByResResponse {
  data?: {
    statistics: {
      dateThreshold: Date;
      statistics: {
        res: { done: number; left: number; total: number; res: string }[];
        total: { totalCount: number; totalLeft: number; totalDone: number };
      };
    };
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface StatisticsByResSuccess {
  dateThreshold: Date;
  statistics: {
    res: { done: number; left: number; total: number; res: string }[];
    total: { totalCount: number; totalLeft: number; totalDone: number };
  };
}
export interface StatisticsByNeighborhoodResponse {
  data?: {
    statistics: {
      dateThreshold: Date;
      statistics: {
        neighborhood: {
          done: number;
          left: number;
          total: number;
          neighborhood: string;
        }[];
        total: { totalCount: number; totalLeft: number; totalDone: number };
      };
    };
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface StatisticsByNeighborhoodSuccess {
  dateThreshold: Date;
  statistics: {
    neighborhood: {
      done: number;
      left: number;
      total: number;
      neighborhood: string;
    }[];
    total: { totalCount: number; totalLeft: number; totalDone: number };
  };
}
export interface ClaimsGetResponse {
  data?: {
    claims: Claim[];
    pagination: {
      pageNumber: number;
      totalPages: number;
      totalCount: number;
    };
  };
  error?: {
    message: string;
    error?: string;
  };
}
export interface ClaimsGetErrorResponse {
  error: {
    message: string;
    error?: string;
  };
}
export interface ClaimsGetSuccessResponse {
  data: {
    claims: Claim[];
    pagination: {
      pageNumber: number;
      totalPages: number;
      totalCount: number;
    };
  };
}
