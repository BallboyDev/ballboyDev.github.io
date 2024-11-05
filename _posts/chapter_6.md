# 날짜 연산 및 날짜 함수
## 기본 날짜 계산
- 오라클 데이터 베이스는 세기, 연도, 월, 일 시, 분, 초 형태의 내부 숫자 형식으로 날짜를 저장함
- 기본 Date Format 설정에 따라 화면에 표시됨
- 날짜 표시 Format을 변경하고 싶은 경우 다음 명령을 사용한다.
    - alter session set nls_date_format = 'yyyy-mm-dd:hh24:mi:ss';
- 날짜에 숫자를 더하거나 빼서 날짜 값을 계산할 수 있음
- 날짜형 데이터 간 뺄셈을 수항 할 수 있음

|함수|내용|
|:--|:--|
|DATE + NUMBER|- 날짜에 해당 일수를 더한 날짜를 리턴|
|DATE - NUMBER|- 날짜에 해당 일수를 뺀 날짜를 리턴|
|DATE1 - DATE2|- 두 날짜 사이의 경과 일수를 숫자로 리턴|

~~~SQL
-- 현재 날짜/시간
SELECT SYSDATE FROM DUAL;
~~~

## 날짜 함수 사용하기
|함수|내용|
|:--|:--|
|ADD_MONTHS(D1, N)|- D1날짜에 N개월을 더함|
|MONTHS_BETWEEN(D1, D2)|- D1, D2 두 날짜 간의 경과 개월 수|
|LAST_DAY|- 해당 월의 마지막 날짜를 리턴|
|ROUND|- 날짜를 년, 월 단위로 반올림|
|TRUNC|- 날짜를 년, 월 단위로 버림|

## EXTRACT
- 날짜에서 지정한 날짜 필드 값을 추출하여 반환함

## INTERVAL
- 날짜에서 지정한 날짜 필드 값을 더하거나 뺄 수 있음
- 사용 예시
    - 날짜 + (INTERVAL '1' YEAR) -> 1년 더하기
    - 날짜 + (INTERVAL '1' MONTH) -> 1개월 더하기
    - 날짜 + (INTERVAL '1' DAY) -> 1일 더하기
    - 날짜 + (INTERVAL '1' HOUR) -> 1시간 더하기
    - 날짜 + (INTERVAL '1' MINUTE) -> 1분 더하기
    - 날짜 + (INTERVAL '1' SECONT) -> 1초 더하기
    - 날짜 + (INTERVAL '1' '02:10' HOUR TO MINUTE) -> 2시간 10분 더하기
    - 날짜 + (INTERVAL '1' '01:30' MINUTE TO SECOND) -> 1분 30초 더하기