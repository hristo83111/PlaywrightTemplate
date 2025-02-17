interface CustomStepsSeparated {
  content: string
  expected: string
  additional_info: string
  refs: string
}

export interface GetTestResponse {
  id: number
  case_id: number
  status_id: number
  assignedto_id: number
  run_id: number
  title: string
  template_id: number
  type_id: number
  priority_id: number
  estimate: string
  estimate_forecast: string
  refs: string
  milestone_id: number
  custom_can_be_automated: number
  custom_is_automated: number
  custom_automation_type: number
  custom_is_production_test: boolean
  custom_is_mobile_test?: boolean
  custom_user_test_details: unknown
  custom_preconds?: string
  custom_steps: unknown
  custom_expected: unknown
  custom_steps_separated: CustomStepsSeparated[]
  sections_display_order: number
  cases_display_order: number
}
