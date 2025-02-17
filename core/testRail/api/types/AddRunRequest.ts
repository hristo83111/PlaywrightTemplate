export interface AddRunRequest {
  suite_id: number
  name: string
  description: string
  include_all: boolean
  case_ids: number[]
}
