import './styles.scss'
import { useState, useEffect } from 'react'
import { PlusIcon, CloseIcon, DataObjectIcon, MoreVertIcon, MoreHorizIcon } from '../../common/icon'
import newData from '../../_post/tempData/new.json'

const MakeJson = ({ onClose }) => {

    const treeSort = (data) => {
        const include = data.sort((a, b) =>
            a.type === 'file'
                ? (b.type === 'file' ? (a._index - b._index) : 1)
                : (b.type === 'file' ? -1 : (a.title > b.title ? 1 : -1))
        )

        const result = []
        include.map((v) => {
            result.push(v.type === 'file' ? v : { title: v.title || '', desc: v.desc || '', id: v.id || '', type: v.type || '' })

            if (!!v?._include && v?._include.length > 0) {
                result.push(...treeSort(v._include))
            }
        })

        return result
    }

    return (
        <div className={'MakeJson'}>
            <div className='MakeJson__header'>
                <DataObjectIcon className={'MakeJson__header__icon'} />
                <CloseIcon className={'MakeJson__header__icon'} onClick={onClose} />
            </div>
            <div className='MakeJson__body'>
                <table>
                    <thead>
                        <tr className='MakeJson__body__th'>
                            <th className='MakeJson__body__add'></th>
                            <th className='MakeJson__body__id'>id</th>
                            <th className='MakeJson__body__index'>_index</th>
                            <th className='MakeJson__body__title'>title</th>
                            <th className='MakeJson__body__desc'>desc</th>
                            <th className='MakeJson__body__date'>_date</th>
                            <th className='MakeJson__body__data'>_data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            // folder  : title, desc, id, type, _include
                            // file    : title, desc, id, type, _index, _date, _data
                            treeSort(newData).map((v, i) => {
                                return (
                                    <tr className='MakeJson__body__tr' key={`${v.id}-${i}`}>
                                        <td className='MakeJson__body__add'>
                                            {
                                                v.type === 'file'
                                                    ? <MoreHorizIcon className='MakeJson__body__icon' />
                                                    : <MoreVertIcon className='MakeJson__body__icon' />
                                            }

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
                                )
                            })
                        }
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default MakeJson