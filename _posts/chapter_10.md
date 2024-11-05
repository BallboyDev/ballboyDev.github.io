# 윈도우 함수
## 윈도우 함수 구문
~~~sql
SELECT ANALYTIC_FUNCTION(arguments) OVER([PARTITION BY 컬럼], [ORDER BY 컬럼], [WINDOWING 절 (ROWS | RANGE BETWEEN)])
    FROM TABLENAME;
~~~

|함수|설명|
|--:|:--|
|ANALYTIC FUNCTION|분석함수명 (입력인자)|
|OVER|분석 함수임을 나태내는 키워드|
|PARTITION BY|계산 대상 그룹 결정|
|ORDER BY|대상 그룹에 대한 정렬 수행|
|WINDOWING 절|분석 함수의 계산 대상 범위 지정|

- ORDER BY 절에 종속적임
- 기본 생략 구분 : 정렬된 결과의 처음부터 현재행 까지[RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW]

## 윈도우 함수
- BUSINESS 분야에서 자중 행하여지는 여러 가지 형태의 분석에 유용하게 활용될 수 있는 함수
- 각 WINDOW 별 집합 연산을 수행한 결과를 RETURN 하는 함수
- JOIN 이나 프로그램의 OVER HEAD를 줄임
- 간결한 SQL로 복잡한 분석작업 수행 가능
- 이해 및 활용이 용이함
- 기존에 사용하던 집계 함수와 WINDOW 함수 전용으로 만들어진 기능도 있음
- 다른 함수와는 달리 중첩(NEST)해서 사용할 수 없지만, 서브쿼리에서 사용이 가능함

## 윈도우 함수 처리 단계
- 대상 집함을 ANALYTIC FUNCTION이 적용되어야 할 각 GROUP으로 나눔(PARTITION BY절 지정된 항목으로 PARTITIONING)
- 윈도우 함수에 지정한 ORDER BY절에 ㅈ기준 자료를 정렬함
- POINTER와 OFF-SET 개념을 적용하여 ROW간에 필요한 계산을 수행함

## 윈도우 함수 종류
1. RANK
    - 각 로우(ROW)마다 순위를 매겨주는 함수
    - RATITION 내에서 ORDER BY 절에 명시된 대로 정렬한 후 순위 부여
    - 1부터 시작하여 동일한 값은 동일한 순위를 가지며, 동일한 순위의 수만큼 다음 순위는 건너뜀

2. DENSE_RANK
    - DENSE_RANK()는 RANK()와 유사한 함수임
    - ORDER BY 절에 사용된 컬럼이나 표현식에 대하여 순위를 부여하는데 RANK()와 달리 동일 순위 다음의 순위는 동일 수와 상관없이 1 증가된 값을 돌려줌

3. ROW_NUMBER
    - ROW_NUMBER()는 각 PARTITION내에서 ORDER BY절에 의해 정렬된 순서로 유일한 값을 돌려주는 함수
    - ROWNUM과 혼돈하지 않도록 함

4. NTILE
    - PARTITION을 BUCKET 이라 불리는 그룹별로 나누고 PARTITION내의 각 ROW등을 BUCKET에 배치하는 함수
    - 각 BUCKET에는 동일한 수의 ROW가 배치됨
    - 예를 들어 PARTITION내에 100개의 ROW를 가지고 있고 4개의 BUCKET으로 나누는 NTILE(4)를 사용하면 1개의 BUCKET당 25개의 ROW가 배정됨
    - AKSDIR 103개의 ROW에 대하여 NTILE(5)를 적용하면 첫번째 BUCKET부터 세번째 까지는 21개의 ROW가, 나머지는 20개의 ROW가 배치됨

5. WINDOW AGGREGATE FAMILY
    - 윈도우를 근간으로 하여 각각의 로우들에 대한 집계 값을 반환함

6. WINDOW 절 사용
    - ROWS옵션을 사용해 윈도우 함수 계산 범위를 지정함

7. LAG
    - 파티션 내에에서 OFFSET에 지정된 값(DEFAULT = 1)만큼 상대적으로 상위에 위치한 로우(ROW)를 참조하기 위해 사용됨
    (오름차순의 경우 기준 로우의 정렬 컬럼 값보다 작은 값을 갖는 로우, 
    내림차순의 경우 기준 로우의 정렬 컬럼 값보다 큰 값을 갖는 로우)

8. LEAD
    - LEAD()는 LAG() 유사한 함수임
    - OFFSET에 지정된 값(DEFAULT = 1)만큼 상대적으로 하위에 위치한 로우(ROW)를 참조하기 위해 사용됨

### 정렬된 데이터 누계 구하기
~~~SQL
SELECT ENAME, SAL, SUM(SAL) OVER(ORDER BY ENAME ROWS UNBOUNDED PRECEDING)
    FROM EMP;
~~~

## 윈도우 함수 정리
### 윈도우 함수 동작 원리
- SELECT 문 수행 결과를 대상으로 윈도우 함수가 적용된다 
- PARTITION BY절을 사용해 윈도우 함수 적용 대상을 나누어서 처리할 수 있다.
- WINDOW 절(ROWS 옵션)을 사용하여 계산 범위를 제한할 수 있다.

### 윈도우 함수 종류
- 순위를 부여하기 위해 RANK, DENSE_RANK함수를 사용한다.
- SUM, AVG, MIN, MAX, COUNT도 윈도우 함수로 사용할 수 있다.
- 앞줄 자료를 가져오기 위해 LAG함수를, 뒷줄 자료를 가져오기 위해 LEAD함수를 사용한다.