import './styles.scss'
import { useState, useEffect } from 'react'
import { CloseIcon, DataObjectIcon } from '../../common/icon'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const MakeJson = ({ onClose }) => {
    const items = [
        { title: "타이틀 1", index: 1 },
        { title: "타이틀 2", index: 2 },
        { title: "타이틀 3", index: 3 },
        { title: "타이틀 4", index: 4 },
        { title: "타이틀 5", index: 5 },
    ];
    const [pageList, setPageList] = useState([]);

    useEffect(() => {
        setPageList(items);
    }, []);

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        setPageList((items) =>
            reorder(items, result.source.index, result.destination.index)
        );
    };

    return (
        <div className={'MakeJson'}>
            <div className='MakeJson__header'>
                <DataObjectIcon className={'MakeJson__header__icon'} />
                <CloseIcon className={'MakeJson__header__icon'} onClick={onClose} />
            </div>
            <div className='MakeJson__body'>

            </div>

        </div>
    )
}

export default MakeJson