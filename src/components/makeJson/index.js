import './styles.scss'
import { useState, useEffect } from 'react'
import { PlusIcon, CloseIcon, DataObjectIcon, MoreHorizIcon } from '../../common/icon'
import newData from '../../_post/tempData/new.json'



const MakeJson = ({ onClose }) => {

    const treeSort = (data) => {
        const include = data.sort((a, b) =>
            a.type === 'file'
                ? (b.type === 'file' ? (a._index - b._index) : 1)
                : (b.type === 'file' ? -1 : (a.title > b.title ? 1 : -1))
        )

        // const result = include.map((v) => v.type === 'file' ? v
        //     : {
        //         title: v.title || '',
        //         desc: v.desc || '',
        //         id: v.id || '',
        //         type: v.type || ''
        //     }
        // )

        return include.map((v) => {
            return (
                // id, title, desc, _index, _date, _data
                <>
                    <tr className='MakeJson__body__tr'>
                        {/* <div>{v.title}</div> */}
                        <td className='MakeJson__body__add'>
                            <MoreHorizIcon className='MakeJson__body__icon' />
                        </td>
                        <td className='MakeJson__body__id'>
                            {v.id}
                        </td>
                        <td className='MakeJson__body__index'>
                            {v?._index || ''}
                        </td>
                        <td className='MakeJson__body__title'>
                            ( {v.type} ) {v.title}
                        </td>
                        <td className='MakeJson__body__desc'>
                            {v.desc}
                        </td>
                        <td className='MakeJson__body__date'>
                            {v?._date || ''}
                        </td>
                        <td className='MakeJson__body__data'>
                            {v?._data || ''}
                        </td>
                    </tr>
                    {(!!v?._include && v?._include.length > 0) && treeSort(v._include)}
                </>
            )
        })
    }

    return (
        <div className={'MakeJson'}>
            <div className='MakeJson__header'>
                <DataObjectIcon className={'MakeJson__header__icon'} />
                <CloseIcon className={'MakeJson__header__icon'} onClick={onClose} />
            </div>
            <div className='MakeJson__body'>
                <table>
                    <tr className='MakeJson__body__th'>
                        <th className='MakeJson__body__add'>

                        </th>
                        <th className='MakeJson__body__id'>
                            id
                        </th>
                        <th className='MakeJson__body__index'>
                            _index
                        </th>
                        <th className='MakeJson__body__title'>
                            title
                        </th>
                        <th className='MakeJson__body__desc'>
                            desc
                        </th>
                        <th className='MakeJson__body__date'>
                            _date
                        </th>
                        <th className='MakeJson__body__data'>
                            _data
                        </th>
                    </tr>
                    {/* folder  : title, desc, id, type, _include */}
                    {/* file    : title, desc, id, type, _index, _date, _data */}
                    {treeSort(newData)}
                </table>

            </div>
        </div>
    )
}

export default MakeJson