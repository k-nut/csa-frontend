export interface AddDeposit {
  timestamp: string;
  amount: number;
  title: string;
  person_id: number;
  ignore?: boolean;
  is_security?: boolean;
}

export interface Deposit extends AddDeposit {
  id: number;
  ignore: boolean;
  is_security: boolean;
  person_name: string;
  added_by_email?: string;
}

export interface NewBet {
  value: number;
  start_date: string;
  end_date?: string;
  share_id: number;
}

export interface Bet extends NewBet {
  id: number;
}
