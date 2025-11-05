export default {
  'schedulePage.title': '医生排班管理',

  // 医生面板
  'schedulePage.doctorPanel.title': '医生选择',
  'schedulePage.doctorPanel.departments': '科室',
  'schedulePage.doctorPanel.doctors': '医生列表',
  'schedulePage.doctorPanel.allDepartments': '全部科室',
  'schedulePage.doctorPanel.noDoctors': '暂无医生',
  'schedulePage.doctorPanel.fetchDepartmentsError': '获取科室列表失败',
  'schedulePage.doctorPanel.fetchDoctorsError': '获取医生列表失败',

  // 日历面板
  'schedulePage.calendar.currentDoctor': '当前医生',
  'schedulePage.calendar.noDoctorSelected': '未选择医生',
  'schedulePage.calendar.selectDoctorTip': '请先从左侧选择医生',
  'schedulePage.calendar.prevWeek': '上一周',
  'schedulePage.calendar.nextWeek': '下一周',
  'schedulePage.calendar.thisWeek': '本周',
  'schedulePage.calendar.timeSlot': '时段',
  'schedulePage.calendar.totalSlots': '总',
  'schedulePage.calendar.availableSlots': '剩余',

  // 表单
  'schedulePage.form.doctorUserId': '医生',
  'schedulePage.form.doctorUserId.placeholder': '请选择医生',
  'schedulePage.form.scheduleStartDate': '开始日期',
  'schedulePage.form.scheduleStartDate.placeholder': '请选择开始日期',
  'schedulePage.form.scheduleEndDate': '结束日期',
  'schedulePage.form.scheduleEndDate.placeholder': '请选择结束日期',
  'schedulePage.form.slotType': '号别',
  'schedulePage.form.slotType.placeholder': '请选择号别',
  'schedulePage.form.status': '状态',
  'schedulePage.form.status.placeholder': '请选择状态',

  // 号别
  'schedulePage.slotType.normal': '普通号',
  'schedulePage.slotType.expert': '专家号',
  'schedulePage.slotType.special': '特需号',

  // 状态
  'schedulePage.status.inactive': '停用',
  'schedulePage.status.active': '启用',

  // 表格列
  'schedulePage.columns.index': '序号',
  'schedulePage.columns.doctorUserId': '医生ID',
  'schedulePage.columns.scheduleDate': '排班日期',
  'schedulePage.columns.slotType': '号别',
  'schedulePage.columns.slotPeriod': '时段',
  'schedulePage.columns.totalSlots': '总号源',
  'schedulePage.columns.availableSlots': '剩余号源',
  'schedulePage.columns.fee': '挂号费(元)',
  'schedulePage.columns.status': '状态',
  'schedulePage.columns.createTime': '创建时间',
  'schedulePage.columns.operations.title': '操作',
  'schedulePage.columns.operations.edit': '编辑',
  'schedulePage.columns.operations.delete': '删除',

  // 按钮
  'schedulePage.button.add': '新增排班',
  'schedulePage.button.batchDelete': '批量删除',
  'schedulePage.button.copySchedule': '复制排班',

  // 新增/编辑弹窗
  'schedulePage.modal.addTitle': '新增排班',
  'schedulePage.modal.editTitle': '编辑排班',
  'schedulePage.modal.form.doctorUserId': '医生',
  'schedulePage.modal.form.doctorUserId.placeholder': '请选择医生',
  'schedulePage.modal.form.doctorUserId.required': '请选择医生',
  'schedulePage.modal.form.scheduleDate': '排班日期',
  'schedulePage.modal.form.scheduleDate.placeholder': '请选择排班日期',
  'schedulePage.modal.form.scheduleDate.required': '请选择排班日期',
  'schedulePage.modal.form.slotType': '号别',
  'schedulePage.modal.form.slotType.placeholder': '请选择号别',
  'schedulePage.modal.form.slotType.required': '请选择号别',
  'schedulePage.modal.form.slotPeriod': '时段',
  'schedulePage.modal.form.slotPeriod.placeholder': '请选择时段',
  'schedulePage.modal.form.slotPeriod.required': '请选择时段',
  'schedulePage.modal.form.totalSlots': '总号源数',
  'schedulePage.modal.form.totalSlots.placeholder': '请输入总号源数',
  'schedulePage.modal.form.totalSlots.required': '请输入总号源数',
  'schedulePage.modal.form.availableSlots': '剩余号源数',
  'schedulePage.modal.form.availableSlots.placeholder': '请输入剩余号源数',
  'schedulePage.modal.form.fee': '挂号费',
  'schedulePage.modal.form.fee.placeholder': '请输入挂号费',
  'schedulePage.modal.form.fee.required': '请输入挂号费',
  'schedulePage.modal.form.status': '状态',
  'schedulePage.modal.form.status.placeholder': '请选择状态',
  'schedulePage.modal.form.status.required': '请选择状态',

  // 复制排班弹窗
  'schedulePage.copyModal.title': '复制排班',
  'schedulePage.copyModal.tips':
    '将复制7天前该医生的排班到目标日期。如果目标日期已有排班，则不会覆盖。',
  'schedulePage.copyModal.form.doctorUserId': '医生',
  'schedulePage.copyModal.form.doctorUserId.placeholder': '请选择医生',
  'schedulePage.copyModal.form.doctorUserId.required': '请选择医生',
  'schedulePage.copyModal.form.targetDate': '目标日期',
  'schedulePage.copyModal.form.targetDate.placeholder': '请选择目标日期',
  'schedulePage.copyModal.form.targetDate.required': '请选择目标日期',

  // 通用
  'common.confirm': '确认',
  'common.cancel': '取消',

  // 消息提示
  'schedulePage.message.fetchError': '获取排班列表失败',
  'schedulePage.message.fetchDetailError': '获取排班详情失败',
  'schedulePage.message.fetchDoctorsError': '获取医生列表失败',
  'schedulePage.message.createSuccess': '创建排班成功',
  'schedulePage.message.createError': '创建排班失败',
  'schedulePage.message.updateSuccess': '更新排班成功',
  'schedulePage.message.updateError': '更新排班失败',
  'schedulePage.message.deleteSuccess': '删除排班成功',
  'schedulePage.message.deleteError': '删除排班失败',
  'schedulePage.message.deleteConfirm': '确认删除',
  'schedulePage.message.deleteConfirmContent': '确定要删除该排班吗？',
  'schedulePage.message.batchDeleteSuccess': '批量删除成功',
  'schedulePage.message.batchDeleteError': '批量删除失败',
  'schedulePage.message.batchDeleteConfirm': '确认批量删除',
  'schedulePage.message.batchDeleteConfirmContent': '确定要删除选中的排班吗？',
  'schedulePage.message.selectAtLeastOne': '请至少选择一条记录',
  'schedulePage.message.copySuccess': '复制排班成功',
  'schedulePage.message.copyError': '复制排班失败',
};
