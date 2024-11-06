# 데이터 유형
## 테이블 생성 조건
1. 테이블 생성시 컬럼을 정의할 떄 선언한 데이터 유형은 그 컬럼이 받아들일 수 있는 자료형의 유형을 규정함
    - 선언한 유형이 아닌 다른 종류의 데이터가 들어오려고 하면 데이터베이스는 에러를 발생기킴
2. 오라클에서 제공하고 있는 기본 데이터 타입의 종류는 크게 문자형, 숫자형, 날짜형으로 구분함
3. 데이터 유형과 더불어 지정한 크기도 중요한 기능을 제공함
    - 선언 당시에 지정한 데이터의 크기를 넘어선 자료가 입력되는 상황은 에러를 발생시킴

## 문자형 데이터 타입
|데이터 유형|설명|길이|
|:--|:--|:--|
|CHAR(SIZE)|- 고정 길이의 문자 데이터|- 최대 크기 2000바이트<br/>- size값 생략시 기본 값 1|
|varchar2(size)|- 가변 길이의 문자데이터|- 최대 4000바이트<br />- size 값 생략 안됨|
|CLOB|- long 타입 확장된 형태<br />- 가변길이 문자 데이터 저장|- 최대 4GB|
|LONG|- 가변 길이의 문자 데이터|- 최대 크기는 2GB|

## char VS varchar
- char(10)
    - 'happy^^^^^'
- varchar(10)
    - 'happy'

## 숫자형 데이터 타입
|데이터 유형|설명|길이|
|:--|:--|:--|
|number[(prec, scale)]|- 정수를 포함한 무돈 실수를 표현하고 저장하는데 사용<br/>- 38자리의 양수 및 음수<br/>precision: 전체 자리수 -> 생략한 경우 적용할 수 있는 최대값 38<br />- Scale: 소수점 이하 자리수 -> 생략한 경우 적용할 수 있는 값 0|- 최대 21Byte|
|BINAYR_FLOAT|- 32bit 부동 소수|- 4byte|
|BINARY_DOUBLE|- 64bit 부동 소수|- 8BYTE|

## 날짜 데이터 타입
|데이터 유형|설명|길이|
|:--|:--|:--|
|DATE|- 고정길이 날짜와 시간 데이터<br />- BC 4712년 1월 1일 부터 9999년 12월 31일까지 표현|- 7BYTE<br />- NLS_DATE_FORMAT|
|TIMESTAMP|- Millisecond 까지 표현 가능한 데이터 타입<br />- 0 ~ 9까지 가능 <br />- 기본값 6|7 ~ 11 BYTE<br />NLS_TIMESTAMP_FORMAT|
|TIMESTAMP WITH TIME ZONE|- 시간대와 함꼐 날짜와 시간 표현|- 13BYTE<br/>- NLS_TIMESTAMP_TZ_FORMAT|
|TIMESTAMP WITH LOCAL TIME ZONE|- 저장시 DB 시간대 준수<br />- 조회시 클라이언트 시간대로 표현됨|- 7~11BYTE<br />- NLS_TIMESTAMP_FORMAT|