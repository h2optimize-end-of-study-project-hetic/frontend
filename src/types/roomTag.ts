
type tag ={
  name: string;
  id: number;
  source_address: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export type roomTag = {
  id: number;
  tag: tag;
  start_at: Date;
  end_at: Date;
  created_at: Date;
  updated_at: Date;
};