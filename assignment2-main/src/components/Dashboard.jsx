import React, { useState, useEffect } from 'react'
import Search from './Search'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft, MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import Edit from './EditModal';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [store, setStore] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [allSelected, setAllSelected] = useState([]);
    const [showPopup, setShowPopup] = useState(null);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const res = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
            let data = await res.json();
            data = data.map((item) => {
                return {
                    ...item,
                    isSelected: false
                }
            });
            setStore(data);
            setData(data);
            setLoading(false);
        }
        getData()
    }, []);

    const deleteOne = (id) => {
        const newData = data.filter((item) => Number(item.id) !== Number(id));
        setData(newData);
        let selectedIds = data.filter((item) => item.isSelected).map((item) => item.id);
        setStore(store.filter((item) => !selectedIds.includes(item.id)));
    }

    const deleteMany = () => {
        let selectedIds = data.filter((item) => item.isSelected).map((item) => item.id);
        const newData = data.filter((item) => !item.isSelected);
        setData(newData);
        setStore(store.filter((item) => !selectedIds.includes(item.id)));
        setAllSelected([]);
        setCurrentPage(0);
    }

    const selectOne = (id) => {
        const newData = data.map((item) => {
            if (item.id == id) {
                return {
                    ...item,
                    isSelected: !item.isSelected
                }
            }
            return item;
        });
        setData(newData);
    }

    const selectAll = (val) => {
        // Mark current page as selected
        const newData = data.map((item, idx) => {
            if (currentPage * 10 < idx + 1 && idx + 1 <= (currentPage + 1) * 10) {
                return {
                    ...item,
                    isSelected: val
                };
            } else {
                return item;
            }
        });
        setData(newData);
    };


    return (
        <div className='w-full px-6 relative'>
            {showPopup && <Edit store={store} setStore={setStore} data={data} setData={setData} setShowPopup={setShowPopup} showPopup={showPopup} />}
            <Search setCurrentPage={setCurrentPage} searchText={searchText} setSearchText={setSearchText} store={store} setData={setData} deleteMany={deleteMany} />
            <div className='w-full flex flex-col justify-between pb-36'>
                <div className='table-container lg:overflow-auto md:overflow-auto overflow-x-scroll border-x border-gray-100'>
                    <table className="w-full overflow-scroll bg-white text-sm border rounded-lg">
                        <thead>
                            <tr className='font-medium bg-gray-100'>
                                <th className="py-3 px-4 border-b">
                                    <div className='flex items-center gap-3'>
                                        <input disabled={data.length === 0} onChange={(e) => {
                                            let val = e.target.checked;
                                            if (allSelected.includes(currentPage)) {
                                                const newAllSelected = allSelected.filter((item) => item != currentPage);
                                                setAllSelected(newAllSelected);
                                            } else {
                                                setAllSelected([...allSelected, currentPage]);
                                                console.log([...allSelected, currentPage].includes(currentPage));
                                            }
                                            selectAll(val)
                                        }} checked={allSelected.includes(currentPage)} type="checkbox" />
                                    </div>
                                </th>
                                <th className="py-3 px-4 border-b"><div className='flex items-center gap-3'>Id</div></th>
                                <th className="py-3 px-4 border-b"><div className='flex items-center gap-3'>Name</div></th>
                                <th className="py-3 px-4 border-b"><div className='flex items-center gap-3'>Email</div></th>
                                <th className="py-3 px-4 border-b"><div className='flex items-center gap-3'>Role</div></th>
                                <th className="py-3 px-4 border-b"><div className='flex items-center gap-3'>Actions</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? <tr><td>Loading...</td></tr> :
                                    data.slice(currentPage * 10, currentPage * 10 + 10).map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-2.5 px-4 border-b"><input onChange={(e) => selectOne(e.target.id)} type="checkbox" id={item.id} checked={item.isSelected} className='cursor-pointer' /></td>
                                            <td className="py-2.5 px-4 border-b">{item.id}</td>
                                            <td className="py-2.5 px-4 border-b min-w-[10rem]">{item.name}</td>
                                            <td className="py-2.5 px-4 border-b min-w-[12rem]">{item.email}</td>
                                            <td className="py-2.5 px-4 border-b">{item.role}</td>
                                            <td className="py-2.5 px-4 border-b">
                                                <div className='flex gap-2 items-center'>
                                                    <button onClick={() => setShowPopup(item.id)} className='text-green-500 edit p-1.5 rounded-lg border'>
                                                        <FaEdit size={14} />
                                                    </button>
                                                    <button onClick={() => deleteOne(item.id)} className='text-rose-500 p-1.5 delete rounded-lg border'>
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                <div className='w-full relative flex items-center justify-center'>
                    <div className='text-sm bg-white py-3 flex lg:flex-row md:flex-row flex-col gap-2 justify-between items-center fixed bottom-0 w-[97%]'>
                        <div className='text-gray-500 font-medium'>
                            {data.reduce((acc, it) => it.isSelected ? acc + 1 : acc, 0)} of {data.length} rows selected
                        </div>

                        <div className='flex lg:flex-row md:flex-row sm:flex-row flex-col items-center gap-5'>
                            <span className='font-medium'>
                                Page {currentPage + 1} of {Math.floor(data.length / 10) + 1}
                            </span>
                            <div className='flex items-center gap-2'>
                                <button
                                    disabled={currentPage === 0}
                                    className={`px-2 py-1.5 rounded-lg border disabled:text-gray-400 first-page`}
                                    onClick={() => setCurrentPage(0)}
                                >
                                    <MdKeyboardDoubleArrowLeft />
                                </button>
                                <button
                                    disabled={currentPage === 0}
                                    className={`px-2 py-1.5 rounded-lg border disabled:text-gray-400 previous-page`}
                                    onClick={() => {
                                        if (currentPage >= 1) {
                                            setCurrentPage(currentPage - 1)
                                        }
                                    }}
                                >
                                    <MdOutlineKeyboardArrowLeft />
                                </button>
                                {
                                    [...Array(Math.floor(data.length / 10) + 1).keys()].map((item) => (
                                        <button
                                            key={item}
                                            className={`px-2.5 py-1 rounded-lg border ${currentPage === item ? 'bg-gray-200 font-medium' : ''}`}
                                            onClick={() => {
                                                setCurrentPage(item)
                                            }}
                                        >
                                            {item + 1}
                                        </button>
                                    ))
                                }
                                <button
                                    disabled={currentPage === Math.floor(data.length / 10)}
                                    className='px-2 py-1.5 rounded-lg border disabled:text-gray-400 next-page'
                                    onClick={() => {
                                        console.log(currentPage, Math.floor(data.length / 10))
                                        if (currentPage < Math.floor(data.length / 10)) {
                                            setCurrentPage(currentPage + 1)
                                        }
                                    }}
                                >
                                    <MdOutlineKeyboardArrowRight />
                                </button>
                                <button
                                    disabled={currentPage === Math.floor(data.length / 10)}
                                    className='px-2 py-1.5 rounded-lg border disabled:text-gray-400 last-page'
                                    onClick={() => setCurrentPage(Math.floor(data.length / 10))}
                                >
                                    <MdKeyboardDoubleArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard