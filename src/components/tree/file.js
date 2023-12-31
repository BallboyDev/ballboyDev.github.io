import React, { useState, useEffect } from 'react'
import './styles.scss'

const File = ({ data, selectItem }) => {
    const { title, desc, id, type } = data
    const { _data, _date, _index } = data

    const onClick = () => {
        selectItem(data)
    }

    return (
        <div
            className={'File'}
            onClick={onClick}
        >{title}</div>
    )
}

export default File