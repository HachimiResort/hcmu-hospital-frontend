# OpenAPI definition


**简介**:OpenAPI definition


**HOST**:http://localhost:8080


**联系人**:


**Version**:v0


**接口路径**:/v3/api-docs


[TOC]






# 待注册用户接口


## 获取所有待注册用户


**接口地址**:`/pending-users`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有待注册用户</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|requestDTO||query|true|PendingUserGetRequestDTO|PendingUserGetRequestDTO|
|&emsp;&emsp;userName|||false|string||
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;email|||false|string||
|&emsp;&emsp;pageNum|||false|integer(int64)||
|&emsp;&emsp;pageSize|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTOPendingUserListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTOPendingUserListDTO|PageDTOPendingUserListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|PendingUserListDTO|
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;email||string||
|&emsp;&emsp;&emsp;&emsp;roleId||integer||
|&emsp;&emsp;&emsp;&emsp;roleName||string||
|&emsp;&emsp;&emsp;&emsp;identityType||integer||
|&emsp;&emsp;&emsp;&emsp;studentTeacherId||string||
|&emsp;&emsp;&emsp;&emsp;departmentName||string||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;specialty||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"id": 0,
				"userName": "",
				"name": "",
				"email": "",
				"roleId": 0,
				"roleName": "",
				"identityType": 0,
				"studentTeacherId": "",
				"departmentName": "",
				"title": "",
				"specialty": ""
			}
		]
	}
}
```


## 根据ID获取待注册用户信息


**接口地址**:`/pending-users/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID获取待注册用户信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPendingUserInfoDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PendingUserInfoDTO|PendingUserInfoDTO|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;email||string||
|&emsp;&emsp;roleId||integer(int64)||
|&emsp;&emsp;roleName||string||
|&emsp;&emsp;identityType||integer(int32)||
|&emsp;&emsp;studentTeacherId||string||
|&emsp;&emsp;departmentName||string||
|&emsp;&emsp;title||string||
|&emsp;&emsp;specialty||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"id": 0,
		"userName": "",
		"name": "",
		"email": "",
		"roleId": 0,
		"roleName": "",
		"identityType": 0,
		"studentTeacherId": "",
		"departmentName": "",
		"title": "",
		"specialty": ""
	}
}
```


## 删除待注册用户


**接口地址**:`/pending-users/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除待注册用户</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 批量删除待注册用户


**接口地址**:`/pending-users/batch`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量删除待注册用户</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|integers|integer|body|true|array||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 上传待注册用户


**接口地址**:`/pending-users/import`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>上传待注册用户</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleId||query|true|integer(int64)||
|file||query|true|file||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


# 等待队列接口


## getWaitlists


**接口地址**:`/waitlists`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|requestDTO||query|true|WaitlistGetRequestDTO|WaitlistGetRequestDTO|
|&emsp;&emsp;patientUserId|||false|integer(int64)||
|&emsp;&emsp;scheduleId|||false|integer(int64)||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;pageNum|||false|integer(int64)||
|&emsp;&emsp;pageSize|||false|integer(int64)||
|&emsp;&emsp;isDeleted|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTOWaitlistListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTOWaitlistListDTO|PageDTOWaitlistListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|WaitlistListDTO|
|&emsp;&emsp;&emsp;&emsp;waitlistId||integer||
|&emsp;&emsp;&emsp;&emsp;patientUserId||integer||
|&emsp;&emsp;&emsp;&emsp;scheduleId||integer||
|&emsp;&emsp;&emsp;&emsp;status||integer||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;patientUserName||string||
|&emsp;&emsp;&emsp;&emsp;patientPhone||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"waitlistId": 0,
				"patientUserId": 0,
				"scheduleId": 0,
				"status": 0,
				"createTime": "",
				"patientUserName": "",
				"patientPhone": ""
			}
		]
	}
}
```


## getWaitlistById


**接口地址**:`/waitlists/{waitlistId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|waitlistId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultWaitlistDetailDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||WaitlistDetailDTO|WaitlistDetailDTO|
|&emsp;&emsp;waitlistId||integer(int64)||
|&emsp;&emsp;patientUserId||integer(int64)||
|&emsp;&emsp;scheduleId||integer(int64)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;notifiedTime||string(date-time)||
|&emsp;&emsp;lockExpireTime||string(date-time)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;patientUserName||string||
|&emsp;&emsp;patientPhone||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"waitlistId": 0,
		"patientUserId": 0,
		"scheduleId": 0,
		"status": 0,
		"notifiedTime": "",
		"lockExpireTime": "",
		"createTime": "",
		"updateTime": "",
		"patientUserName": "",
		"patientPhone": ""
	}
}
```


# 挂号预约接口


## getAppointments


**接口地址**:`/appointments`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|requestDTO||query|true|AppointmentGetRequestDTO|AppointmentGetRequestDTO|
|&emsp;&emsp;scheduleId|||false|integer(int64)||
|&emsp;&emsp;patientUserId|||false|integer(int64)||
|&emsp;&emsp;pageNum|||false|integer(int64)||
|&emsp;&emsp;pageSize|||false|integer(int64)||
|&emsp;&emsp;isDeleted|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTOAppointmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTOAppointmentListDTO|PageDTOAppointmentListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|AppointmentListDTO|
|&emsp;&emsp;&emsp;&emsp;appointmentId||integer||
|&emsp;&emsp;&emsp;&emsp;appointmentNo||string||
|&emsp;&emsp;&emsp;&emsp;patientUserId||integer||
|&emsp;&emsp;&emsp;&emsp;scheduleId||integer||
|&emsp;&emsp;&emsp;&emsp;visitNo||integer||
|&emsp;&emsp;&emsp;&emsp;status||integer||
|&emsp;&emsp;&emsp;&emsp;originalFee||number||
|&emsp;&emsp;&emsp;&emsp;actualFee||number||
|&emsp;&emsp;&emsp;&emsp;paymentTime||string||
|&emsp;&emsp;&emsp;&emsp;cancellationTime||string||
|&emsp;&emsp;&emsp;&emsp;cancellationReason||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;patientUserName||string||
|&emsp;&emsp;&emsp;&emsp;patientPhone||string||
|&emsp;&emsp;&emsp;&emsp;patientName||string||
|&emsp;&emsp;&emsp;&emsp;scheduleDate||string||
|&emsp;&emsp;&emsp;&emsp;slotType||integer||
|&emsp;&emsp;&emsp;&emsp;slotPeriod||integer||
|&emsp;&emsp;&emsp;&emsp;doctorName||string||
|&emsp;&emsp;&emsp;&emsp;doctorTitle||string||
|&emsp;&emsp;&emsp;&emsp;departmentName||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"appointmentId": 0,
				"appointmentNo": "",
				"patientUserId": 0,
				"scheduleId": 0,
				"visitNo": 0,
				"status": 0,
				"originalFee": 0,
				"actualFee": 0,
				"paymentTime": "",
				"cancellationTime": "",
				"cancellationReason": "",
				"createTime": "",
				"updateTime": "",
				"patientUserName": "",
				"patientPhone": "",
				"patientName": "",
				"scheduleDate": "",
				"slotType": 0,
				"slotPeriod": 0,
				"doctorName": "",
				"doctorTitle": "",
				"departmentName": ""
			}
		]
	}
}
```


## getAppointmentById


**接口地址**:`/appointments/{appointmentId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appointmentId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultAppointmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||AppointmentListDTO|AppointmentListDTO|
|&emsp;&emsp;appointmentId||integer(int64)||
|&emsp;&emsp;appointmentNo||string||
|&emsp;&emsp;patientUserId||integer(int64)||
|&emsp;&emsp;scheduleId||integer(int64)||
|&emsp;&emsp;visitNo||integer(int32)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;originalFee||number||
|&emsp;&emsp;actualFee||number||
|&emsp;&emsp;paymentTime||string(date-time)||
|&emsp;&emsp;cancellationTime||string(date-time)||
|&emsp;&emsp;cancellationReason||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;patientUserName||string||
|&emsp;&emsp;patientPhone||string||
|&emsp;&emsp;patientName||string||
|&emsp;&emsp;scheduleDate||string(date)||
|&emsp;&emsp;slotType||integer(int32)||
|&emsp;&emsp;slotPeriod||integer(int32)||
|&emsp;&emsp;doctorName||string||
|&emsp;&emsp;doctorTitle||string||
|&emsp;&emsp;departmentName||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"appointmentId": 0,
		"appointmentNo": "",
		"patientUserId": 0,
		"scheduleId": 0,
		"visitNo": 0,
		"status": 0,
		"originalFee": 0,
		"actualFee": 0,
		"paymentTime": "",
		"cancellationTime": "",
		"cancellationReason": "",
		"createTime": "",
		"updateTime": "",
		"patientUserName": "",
		"patientPhone": "",
		"patientName": "",
		"scheduleDate": "",
		"slotType": 0,
		"slotPeriod": 0,
		"doctorName": "",
		"doctorTitle": "",
		"departmentName": ""
	}
}
```


## 取消预约


**接口地址**:`/appointments/{appointmentId}/cancel`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>取消预约</p>



**请求示例**:


```javascript
{
  "reason": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appointmentId||path|true|integer(int64)||
|appointmentCancelDTO|AppointmentCancelDTO|body|true|AppointmentCancelDTO|AppointmentCancelDTO|
|&emsp;&emsp;reason|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultAppointmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||AppointmentListDTO|AppointmentListDTO|
|&emsp;&emsp;appointmentId||integer(int64)||
|&emsp;&emsp;appointmentNo||string||
|&emsp;&emsp;patientUserId||integer(int64)||
|&emsp;&emsp;scheduleId||integer(int64)||
|&emsp;&emsp;visitNo||integer(int32)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;originalFee||number||
|&emsp;&emsp;actualFee||number||
|&emsp;&emsp;paymentTime||string(date-time)||
|&emsp;&emsp;cancellationTime||string(date-time)||
|&emsp;&emsp;cancellationReason||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;patientUserName||string||
|&emsp;&emsp;patientPhone||string||
|&emsp;&emsp;patientName||string||
|&emsp;&emsp;scheduleDate||string(date)||
|&emsp;&emsp;slotType||integer(int32)||
|&emsp;&emsp;slotPeriod||integer(int32)||
|&emsp;&emsp;doctorName||string||
|&emsp;&emsp;doctorTitle||string||
|&emsp;&emsp;departmentName||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"appointmentId": 0,
		"appointmentNo": "",
		"patientUserId": 0,
		"scheduleId": 0,
		"visitNo": 0,
		"status": 0,
		"originalFee": 0,
		"actualFee": 0,
		"paymentTime": "",
		"cancellationTime": "",
		"cancellationReason": "",
		"createTime": "",
		"updateTime": "",
		"patientUserName": "",
		"patientPhone": "",
		"patientName": "",
		"scheduleDate": "",
		"slotType": 0,
		"slotPeriod": 0,
		"doctorName": "",
		"doctorTitle": "",
		"departmentName": ""
	}
}
```


## 支付预约


**接口地址**:`/appointments/{appointmentId}/pay`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>支付预约</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|appointmentId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultAppointmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||AppointmentListDTO|AppointmentListDTO|
|&emsp;&emsp;appointmentId||integer(int64)||
|&emsp;&emsp;appointmentNo||string||
|&emsp;&emsp;patientUserId||integer(int64)||
|&emsp;&emsp;scheduleId||integer(int64)||
|&emsp;&emsp;visitNo||integer(int32)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;originalFee||number||
|&emsp;&emsp;actualFee||number||
|&emsp;&emsp;paymentTime||string(date-time)||
|&emsp;&emsp;cancellationTime||string(date-time)||
|&emsp;&emsp;cancellationReason||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;patientUserName||string||
|&emsp;&emsp;patientPhone||string||
|&emsp;&emsp;patientName||string||
|&emsp;&emsp;scheduleDate||string(date)||
|&emsp;&emsp;slotType||integer(int32)||
|&emsp;&emsp;slotPeriod||integer(int32)||
|&emsp;&emsp;doctorName||string||
|&emsp;&emsp;doctorTitle||string||
|&emsp;&emsp;departmentName||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"appointmentId": 0,
		"appointmentNo": "",
		"patientUserId": 0,
		"scheduleId": 0,
		"visitNo": 0,
		"status": 0,
		"originalFee": 0,
		"actualFee": 0,
		"paymentTime": "",
		"cancellationTime": "",
		"cancellationReason": "",
		"createTime": "",
		"updateTime": "",
		"patientUserName": "",
		"patientPhone": "",
		"patientName": "",
		"scheduleDate": "",
		"slotType": 0,
		"slotPeriod": 0,
		"doctorName": "",
		"doctorTitle": "",
		"departmentName": ""
	}
}
```


# 患者档案接口


## 查询患者档案列表('CHECK_PATIENT')


**接口地址**:`/patient-profiles`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询患者档案列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|requestDTO||query|true|PatientProfileGetRequestDTO|PatientProfileGetRequestDTO|
|&emsp;&emsp;pageNum|||false|integer(int32)||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;identityType|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTOPatientProfileListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTOPatientProfileListDTO|PageDTOPatientProfileListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|PatientProfileListDTO|
|&emsp;&emsp;&emsp;&emsp;patientProfileId||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;identityType||integer||
|&emsp;&emsp;&emsp;&emsp;studentTeacherId||string||
|&emsp;&emsp;&emsp;&emsp;emergencyContact||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"patientProfileId": 0,
				"userId": 0,
				"userName": "",
				"name": "",
				"identityType": 0,
				"studentTeacherId": "",
				"emergencyContact": "",
				"createTime": ""
			}
		]
	}
}
```


## 创建患者档案('ADD_PATIENT')


**接口地址**:`/patient-profiles`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建患者档案</p>



**请求示例**:


```javascript
{
  "userId": 0,
  "identityType": 0,
  "studentTeacherId": "",
  "emergencyContact": "",
  "emergencyContactPhone": "",
  "medicalHistory": "",
  "allergyHistory": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|patientProfileCreateDTO|PatientProfileCreateDTO|body|true|PatientProfileCreateDTO|PatientProfileCreateDTO|
|&emsp;&emsp;userId|||true|integer(int64)||
|&emsp;&emsp;identityType|||true|integer(int32)||
|&emsp;&emsp;studentTeacherId|||false|string||
|&emsp;&emsp;emergencyContact|||false|string||
|&emsp;&emsp;emergencyContactPhone|||false|string||
|&emsp;&emsp;medicalHistory|||false|string||
|&emsp;&emsp;allergyHistory|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPatientProfileListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PatientProfileListDTO|PatientProfileListDTO|
|&emsp;&emsp;patientProfileId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;identityType||integer(int32)||
|&emsp;&emsp;studentTeacherId||string||
|&emsp;&emsp;emergencyContact||string||
|&emsp;&emsp;createTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"patientProfileId": 0,
		"userId": 0,
		"userName": "",
		"name": "",
		"identityType": 0,
		"studentTeacherId": "",
		"emergencyContact": "",
		"createTime": ""
	}
}
```


## 删除患者档案('DEL_PATIENT')


**接口地址**:`/patient-profiles/{patientProfileId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除患者档案</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|patientProfileId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 获取患者档案详情(‘CHECK_PATIENT’)


**接口地址**:`/patient-profiles/{userId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取患者档案详情</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPatientProfileDetailDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PatientProfileDetailDTO|PatientProfileDetailDTO|
|&emsp;&emsp;patientProfileId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;identityType||integer(int32)||
|&emsp;&emsp;studentTeacherId||string||
|&emsp;&emsp;emergencyContact||string||
|&emsp;&emsp;emergencyContactPhone||string||
|&emsp;&emsp;medicalHistory||string||
|&emsp;&emsp;allergyHistory||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"patientProfileId": 0,
		"userId": 0,
		"userName": "",
		"name": "",
		"identityType": 0,
		"studentTeacherId": "",
		"emergencyContact": "",
		"emergencyContactPhone": "",
		"medicalHistory": "",
		"allergyHistory": "",
		"createTime": "",
		"updateTime": ""
	}
}
```


## 更新患者档案('ALT_PATIENT')


**接口地址**:`/patient-profiles/{userId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新患者档案信息</p>



**请求示例**:


```javascript
{
  "identityType": 0,
  "studentTeacherId": "",
  "emergencyContact": "",
  "emergencyContactPhone": "",
  "medicalHistory": "",
  "allergyHistory": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||
|patientProfileUpdateDTO|PatientProfileUpdateDTO|body|true|PatientProfileUpdateDTO|PatientProfileUpdateDTO|
|&emsp;&emsp;identityType|||false|integer(int32)||
|&emsp;&emsp;studentTeacherId|||false|string||
|&emsp;&emsp;emergencyContact|||false|string||
|&emsp;&emsp;emergencyContactPhone|||false|string||
|&emsp;&emsp;medicalHistory|||false|string||
|&emsp;&emsp;allergyHistory|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 根据用户id查找预约('CHECK_APPOINTMENT')


**接口地址**:`/patient-profiles/{userId}/appointments`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据用户id查找预约</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||
|appointmentGetRequestDTO||query|true|AppointmentGetRequestDTO|AppointmentGetRequestDTO|
|&emsp;&emsp;scheduleId|||false|integer(int64)||
|&emsp;&emsp;patientUserId|||false|integer(int64)||
|&emsp;&emsp;pageNum|||false|integer(int64)||
|&emsp;&emsp;pageSize|||false|integer(int64)||
|&emsp;&emsp;isDeleted|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTOAppointmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTOAppointmentListDTO|PageDTOAppointmentListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|AppointmentListDTO|
|&emsp;&emsp;&emsp;&emsp;appointmentId||integer||
|&emsp;&emsp;&emsp;&emsp;appointmentNo||string||
|&emsp;&emsp;&emsp;&emsp;patientUserId||integer||
|&emsp;&emsp;&emsp;&emsp;scheduleId||integer||
|&emsp;&emsp;&emsp;&emsp;visitNo||integer||
|&emsp;&emsp;&emsp;&emsp;status||integer||
|&emsp;&emsp;&emsp;&emsp;originalFee||number||
|&emsp;&emsp;&emsp;&emsp;actualFee||number||
|&emsp;&emsp;&emsp;&emsp;paymentTime||string||
|&emsp;&emsp;&emsp;&emsp;cancellationTime||string||
|&emsp;&emsp;&emsp;&emsp;cancellationReason||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||
|&emsp;&emsp;&emsp;&emsp;updateTime||string||
|&emsp;&emsp;&emsp;&emsp;patientUserName||string||
|&emsp;&emsp;&emsp;&emsp;patientPhone||string||
|&emsp;&emsp;&emsp;&emsp;patientName||string||
|&emsp;&emsp;&emsp;&emsp;scheduleDate||string||
|&emsp;&emsp;&emsp;&emsp;slotType||integer||
|&emsp;&emsp;&emsp;&emsp;slotPeriod||integer||
|&emsp;&emsp;&emsp;&emsp;doctorName||string||
|&emsp;&emsp;&emsp;&emsp;doctorTitle||string||
|&emsp;&emsp;&emsp;&emsp;departmentName||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"appointmentId": 0,
				"appointmentNo": "",
				"patientUserId": 0,
				"scheduleId": 0,
				"visitNo": 0,
				"status": 0,
				"originalFee": 0,
				"actualFee": 0,
				"paymentTime": "",
				"cancellationTime": "",
				"cancellationReason": "",
				"createTime": "",
				"updateTime": "",
				"patientUserName": "",
				"patientPhone": "",
				"patientName": "",
				"scheduleDate": "",
				"slotType": 0,
				"slotPeriod": 0,
				"doctorName": "",
				"doctorTitle": "",
				"departmentName": ""
			}
		]
	}
}
```


## 批量删除患者档案('DEL_PATIENT')


**接口地址**:`/patient-profiles/batch`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量删除患者档案</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|integers|integer|body|true|array||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 获取所有患者档案


**接口地址**:`/patient-profiles/getAllPatient`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有患者的详细档案信息（已废弃）</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListPatientProfileDetailDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|PatientProfileDetailDTO|
|&emsp;&emsp;patientProfileId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;identityType||integer(int32)||
|&emsp;&emsp;studentTeacherId||string||
|&emsp;&emsp;emergencyContact||string||
|&emsp;&emsp;emergencyContactPhone||string||
|&emsp;&emsp;medicalHistory||string||
|&emsp;&emsp;allergyHistory||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"patientProfileId": 0,
			"userId": 0,
			"userName": "",
			"name": "",
			"identityType": 0,
			"studentTeacherId": "",
			"emergencyContact": "",
			"emergencyContactPhone": "",
			"medicalHistory": "",
			"allergyHistory": "",
			"createTime": "",
			"updateTime": ""
		}
	]
}
```


## 患者更新自己的档案


**接口地址**:`/patient-profiles/self`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>患者更新自己的档案信息</p>



**请求示例**:


```javascript
{
  "emergencyContact": "",
  "emergencyContactPhone": "",
  "medicalHistory": "",
  "allergyHistory": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|patientProfileUpdateSelfDTO|PatientProfileUpdateSelfDTO|body|true|PatientProfileUpdateSelfDTO|PatientProfileUpdateSelfDTO|
|&emsp;&emsp;emergencyContact|||false|string||
|&emsp;&emsp;emergencyContactPhone|||false|string||
|&emsp;&emsp;medicalHistory|||false|string||
|&emsp;&emsp;allergyHistory|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


# 角色接口


## 获取所有角色


**接口地址**:`/roles`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有角色</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleGetRequestDTO||query|true|RoleGetRequestDTO|RoleGetRequestDTO|
|&emsp;&emsp;roleName|||false|string||
|&emsp;&emsp;type|||false|integer(int32)||
|&emsp;&emsp;roleId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListRoleListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|RoleListDTO|
|&emsp;&emsp;roleId||integer(int64)||
|&emsp;&emsp;roleName||string||
|&emsp;&emsp;roleInfo||string||
|&emsp;&emsp;type||integer(int32)||
|&emsp;&emsp;isDefault||integer(int32)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"roleId": 0,
			"roleName": "",
			"roleInfo": "",
			"type": 0,
			"isDefault": 0
		}
	]
}
```


## 创建新角色('MASTER_ROLE')


**接口地址**:`/roles`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建新角色</p>



**请求示例**:


```javascript
{
  "roleName": "",
  "roleInfo": "",
  "type": 0,
  "permissionList": []
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleCreateDTO|RoleCreateDTO|body|true|RoleCreateDTO|RoleCreateDTO|
|&emsp;&emsp;roleName|||true|string||
|&emsp;&emsp;roleInfo|||true|string||
|&emsp;&emsp;type|||true|integer(int32)||
|&emsp;&emsp;permissionList|||true|array|integer(int64)|


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultRoleListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||RoleListDTO|RoleListDTO|
|&emsp;&emsp;roleId||integer(int64)||
|&emsp;&emsp;roleName||string||
|&emsp;&emsp;roleInfo||string||
|&emsp;&emsp;type||integer(int32)||
|&emsp;&emsp;isDefault||integer(int32)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"roleId": 0,
		"roleName": "",
		"roleInfo": "",
		"type": 0,
		"isDefault": 0
	}
}
```


## 更新角色信息('MASTER_ROLE')


**接口地址**:`/roles/{roleId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新角色信息</p>



**请求示例**:


```javascript
{
  "roleName": "",
  "roleInfo": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleId||path|true|integer(int64)||
|roleUpdateDTO|RoleUpdateDTO|body|true|RoleUpdateDTO|RoleUpdateDTO|
|&emsp;&emsp;roleName|||false|string||
|&emsp;&emsp;roleInfo|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 删除角色('MASTER_ROLE')


**接口地址**:`/roles/{roleId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除角色</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 获取角色的权限信息('MASTER_ROLE')


**接口地址**:`/roles/{roleId}/permissions`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取角色的权限信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListPermissionListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|PermissionListDTO|
|&emsp;&emsp;name||string||
|&emsp;&emsp;permissionId||integer(int64)||
|&emsp;&emsp;keyValue|可用值:PERSON_MG_PAGE,ADD_MB,DEL_MB,ALT_MB,CHECK_MB,IMPORT_MB,MASTER_ROLE,LOG_PAGE,DEPART_MG_PAGE,ADD_DEPART,DEL_DEPART,ALT_DEPART,CHECK_DEPART,ADD_DOCTOR,ALT_DOCTOR,DEL_DOCTOR,CHECK_DOCTOR,ADD_PATIENT,ALT_PATIENT,DEL_PATIENT,CHECK_PATIENT,ADD_SCHEDULE,ALT_SCHEDULE,DEL_SCHEDULE,CHECK_SCHEDULE,CHECK_APPOINTMENT,CHECK_RULE,ALT_RULE,DOCTOR_WORK_PAGE|string||
|&emsp;&emsp;type||integer(int32)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"name": "",
			"permissionId": 0,
			"keyValue": "",
			"type": 0
		}
	]
}
```


## 更新角色的权限信息('MASTER_ROLE')


**接口地址**:`/roles/{roleId}/permissions`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新角色的权限信息</p>



**请求示例**:


```javascript
[
  {
    "permissionId": 0,
    "isOwn": 0
  }
]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleId||path|true|integer(int64)||
|permissionUpdateDTOs|PermissionUpdateDTO|body|true|array|PermissionUpdateDTO|
|&emsp;&emsp;permissionId|||true|integer(int64)||
|&emsp;&emsp;isOwn|||true|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 获取所有权限信息('MASTER_ROLE')


**接口地址**:`/roles/permissions`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有权限信息</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListPermissionListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|PermissionListDTO|
|&emsp;&emsp;name||string||
|&emsp;&emsp;permissionId||integer(int64)||
|&emsp;&emsp;keyValue|可用值:PERSON_MG_PAGE,ADD_MB,DEL_MB,ALT_MB,CHECK_MB,IMPORT_MB,MASTER_ROLE,LOG_PAGE,DEPART_MG_PAGE,ADD_DEPART,DEL_DEPART,ALT_DEPART,CHECK_DEPART,ADD_DOCTOR,ALT_DOCTOR,DEL_DOCTOR,CHECK_DOCTOR,ADD_PATIENT,ALT_PATIENT,DEL_PATIENT,CHECK_PATIENT,ADD_SCHEDULE,ALT_SCHEDULE,DEL_SCHEDULE,CHECK_SCHEDULE,CHECK_APPOINTMENT,CHECK_RULE,ALT_RULE,DOCTOR_WORK_PAGE|string||
|&emsp;&emsp;type||integer(int32)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"name": "",
			"permissionId": 0,
			"keyValue": "",
			"type": 0
		}
	]
}
```


# 科室接口


## 获取所有科室


**接口地址**:`/departments`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有科室</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|requestDTO||query|true|DepartmentGetRequestDTO|DepartmentGetRequestDTO|
|&emsp;&emsp;pageNum|||false|integer(int32)||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;name|||true|string||
|&emsp;&emsp;parentId|||true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTODepartmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTODepartmentListDTO|PageDTODepartmentListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|DepartmentListDTO|
|&emsp;&emsp;&emsp;&emsp;departmentId||integer||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;parentId||integer||
|&emsp;&emsp;&emsp;&emsp;description||string||
|&emsp;&emsp;&emsp;&emsp;location||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"departmentId": 0,
				"name": "",
				"parentId": 0,
				"description": "",
				"location": "",
				"createTime": ""
			}
		]
	}
}
```


## 创建科室('ADD_DEPART')


**接口地址**:`/departments`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建科室</p>



**请求示例**:


```javascript
{
  "name": "",
  "parentId": 0,
  "description": "",
  "location": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|departmentCreateDTO|DepartmentCreateDTO|body|true|DepartmentCreateDTO|DepartmentCreateDTO|
|&emsp;&emsp;name|||true|string||
|&emsp;&emsp;parentId|||true|integer(int64)||
|&emsp;&emsp;description|||true|string||
|&emsp;&emsp;location|||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultDepartmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||DepartmentListDTO|DepartmentListDTO|
|&emsp;&emsp;departmentId||integer(int64)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;parentId||integer(int64)||
|&emsp;&emsp;description||string||
|&emsp;&emsp;location||string||
|&emsp;&emsp;createTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"departmentId": 0,
		"name": "",
		"parentId": 0,
		"description": "",
		"location": "",
		"createTime": ""
	}
}
```


## 获取科室详情


**接口地址**:`/departments/{departmentId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取科室详情</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|departmentId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultDepartmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||DepartmentListDTO|DepartmentListDTO|
|&emsp;&emsp;departmentId||integer(int64)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;parentId||integer(int64)||
|&emsp;&emsp;description||string||
|&emsp;&emsp;location||string||
|&emsp;&emsp;createTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"departmentId": 0,
		"name": "",
		"parentId": 0,
		"description": "",
		"location": "",
		"createTime": ""
	}
}
```


## 更新科室信息('ALT_DEPART')


**接口地址**:`/departments/{departmentId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新科室信息</p>



**请求示例**:


```javascript
{
  "name": "",
  "parentId": 0,
  "description": "",
  "location": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|departmentId||path|true|integer(int64)||
|departmentUpdateDTO|DepartmentUpdateDTO|body|true|DepartmentUpdateDTO|DepartmentUpdateDTO|
|&emsp;&emsp;name|||false|string||
|&emsp;&emsp;parentId|||false|integer(int64)||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;location|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 删除科室('DEL_DEPART')


**接口地址**:`/departments/{departmentId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除科室（逻辑删除）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|departmentId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 查询科室下医生列表


**接口地址**:`/departments/{departmentId}/doctors`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查询指定科室的所有医生</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|departmentId||path|true|integer(int64)||
|requestDTO||query|true|DoctorProfileGetRequestDTO|DoctorProfileGetRequestDTO|
|&emsp;&emsp;pageNum|||false|integer(int32)||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;departmentId|||false|integer(int64)||
|&emsp;&emsp;title|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTODoctorProfileListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTODoctorProfileListDTO|PageDTODoctorProfileListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|DoctorProfileListDTO|
|&emsp;&emsp;&emsp;&emsp;doctorProfileId||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;departmentId||integer||
|&emsp;&emsp;&emsp;&emsp;departmentName||string||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;specialty||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"doctorProfileId": 0,
				"userId": 0,
				"userName": "",
				"name": "",
				"departmentId": 0,
				"departmentName": "",
				"title": "",
				"specialty": "",
				"createTime": ""
			}
		]
	}
}
```


## 批量删除科室('DEL_DEPART')


**接口地址**:`/departments/batch`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量删除科室</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|integers|integer|body|true|array||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


# 排班接口


## 获取所有排班


**接口地址**:`/schedules`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有排班</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|requestDTO||query|true|ScheduleGetRequestDTO|ScheduleGetRequestDTO|
|&emsp;&emsp;pageNum|||false|integer(int32)||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;doctorUserId|||false|integer(int64)||
|&emsp;&emsp;scheduleStartDate|||false|string(date)||
|&emsp;&emsp;scheduleEndDate|||false|string(date)||
|&emsp;&emsp;slotType|||false|integer(int32)||
|&emsp;&emsp;slotPeriod|||false|integer(int32)||
|&emsp;&emsp;status|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTOScheduleListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTOScheduleListDTO|PageDTOScheduleListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|ScheduleListDTO|
|&emsp;&emsp;&emsp;&emsp;scheduleId||integer||
|&emsp;&emsp;&emsp;&emsp;doctorUserId||integer||
|&emsp;&emsp;&emsp;&emsp;scheduleDate||string||
|&emsp;&emsp;&emsp;&emsp;slotType||integer||
|&emsp;&emsp;&emsp;&emsp;slotPeriod||integer||
|&emsp;&emsp;&emsp;&emsp;totalSlots||integer||
|&emsp;&emsp;&emsp;&emsp;availableSlots||integer||
|&emsp;&emsp;&emsp;&emsp;fee||number||
|&emsp;&emsp;&emsp;&emsp;status||integer||
|&emsp;&emsp;&emsp;&emsp;createTime||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"scheduleId": 0,
				"doctorUserId": 0,
				"scheduleDate": "",
				"slotType": 0,
				"slotPeriod": 0,
				"totalSlots": 0,
				"availableSlots": 0,
				"fee": 0,
				"status": 0,
				"createTime": ""
			}
		]
	}
}
```


## 创建排班('ADD_SCHEDULE')


**接口地址**:`/schedules`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建排班</p>



**请求示例**:


```javascript
{
  "doctorUserId": 0,
  "scheduleDate": "",
  "slotType": 0,
  "slotPeriod": 0,
  "totalSlots": 0,
  "fee": 0,
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|scheduleCreateDTO|ScheduleCreateDTO|body|true|ScheduleCreateDTO|ScheduleCreateDTO|
|&emsp;&emsp;doctorUserId|||true|integer(int64)||
|&emsp;&emsp;scheduleDate|||true|string(date)||
|&emsp;&emsp;slotType|||true|integer(int32)||
|&emsp;&emsp;slotPeriod|||true|integer(int32)||
|&emsp;&emsp;totalSlots|||true|integer(int32)||
|&emsp;&emsp;fee|||true|number||
|&emsp;&emsp;status|||true|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultScheduleListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||ScheduleListDTO|ScheduleListDTO|
|&emsp;&emsp;scheduleId||integer(int64)||
|&emsp;&emsp;doctorUserId||integer(int64)||
|&emsp;&emsp;scheduleDate||string(date)||
|&emsp;&emsp;slotType||integer(int32)||
|&emsp;&emsp;slotPeriod||integer(int32)||
|&emsp;&emsp;totalSlots||integer(int32)||
|&emsp;&emsp;availableSlots||integer(int32)||
|&emsp;&emsp;fee||number||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"scheduleId": 0,
		"doctorUserId": 0,
		"scheduleDate": "",
		"slotType": 0,
		"slotPeriod": 0,
		"totalSlots": 0,
		"availableSlots": 0,
		"fee": 0,
		"status": 0,
		"createTime": ""
	}
}
```


## 获取排班详情


**接口地址**:`/schedules/{scheduleId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取排班详情</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|scheduleId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultScheduleListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||ScheduleListDTO|ScheduleListDTO|
|&emsp;&emsp;scheduleId||integer(int64)||
|&emsp;&emsp;doctorUserId||integer(int64)||
|&emsp;&emsp;scheduleDate||string(date)||
|&emsp;&emsp;slotType||integer(int32)||
|&emsp;&emsp;slotPeriod||integer(int32)||
|&emsp;&emsp;totalSlots||integer(int32)||
|&emsp;&emsp;availableSlots||integer(int32)||
|&emsp;&emsp;fee||number||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"scheduleId": 0,
		"doctorUserId": 0,
		"scheduleDate": "",
		"slotType": 0,
		"slotPeriod": 0,
		"totalSlots": 0,
		"availableSlots": 0,
		"fee": 0,
		"status": 0,
		"createTime": ""
	}
}
```


## 更新排班信息('ALT_SCHEDULE')


**接口地址**:`/schedules/{scheduleId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新排班信息</p>



**请求示例**:


```javascript
{
  "doctorUserId": 0,
  "scheduleDate": "",
  "slotType": 0,
  "slotPeriod": 0,
  "totalSlots": 0,
  "availableSlots": 0,
  "fee": 0,
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|scheduleId||path|true|integer(int64)||
|scheduleUpdateDTO|ScheduleUpdateDTO|body|true|ScheduleUpdateDTO|ScheduleUpdateDTO|
|&emsp;&emsp;doctorUserId|||false|integer(int64)||
|&emsp;&emsp;scheduleDate|||false|string(date)||
|&emsp;&emsp;slotType|||false|integer(int32)||
|&emsp;&emsp;slotPeriod|||false|integer(int32)||
|&emsp;&emsp;totalSlots|||false|integer(int32)||
|&emsp;&emsp;availableSlots|||false|integer(int32)||
|&emsp;&emsp;fee|||false|number||
|&emsp;&emsp;status|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 删除排班('DEL_SCHEDULE')


**接口地址**:`/schedules/{scheduleId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除排班（逻辑删除）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|scheduleId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 预约排班


**接口地址**:`/schedules/{scheduleId}/appoint`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>预约排班</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|scheduleId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultAppointmentListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||AppointmentListDTO|AppointmentListDTO|
|&emsp;&emsp;appointmentId||integer(int64)||
|&emsp;&emsp;appointmentNo||string||
|&emsp;&emsp;patientUserId||integer(int64)||
|&emsp;&emsp;scheduleId||integer(int64)||
|&emsp;&emsp;visitNo||integer(int32)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;originalFee||number||
|&emsp;&emsp;actualFee||number||
|&emsp;&emsp;paymentTime||string(date-time)||
|&emsp;&emsp;cancellationTime||string(date-time)||
|&emsp;&emsp;cancellationReason||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;patientUserName||string||
|&emsp;&emsp;patientPhone||string||
|&emsp;&emsp;patientName||string||
|&emsp;&emsp;scheduleDate||string(date)||
|&emsp;&emsp;slotType||integer(int32)||
|&emsp;&emsp;slotPeriod||integer(int32)||
|&emsp;&emsp;doctorName||string||
|&emsp;&emsp;doctorTitle||string||
|&emsp;&emsp;departmentName||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"appointmentId": 0,
		"appointmentNo": "",
		"patientUserId": 0,
		"scheduleId": 0,
		"visitNo": 0,
		"status": 0,
		"originalFee": 0,
		"actualFee": 0,
		"paymentTime": "",
		"cancellationTime": "",
		"cancellationReason": "",
		"createTime": "",
		"updateTime": "",
		"patientUserName": "",
		"patientPhone": "",
		"patientName": "",
		"scheduleDate": "",
		"slotType": 0,
		"slotPeriod": 0,
		"doctorName": "",
		"doctorTitle": "",
		"departmentName": ""
	}
}
```


## 批量删除排班('DEL_SCHEDULE')


**接口地址**:`/schedules/batch`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量删除排班</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|integers|integer|body|true|array||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 复制7天前的排班('ADD_SCHEDULE')


**接口地址**:`/schedules/copy`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>复制7天前的排班</p>



**请求示例**:


```javascript
{
  "doctorUserId": 0,
  "targetDate": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|scheduleCopyDTO|ScheduleCopyDTO|body|true|ScheduleCopyDTO|ScheduleCopyDTO|
|&emsp;&emsp;doctorUserId|||true|integer(int64)||
|&emsp;&emsp;targetDate|||true|string(date)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


# 日志接口


## 查找日志('LOG_PAGE')


**接口地址**:`/logs`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查找日志</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|logGetRequestDTO||query|true|LogGetRequestDTO|LogGetRequestDTO|
|&emsp;&emsp;userName|||false|string||
|&emsp;&emsp;nickname|||false|string||
|&emsp;&emsp;roleName|||false|string||
|&emsp;&emsp;ip|||false|string||
|&emsp;&emsp;operation|||false|string||
|&emsp;&emsp;pageNum|||false|integer(int64)||
|&emsp;&emsp;pageSize|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTOLogListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTOLogListDTO|PageDTOLogListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|LogListDTO|
|&emsp;&emsp;&emsp;&emsp;logId||integer||
|&emsp;&emsp;&emsp;&emsp;operation||string||
|&emsp;&emsp;&emsp;&emsp;userId||string||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;nickname||string||
|&emsp;&emsp;&emsp;&emsp;ip||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"logId": 0,
				"operation": "",
				"userId": "",
				"userName": "",
				"nickname": "",
				"ip": "",
				"createTime": ""
			}
		]
	}
}
```


# 通用功能相关接口


## 文件上传


**接口地址**:`/common/upload`


**请求方式**:`POST`


**请求数据类型**:`multipart/form-data`


**响应数据类型**:`*/*`


**接口描述**:<p>文件上传</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|file||query|true|file||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


# 医生档案接口


## 查询医生档案列表('CHECK_DOCTOR')


**接口地址**:`/doctor-profiles`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询医生档案列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|requestDTO||query|true|DoctorProfileGetRequestDTO|DoctorProfileGetRequestDTO|
|&emsp;&emsp;pageNum|||false|integer(int32)||
|&emsp;&emsp;pageSize|||false|integer(int32)||
|&emsp;&emsp;departmentId|||false|integer(int64)||
|&emsp;&emsp;title|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTODoctorProfileListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTODoctorProfileListDTO|PageDTODoctorProfileListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|DoctorProfileListDTO|
|&emsp;&emsp;&emsp;&emsp;doctorProfileId||integer||
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;departmentId||integer||
|&emsp;&emsp;&emsp;&emsp;departmentName||string||
|&emsp;&emsp;&emsp;&emsp;title||string||
|&emsp;&emsp;&emsp;&emsp;specialty||string||
|&emsp;&emsp;&emsp;&emsp;createTime||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"doctorProfileId": 0,
				"userId": 0,
				"userName": "",
				"name": "",
				"departmentId": 0,
				"departmentName": "",
				"title": "",
				"specialty": "",
				"createTime": ""
			}
		]
	}
}
```


## 创建医生档案('ADD_DOCTOR')


**接口地址**:`/doctor-profiles`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建医生档案</p>



**请求示例**:


```javascript
{
  "userId": 0,
  "departmentId": 0,
  "title": "",
  "specialty": "",
  "bio": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|doctorProfileCreateDTO|DoctorProfileCreateDTO|body|true|DoctorProfileCreateDTO|DoctorProfileCreateDTO|
|&emsp;&emsp;userId|||true|integer(int64)||
|&emsp;&emsp;departmentId|||true|integer(int64)||
|&emsp;&emsp;title|||true|string||
|&emsp;&emsp;specialty|||true|string||
|&emsp;&emsp;bio|||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultDoctorProfileListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||DoctorProfileListDTO|DoctorProfileListDTO|
|&emsp;&emsp;doctorProfileId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;departmentId||integer(int64)||
|&emsp;&emsp;departmentName||string||
|&emsp;&emsp;title||string||
|&emsp;&emsp;specialty||string||
|&emsp;&emsp;createTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"doctorProfileId": 0,
		"userId": 0,
		"userName": "",
		"name": "",
		"departmentId": 0,
		"departmentName": "",
		"title": "",
		"specialty": "",
		"createTime": ""
	}
}
```


## 删除医生档案('DEL_DOCTOR')


**接口地址**:`/doctor-profiles/{doctorProfileId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除医生档案</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|doctorProfileId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 获取医生档案详情(‘CHECK_DOCTOR’)


**接口地址**:`/doctor-profiles/{userId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取医生档案详情</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultDoctorProfileDetailDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||DoctorProfileDetailDTO|DoctorProfileDetailDTO|
|&emsp;&emsp;doctorProfileId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;departmentId||integer(int64)||
|&emsp;&emsp;departmentName||string||
|&emsp;&emsp;title||string||
|&emsp;&emsp;specialty||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"doctorProfileId": 0,
		"userId": 0,
		"userName": "",
		"name": "",
		"departmentId": 0,
		"departmentName": "",
		"title": "",
		"specialty": "",
		"bio": "",
		"createTime": "",
		"updateTime": ""
	}
}
```


## 更新医生档案('ALT_DOCTOR')


**接口地址**:`/doctor-profiles/{userId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新医生档案信息</p>



**请求示例**:


```javascript
{
  "departmentId": 0,
  "title": "",
  "specialty": "",
  "bio": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||
|doctorProfileUpdateDTO|DoctorProfileUpdateDTO|body|true|DoctorProfileUpdateDTO|DoctorProfileUpdateDTO|
|&emsp;&emsp;departmentId|||false|integer(int64)||
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;specialty|||false|string||
|&emsp;&emsp;bio|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 批量删除医生档案('DEL_DOCTOR')


**接口地址**:`/doctor-profiles/batch`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量删除医生档案</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|integers|integer|body|true|array||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 获取所有医生档案


**接口地址**:`/doctor-profiles/getAllDoctor`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有医生档案信息（已废弃）</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListDoctorProfileDetailDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|DoctorProfileDetailDTO|
|&emsp;&emsp;doctorProfileId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;userName||string||
|&emsp;&emsp;name||string||
|&emsp;&emsp;departmentId||integer(int64)||
|&emsp;&emsp;departmentName||string||
|&emsp;&emsp;title||string||
|&emsp;&emsp;specialty||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"doctorProfileId": 0,
			"userId": 0,
			"userName": "",
			"name": "",
			"departmentId": 0,
			"departmentName": "",
			"title": "",
			"specialty": "",
			"bio": "",
			"createTime": "",
			"updateTime": ""
		}
	]
}
```


## 医生更新自己的档案


**接口地址**:`/doctor-profiles/self`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>医生更新自己的档案信息</p>



**请求示例**:


```javascript
{
  "specialty": "",
  "bio": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|doctorProfileUpdateSelfDTO|DoctorProfileUpdateSelfDTO|body|true|DoctorProfileUpdateSelfDTO|DoctorProfileUpdateSelfDTO|
|&emsp;&emsp;specialty|||false|string||
|&emsp;&emsp;bio|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


# 用户登录注册相关接口


## 用户登录


**接口地址**:`/auth/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "userName": "",
  "password": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userLoginDTO|UserLoginDTO|body|true|UserLoginDTO|UserLoginDTO|
|&emsp;&emsp;userName|||true|string||
|&emsp;&emsp;password|||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 用户退出


**接口地址**:`/auth/logout/{userId}`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 用户发起注册


**接口地址**:`/auth/register`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>用户发起注册</p>



**请求示例**:


```javascript
{
  "userName": "",
  "password": "",
  "checkPassword": "",
  "name": "",
  "phone": "",
  "email": "",
  "code": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userRegisterDTO|UserRegisterDTO|body|true|UserRegisterDTO|UserRegisterDTO|
|&emsp;&emsp;userName|||true|string||
|&emsp;&emsp;password|||true|string||
|&emsp;&emsp;checkPassword|||true|string||
|&emsp;&emsp;name|||true|string||
|&emsp;&emsp;phone|||false|string||
|&emsp;&emsp;email|||true|string||
|&emsp;&emsp;code|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 用户注册验证


**接口地址**:`/auth/register/verify`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>用户注册验证</p>



**请求示例**:


```javascript
{
  "code": "",
  "email": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userEmailVerifyDTO|UserEmailVerifyDTO|body|true|UserEmailVerifyDTO|UserEmailVerifyDTO|
|&emsp;&emsp;code|||false|string||
|&emsp;&emsp;email|||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


# 用户接口


## 获取所有用户的信息


**接口地址**:`/users`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有用户的信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userGetRequestDTO||query|true|UserGetRequestDTO|UserGetRequestDTO|
|&emsp;&emsp;userName|||false|string||
|&emsp;&emsp;nickname|||false|string||
|&emsp;&emsp;roleName|||false|string||
|&emsp;&emsp;pageNum|||false|integer(int64)||
|&emsp;&emsp;pageSize|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageDTOUserListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||PageDTOUserListDTO|PageDTOUserListDTO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list||array|UserListDTO|
|&emsp;&emsp;&emsp;&emsp;userId||integer||
|&emsp;&emsp;&emsp;&emsp;userName||string||
|&emsp;&emsp;&emsp;&emsp;name||string||
|&emsp;&emsp;&emsp;&emsp;roleId||string||
|&emsp;&emsp;&emsp;&emsp;roleName||string||
|&emsp;&emsp;&emsp;&emsp;stateId||integer||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"total": 0,
		"list": [
			{
				"userId": 0,
				"userName": "",
				"name": "",
				"roleId": "",
				"roleName": "",
				"stateId": 0
			}
		]
	}
}
```


## 根据个人信息


**接口地址**:`/users/{userId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据个人信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 修改用户信息('ALT_MB') || isSelf


**接口地址**:`/users/{userId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改用户信息</p>



**请求示例**:


```javascript
{
  "phone": "",
  "info": "",
  "nickname": "",
  "sex": "",
  "age": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||
|userUpdateDTO|UserUpdateDTO|body|true|UserUpdateDTO|UserUpdateDTO|
|&emsp;&emsp;phone|||false|string||
|&emsp;&emsp;info|||false|string||
|&emsp;&emsp;nickname|||false|string||
|&emsp;&emsp;sex|||false|string||
|&emsp;&emsp;age|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 删除用户('DEL_USER')


**接口地址**:`/users/{userId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除用户（逻辑删除）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 设置用户角色('ALT_MB')


**接口地址**:`/users/{userId}/role`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>设置用户角色</p>



**请求示例**:


```javascript
{
  "roleId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|integer(int64)||
|roleUserUpdateDTO|RoleUserUpdateDTO|body|true|RoleUserUpdateDTO|RoleUserUpdateDTO|
|&emsp;&emsp;roleId|||true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 批量删除用户('DEL_USER')


**接口地址**:`/users/batch`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量删除用户（逻辑删除）</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|integers|integer|body|true|array||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": ""
}
```


## 申请重新绑定邮箱


**接口地址**:`/users/email`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>申请重新绑定邮箱</p>



**请求示例**:


```javascript
{
  "code": "",
  "email": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userEmailVerifyDTO|UserEmailVerifyDTO|body|true|UserEmailVerifyDTO|UserEmailVerifyDTO|
|&emsp;&emsp;code|||false|string||
|&emsp;&emsp;email|||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 绑定邮箱验证


**接口地址**:`/users/email/verify`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>绑定邮箱验证</p>



**请求示例**:


```javascript
{
  "code": "",
  "email": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userEmailVerifyDTO|UserEmailVerifyDTO|body|true|UserEmailVerifyDTO|UserEmailVerifyDTO|
|&emsp;&emsp;code|||false|string||
|&emsp;&emsp;email|||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 修改密码


**接口地址**:`/users/password`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "oldPassword": "",
  "newPassword": "",
  "checkPassword": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userPasswordDTO|UserPasswordDTO|body|true|UserPasswordDTO|UserPasswordDTO|
|&emsp;&emsp;oldPassword|||false|string||
|&emsp;&emsp;newPassword|||true|string||
|&emsp;&emsp;checkPassword|||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


## 获取权限信息


**接口地址**:`/users/permissions`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取权限信息</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Result|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {}
}
```


# 运营规则接口


## 查询运营规则列表


**接口地址**:`/rules`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查询运营规则列表（CHECK_RULE）</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListRuleListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|RuleListDTO|
|&emsp;&emsp;code||integer(int32)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;key||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;type|可用值:BOOKING,CANCEL,WAITING_LIST,PUNISH,EXTRA|string||
|&emsp;&emsp;value||integer(int32)||
|&emsp;&emsp;defaultValue||integer(int32)||
|&emsp;&emsp;enabled||integer(int32)||
|&emsp;&emsp;minValue||integer(int32)||
|&emsp;&emsp;maxValue||integer(int32)||
|&emsp;&emsp;updateTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"code": 0,
			"name": "",
			"key": "",
			"description": "",
			"type": "",
			"value": 0,
			"defaultValue": 0,
			"enabled": 0,
			"minValue": 0,
			"maxValue": 0,
			"updateTime": ""
		}
	]
}
```


## 更新运营规则


**接口地址**:`/rules/{code}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>根据配置代号更新运营规则（ALT_RULE）</p>



**请求示例**:


```javascript
{
  "value": 0,
  "enabled": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|code||path|true|integer(int32)||
|ruleUpdateRequest|RuleUpdateRequest|body|true|RuleUpdateRequest|RuleUpdateRequest|
|&emsp;&emsp;value|||false|integer(int32)||
|&emsp;&emsp;enabled|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultRuleListDTO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||RuleListDTO|RuleListDTO|
|&emsp;&emsp;code||integer(int32)||
|&emsp;&emsp;name||string||
|&emsp;&emsp;key||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;type|可用值:BOOKING,CANCEL,WAITING_LIST,PUNISH,EXTRA|string||
|&emsp;&emsp;value||integer(int32)||
|&emsp;&emsp;defaultValue||integer(int32)||
|&emsp;&emsp;enabled||integer(int32)||
|&emsp;&emsp;minValue||integer(int32)||
|&emsp;&emsp;maxValue||integer(int32)||
|&emsp;&emsp;updateTime||string(date-time)||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"code": 0,
		"name": "",
		"key": "",
		"description": "",
		"type": "",
		"value": 0,
		"defaultValue": 0,
		"enabled": 0,
		"minValue": 0,
		"maxValue": 0,
		"updateTime": ""
	}
}
```