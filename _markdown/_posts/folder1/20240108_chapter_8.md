# 일반함수
## NVL(EXP1, EXP2)
- NULL 값을 다른 값으로 바꿀 떄 사용함
- EXP1이 NULL 이면 EXP2를 반환하도 EXP1이 NULL이 아니면 EXP1을 반환함
- 모든 데이터 타입에 적용 가능하며 EXP1, EXP2의 데이터 타입을 일치 시켜야함

## NVL2(EXP1, EXP2, EXP3)
- EXP1이 NULL이 아닌 경에는 EXP2를 리턴하고, EXP1이 NULL일 경우에는 EXP3를 리턴함
- EXP1은 임의의 데이터 형을 가질 수 있으며, EXP2와 EXP3 데이터 타입을 일치시켜야 함

## NULLIF(EXP1, EXP2)
- NULLIF는 EXP1과 EXP2를 비교함
- EXP1과 EXP2가 같으면 NULL을 반환하고 EXP1과 EXP2가 같지 않으면 EXP1을 반환함
- EXP1에는 NULL을 지정할 수 없음

## COALESCE(EXP1, ... EXPn)
- COALESCE 함수는 나열된 값을 순차적으로 체크하여 NULL이 아닌 첫 번째 인수를 반환함
- 모든 인수가 NULL인 경우에는 NULL을 반환함

## DECODE(VALUE, IF1, THEN1, IF2, THEN2, ... DEFAULT)
- VALUE 값이 IF1일 경우 THEN1값으로 바꿔주고, VALUE 값이 IF2일 경우 THEN2 값으로 바꿔준다
- 일치하는 것을 발견하지 옷한 경우 DEFAULT 값을 바환함
- DEFAULT가 생략되면 오라클은 NULL을 반환함

## CASE WHEN THEN
~~~SQL
CASE WHEN 비교조건1 THEN 처리1
    WHEN 비교조건2 THEN 처리2
    ELSE 디폴트처리 END
~~~