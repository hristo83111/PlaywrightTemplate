interface CustomStepsSeparated {
  content: string
  expected: string
  additional_info: string
  refs: string
}

export interface GetCaseResponse {
  id: number
  title: string
  section_id: number
  template_id: number
  type_id: number
  priority_id: number
  milestone_id: number
  refs: string
  created_by: number
  created_on: number
  updated_by: number
  updated_on: number
  estimate: string
  estimate_forecast: string
  suite_id: number
  display_order: number
  is_deleted: number
  custom_can_be_automated: number
  custom_is_automated: number
  custom_automation_type: number
  custom_is_production_test: boolean
  custom_is_mobile_test: boolean
  custom_user_test_details: unknown
  custom_preconds: string
  custom_steps: unknown
  custom_expected: unknown
  custom_steps_separated: CustomStepsSeparated[]
  custom_keyword_component: unknown[]
}
