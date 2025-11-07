import axios from 'axios';

// 运营规则列表项
export interface OperationRuleListDTO {
  code: number;
  name: string;
  key: string;
  description: string;
  type: string; // OpRuleType (后端枚举 toString)
  value: number;
  defaultValue: number;
  enabled: number; // 0/1
  minValue: number;
  maxValue: number;
  updateTime: string;
}

export interface OperationRuleUpdateRequest {
  value?: number; // 新值，可选
  enabled?: number; // 0/1
}

const base = '/rules';

// 查询所有运营规则（CHECK_RULE）
export function getAllOperationRules() {
  return axios.get<OperationRuleListDTO[]>(`${base}`);
}

// 更新单条运营规则（ALT_RULE）
export function updateOperationRule(
  code: number,
  params: OperationRuleUpdateRequest
) {
  return axios.put<OperationRuleListDTO>(`${base}/${code}`, params);
}
