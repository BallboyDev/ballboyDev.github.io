# 조인 문장 및 집합 연산자
## ANSI SQL 조인 문장
~~~SQL
SELECT TABLE1.COLUMN, TABLE2.COLUMN
    FROM TABLE1
    [CROSS JOIN TABLE2] |
    [NATURAL JOIN TABLE2] |
    [JOIN TABLE2 USING (COLUMN_NAME)] | 
    [JOIN TABLE2
        ON (TABLE1.COLUMN_NAME = TABLE2.COLUMN_NAME)] |
    [LEFT | RIGHT | FULL OUTER JOIN TABLE2
        ON (TABLE1.COLUMN_NAME = TABLE2.COLUMN_NAME)];
~~~

## CROSS JOIN
- 두 테이블  상호간의 조합을 생성함
- 두 테이블 사이의 카티시안 곱과 결과가 같음

## NATURAL JOIN
- 두 테이블에서 동일한 이름을 가진 모든 컬럼을 기준으로 조인함
- 두 테이블의 일치하는 모든 컬럼을 대상으로 같은 값을 가진 행을 선택함
- 조인 조건으로 사용한 컬럼 앞에는 테이블 이름이나 테이블 별칭을 명시할 수 없음
- WHERE절을 사용하여 조건을 추가할 수 있음

## JOIN-USING
- NATURAL JOIN은 이름과 데이터 유형이 일치하는 모든 컬럼을 사용하여 테이블을 조인하지만 USING 절을 사용하면 특정 컬럼을 지정할 수 있음
- USING 절에 참조되는 컬럼은 SQL문 어디에서도 테이블 이름이나 별칭을 가질 수 없음
- NATURAL JOIN 과 USING절은 서로 배타적으로 사용함

## JOIN - ON
- NATURAL JOIN의 조건은 기본적으로 같은 이름을 가진 모든 컬럼의 등가(=) 조인임
- 컬럼 이름이 다르거나 조인 조건이 "="이 아닌 경우 ON절을 사용함
- 조인 조건이 다른 검색 조건과 분리됨

## OUTER JOIN
|구문|설명|
|:--|:--|
|INNER JOIN|- ANSI JOIN에서 두 테이블을 조인하여 일치하는 열만 반환 조인|
|LEFT OUTER JOIN<br />(RIGHT OUTER JOIN)|- 두 테이블을 조인해서 내부 조인의 결과와 함께 일치하지 않는 왼쪽(오른쪽) 테이블의 행을 반환하는 조인|
|FULL OUTER JOIN|- 두 테이블을 조인해서 내부 조인의 결과와 함께 외쪽, 오른쪽 조인의 결과를 모두 반환하는 조인|

## SET 연산자
- 두 개 이상의 질의 결과를 하나의 결과로 통합

|C|D|E|
|:--|:--|:--|
|UNION|C + D + E|- 각 쿼리 결과의 합집합|
|UNION ALL|C + D + D + E|- 각 쿼리 결과의 합집하에 공통 부분을 더함|
|INTERSECT|D|- 각 쿼리 결과의 교집합|
|MINUS|C|- 각 쿼리 결과의 차집합|

### UINON 과 UNION ALL의 다른점
- 여러 개의 쿼리 결과를 UNION으로 연결하면 두 쿼리 결과에 중복되는 부분이 한 번만 검색 되고, UNION ALL 로 연결하면 모든 쿼리 결과가 중복되어 검색됨

## SET 연산자 동작
- SET 연산자를 포함하는 질의를 복합 질의라고 함
- SET 연산자는 두 개 이상의 질의 결과를 하나의 결과로 통합함
- 모든 SET 연산자는 같은 우선순위를 가짐
- SQL문장이 여러개의 SET연산자를 포함할 때 다른 순서를 명시하는 괄호가 없을 경우 데이터베이스는 왼쪽(위)에서 오른쪽(아래)로 실행함
- 사용하는 질의의 평가 순서를 명싲거으로 표현하기 위해서 괄호를 사용함

## UNION
- 열(컬럼)의 수와 데이터 타입은 두 개의 SELECT 문장에서 일치해야 함
- 열(컬럼)이름은 같을 필요 없음
- 선택되는 모든 열에 대한 연산을 하여 중복 값은 한 번만 결과에 나타남

## UNION ALL
- UNION ALL 집합 연산자 사용시 중복되는 행은 제거 되지 않음

## INTERSECT
- 두 질의에서 공통행을 리턴하기 위해 사용함
- INTERSECT 연산자 사용시 두 문장의 순서를 바꾸어도 결과는 바뀌지 않음

## MINUS
- 두 번째 질의에 의해 리턴되는 행을 제외하고 첫 번째 질의에 의해서만 리턴되는 행을 조회하기 위해 사용
- 두 문자의 순서에 따라 결과가 달라짐

## SET 연산자 지침
- SELECT 목록에 있는 표현식의 개수와 데이터 유형이 서로 일치해야함
- 첫째 질의의 열 이름이 결과에 표시됨
- UNION ALL을 제외한 다른 연산자 사용 시 중복 행이 자동으로 제거됨
- UNION ALL을 제외한 다른 연산자의 출력은 기본적으로 오름차순으로 정렬됨
- ORDER BY 절에서 사용된 열 이름이나 별칭은 첫 번째 SELECT 목록에 있어야 함
- SET 연산자는 서브쿼리에서도 사용할 수 있음
- SELECT 문장은 왼쪽(위)에서 오른쪽(아래)로 실행됨