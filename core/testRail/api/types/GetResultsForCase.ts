export interface GetResultForCase {
  id: number
  test_id: number
  status_id: number
  created_on: number
  assignedto_id: number
  comment: string
  version: string
  elapsed: string
  defects: string
  created_by: number
  custom_step_results: unknown
  attachment_ids: unknown[]
}
