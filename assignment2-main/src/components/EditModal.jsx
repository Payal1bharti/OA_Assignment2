import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

const Edit = ({ setShowPopup, store, setStore, data, setData, showPopup }) => {
    const [formData, setFormData] = useState(store.find((item) => item.id === showPopup));
    const overlayRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();
        setStore(store.map((item) => (item.id === showPopup ? formData : item)));
        setData(data.map((item) => (item.id === showPopup ? formData : item)));
        setShowPopup(null);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                setShowPopup(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [overlayRef, setShowPopup]);

    return (
        <div className={`fixed inset-0 bg-[rgba(0,0,0,0.468)] text-black flex z-50 justify-center items-center transition-all ${!showPopup && "hidden"}`}>
            <div ref={overlayRef} className='bg-white flex lg:w-[24rem] md:w-[24rem] w-[95%] h-fit p-8 rounded-2xl flex-col'>
                <div className='flex justify-between w-full'>
                    <h2 className='text-2xl font-bold'>Edit Member</h2>
                    <button onClick={() => setShowPopup(null)} className='text-gray-500'>
                        <MdOutlineCancel size={23} />
                    </button>
                </div>
                <form className='flex flex-col w-full gap-3 pt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col w-full'>
                        <label htmlFor='name'>Name</label>
                        <input
                            required={true}
                            type='text'
                            placeholder='Enter name'
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            name='name'
                            id='name'
                            className='py-1.5 px-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-gray-500'
                        ></input>
                    </div>
                    <div className='flex flex-col w-full'>
                        <label htmlFor='email'>Email</label>
                        <input
                            required={true}
                            type='text'
                            placeholder='Enter email'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            name='name'
                            id='name'
                            className='py-1.5 px-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-gray-500'
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='color' className=''>
                            Role
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                required={true}
                                onChange={(e) => setFormData({ ...formData, role: e.target.id })}
                                type='radio'
                                name='role'
                                id='member'
                                checked={formData.role === 'member'}
                            />
                            <label htmlFor="member" className='font-medium text-gray-600 cursor-pointer'><div className='orange'>member</div></label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                required={true}
                                onChange={(e) => setFormData({ ...formData, role: e.target.id })}
                                type='radio'
                                name='role'
                                id='admin'
                                checked={formData.role === 'admin'}
                            />
                            <label htmlFor="admin" className='font-medium text-gray-600 cursor-pointer'><div className='orange'>admin</div></label>
                        </div>
                    </div>
                    <button type='submit' className='bg-black edit text-white mt-5 py-2 rounded-xl
                    hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-200 w-full
                    '>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Edit;