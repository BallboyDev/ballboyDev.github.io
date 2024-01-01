import React, { useState } from 'react'
import { Button, ButtonGroup } from "reactstrap"
import Editor from '@monaco-editor/react'
import './styles.scss'

const Default = () => {

    // 1 : transform / 2: repeat
    const [selection, setSelection] = useState(1)

    const [form, setForm] = useState('')
    const [value, setValue] = useState('')
    const [result, setResult] = useState('')

    const change = () => {
        const func = [
            () => {
                // transform
                let index = 0
                let formData = form.replace(/[\[](.*?)[\]][\[](.*?)[\]]==>(.*?): /gi, '')
                let valueData = value.replace(/[\[](.*?)[\]][\[](.*?)[\]]==>(.*?): /gi, '').split(',').map((v1, i) => {

                    if ((v1.indexOf('(') > -1 && v1.indexOf(')') > -1) || (v1.indexOf('{') > -1 && v1.indexOf('}') > -1)) {
                        let colName = ''; let colType = ''; let value = '';
                        value = v1
                        if (v1.indexOf('(') > -1 && v1.indexOf(')') > -1) {
                            let type = v1.match(/[(](.*?)[)]/gi)
                            colType = type[type.length - 1]
                            value = value.replace(colType, '')
                        }
                        if (v1.indexOf('{') > -1 && v1.indexOf('}') > -1) {
                            let name = v1.match(/[{](.*?)[}]/gi)
                            colName = name[name.length - 1]
                            value = value.replace(colName, '')
                        }

                        return {
                            colName: colName.replace(/[{]|[}]/gi, '').trim() || `colName${i}`,
                            colType: colType.replace(/[(]|[)]/gi, '').trim() || `colType${i}`,
                            value: value.trim()
                        }
                    } else {
                        return {
                            colName: `colName${i}`,
                            colType: `colType${i}`,
                            value: v1.trim()
                        }
                    }

                }).filter((v) => { return (v || '') !== '' })

                formData = formData.split('').map((v) => {
                    if (v === '?') {
                        return index < valueData.length ? `#{${valueData[index++].colName}}` : v
                    } else {
                        return v
                    }
                }).join('')

                valueData.map((v) => {
                    let reg1 = new RegExp(`#{${v.colName}}`, 'gi') // 
                    if (['NUMBER', 'DECIMAL', 'INT', 'INTEGER', 'FLOAT', 'BIT', 'TIUNYINT', 'SMALLINT', 'NUMERIC'].findIndex((t) => { return v.colType.toUpperCase() === t }) > -1) {
                        formData = formData.replace(reg1, `${v.value}`)
                    } else {
                        formData = formData.replace(reg1, `'${v.value}'`)
                    }

                })

                // this.document.getElementById('result').value = formData
                setResult(formData)
            },
            () => {
                // repeat
                let trans_list
                let formData = form
                let valueData = value.split('\n').map((v1, i1) => {
                    return {
                        index: i1,
                        values: v1.split(/ |\t/gi).filter((v) => { return v !== '' }).map((v2, i2) => {
                            return { [`value${i2}`]: v2 }
                        })
                    }
                })

                valueData.map((v1, i1) => {
                    let temp = formData.replace(/#{i}/gi, i1)
                    v1.values.map((v2, i2) => {
                        let reg2 = new RegExp(`#{(${i2})}`, 'gi')
                        temp = temp.replace(reg2, v2[`value${i2}`])
                    })
                    trans_list = `${trans_list}${temp}\n`
                })

                setResult(trans_list)
            }
        ]

        func[selection - 1]()
    }

    const empty = () => {
        setForm(() => { return '' })
        setValue(() => { return '' })
        setResult(() => { return '' })
    }
    const manual = () => {

        switch (selection) {
            case 1:
                setForm(`[DEBUG][2021-04-02 16:57:20]==>  Preparing: /* 회계기수 정보 조회 단건*/ SELECT MAX(G.GISU) AS GISU , MAX(G.FR_DT) AS FR_DT , MAX(G.TO_DT) AS TO_DT , G.RMK_DC , E.KOR_NM FROM erp_1234.SGISU G LEFT OUTER JOIN erp_1234.SEMP E ON E.CO_CD = G.CO_CD AND E.EMP_CD = G.INSERT_ID WHERE G.CO_CD = ? AND ? BETWEEN G.FR_DT AND G.TO_DT `)
                setValue(`[DEBUG][2021-04-02 16:57:20]==> Parameters: 2000(String), 20210402(String)`)
                setResult(`< query 변환 사용법 >\n1. form 입력칸(좌상단)에 쿼리를 입력한다.\n2. data 입력칸(좌하단)에 데이터를 입력한다.\n3. change 버튼을 클릭한다.\n\nform칸에 입력된 쿼리에서 '?' 문자는 쿼리 변환시 data칸에 입력된 데이터를 입력 라인 순서대로 변환됩니다.\n\nform칸에 Mybatis와 같이 #{colName} 형식으로 입력시에는 data칸에 입력된 데이터의 colName에 맞춰 변환이 이루어 집니다.\n\n----------form - 예시1---------- \nSELECT * \n  FROM TEMP_TABLE T \n WHERE CO_CD = ?\n   AND EMP_CD = ?\n   AND DIV_CD = ?\n\n----------data - 예시1---------- \n1000(String), 2000(String), 3000(String)\n\n\n\n----------form - 예시2---------- \nSELECT * \n  FROM TEMP_TABLE T \n WHERE CO_CD = #{coCd}\n   AND EMP_CD = #{divCd}\n   AND DIV_CD = #{empCd}\n\n----------data - 예시2---------- \n1000(String){coCd}, 2000(String){divCd}, 3000(String){empCd}\n\n---------result--------- \nSELECT * \n  FROM TEMP_TABLE T \n WHERE CO_CD = '1000'\n   AND EMP_CD = '2000'\n   AND DIV_CD = '3000'`)
                break;
            case 2:
                setForm('-- #{i} 번째 반복 -- \nline1 = #{0}\nline2 = #{1}\nline3 = #{2}\nline4 = #{0}')
                setValue('1-1\t1-2\t1-3\t1-4\n2-1\t2-2\t2-3\t2-4\n3-1 3-2 3-3 3-4\n4-1 4-2 4-3 4-4\n5-1 5-2 5-3 5-4\n6-1 6-2 6-3 6-4')
                setResult('< 코드 반복 작성 사용법 >\n1. form 입력칸(좌삳단)에 반복 작성될 코드의 form을 입력한다.\n2. data 입력칸(좌하단)에 반복할 횟수만큼의 row에 데이터 입력한다.\n3. change 버튼을 누른다.\n\nform칸에 작성된 코드에서 반복때마다 다른 값이 들어가야 되는 코드는 #{x}로 작성한다.\n코드가 작성되며 #{x}는 data칸에 작성된 데이터를 기반으로 자동으로 치환되어\nresult 칸에 출력된다.\n#{i}는 반복되는 인덱스를 출력한다.\n\n----------예시---------- \n--- form칸\n반복될 코드 #{i} : #{0} / #{1}\n\n--- data칸\na1 b6\na2 b7\na3 b8\na4 b9\na5 b0\n\n--- 결과값\n반복될 코드 0 : a1 / b6\n반복될 코드 1 : a2 / b7\n반복될 코드 2 : a3 / b8\n반복될 코드 3 : a4 / b9\n반복될 코드 4 : a5 / b0')
                break;
        }
    }
    const ballboy = () => { }
    const tempApi = () => { }

    return (
        <div className='Default'>
            {/* button area */}
            <div className='Default__buttons'>
                {/* left area */}
                <div className='Default__buttons__left'>
                    <ButtonGroup>
                        <Button
                            size='sm'
                            color='primary'
                            outline
                            onClick={() => {
                                setSelection(() => {
                                    empty();
                                    return 1
                                })
                            }}
                            active={selection === 1}
                        >transform</Button>
                        <Button
                            size='sm'
                            color='primary'
                            outline
                            onClick={() => {
                                setSelection(() => {
                                    empty();
                                    return 2
                                })
                            }}
                            active={selection === 2}
                        >repeat</Button>
                        <Button
                            size='sm'
                            color='primary'
                            outline
                            onClick={() => {
                                setSelection(() => {
                                    empty();
                                    return 3
                                })
                            }}
                            active={selection === 3}
                        >tree</Button>
                    </ButtonGroup>
                </div>
                {/* right area */}
                <div className='Default__buttons__right'>
                    <Button size='sm' color='primary' outline
                        onClick={() => { change() }}>
                        change
                    </Button>
                    <Button size='sm' color='primary' outline
                        onClick={empty}>
                        empty
                    </Button>
                    <Button size='sm' color='primary' outline>
                        test
                    </Button>
                    {/* <Route /> */}
                    <Button size='sm' color='primary' outline
                        className={'Default__manual'}
                        onClick={manual}>
                        manual
                    </Button>
                </div>
            </div>

            {/* edit aera */}
            <div className='Default__editors'>
                <div className='Default__editors__editor'>
                    <div className='Default__half'>
                        <Editor
                            height='100%'
                            defaultLanguage='text'
                            theme='vs-dark'
                            value={form || ''}
                            onChange={(e) => { setForm(() => { return e }) }}
                            options={{
                                // title: 'title',
                                minimap: {
                                    enabled: false
                                },
                                wordWrap: "on",
                            }} />


                    </div>
                    <div className='Default__half'>
                        <Editor
                            height='100%'
                            defaultLanguage='text'
                            theme='vs-dark'
                            value={value || ''}
                            onChange={(e) => { setValue(() => { return e }) }}
                            options={{
                                // title: 'title',
                                minimap: {
                                    enabled: false
                                },
                                wordWrap: "on",
                            }} />


                    </div>
                </div>
                <div className='Default__editors__editor'>
                    <Editor
                        height='100%'
                        defaultLanguage='text'
                        theme='vs-dark'
                        value={result || ''}
                        onChange={(e) => { setResult(() => { return e }) }}
                        options={{
                            // title: 'title',
                            minimap: {
                                enabled: false
                            },
                            wordWrap: "on",
                        }} />


                </div>
            </div>
        </div>
    )
}

export default Default