'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client';

const OrdersTable = ({ role }) => {
    const [ tableData, setTableData ] = useState([]);
    const [ viewData, setViewData ] = useState(null);                     
    const [ loading, setLoading ] = useState(false);
    const [ showViewModal, setShowViewModal ] = useState(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const [ deleteId, setDeleteId ] = useState(null);

    useEffect(() => {
        setLoading(true);
        axiosClient.get('/orders')
        .then((res) => {
            setTableData(res.data.data);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        })
    }, []);

    const handleView = (id) => {
        console.log('Clicked ' + id);
        axiosClient.get(`/orders/${id}`)
            .then((res) => {
                setViewData(res.data);
                setShowViewModal(true);
            })
            .catch((err) => {
                console.log(err);
                setShowViewModal(false);
            })
    };

    const handleDelete = (id) => {
        console.log('Clicked ' + id);
        setDeleteId(id);
        setShowDeleteModal(true);
    }

    const handleDeleteConfirm = () => {
        setLoading(true);
        axiosClient.delete(`/orders/${deleteId}`)
        .then((res) => {
            console.log(res);
            setShowDeleteModal(false);
            setTableData(tableData.filter((row) => row.id !== deleteId));
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setShowDeleteModal(false);
            setLoading(false);
        })
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };
    
    const hideModal = () => {
        setShowViewModal(false);
    };

  return (
    <div>
        <Table striped>
            <Table.Head>
                <Table.HeadCell>
                Order #
                </Table.HeadCell>
                <Table.HeadCell>
                Table #
                </Table.HeadCell>
                <Table.HeadCell>
                Waiter
                </Table.HeadCell>
                <Table.HeadCell>
                Total
                </Table.HeadCell>
                <Table.HeadCell>
                Time
                </Table.HeadCell>
                <Table.HeadCell>
                <span className="sr-only">
                    Edit
                </span>
                <span className="sr-only">
                    Pay
                </span>
                </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y fs">
                {loading && (
                    <Table.Row>
                        <Table.Cell colSpan={6} className="text-center">
                            Loading...
                        </Table.Cell>
                    </Table.Row>
                )}
                
                {!loading && tableData.map((row) => (
                    <Table.Row key={row.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {row.order_number}
                        </Table.Cell>
                        <Table.Cell>
                            {row.table_name}
                        </Table.Cell>
                        <Table.Cell>
                            {row.employee_name}
                        </Table.Cell>
                        <Table.Cell>
                           Ksh. {row.total.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                            {row.created_at}
                        </Table.Cell>
                        <Table.Cell className='flex gap-4'>
                            <a
                            className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                            onClick={() => handleView(row.id)}
                            >
                                <div className='flex gap-2 justify-items-center underline'>
                                    <div>
                                        <i className="fa fa-eye"></i>
                                    </div>
                                    <div>View</div>
                                </div>
                            </a>
                            <Link
                            className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                            to={`/orders/edit/${row.id}`}
                            >
                            <div className='flex gap-2 justify-items-center underline'>
                                <div>
                                    <i className="fa fa-pen"></i>
                                </div>
                                <div>Edit</div>
                            </div>
                            </Link>
                            <a
                            className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                            href="javascript:window.print()"
                            >
                                <div className='flex gap-2 justify-items-center underline'>
                                    <div>
                                        <i className="fa fa-print"></i>
                                    </div>
                                    <div>Print</div>
                                </div>
                            </a>
                            {role === 'cashier' && (
                                <>
                                    <Link
                                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                    to={`/orders/checkout/${row.id}`}
                                    >
                                        <div className='flex gap-2 justify-items-center underline'>
                                            <div>
                                                <i className="fa fa-cart-shopping"></i>
                                            </div>
                                            <div>Checkout</div>
                                        </div>
                                    </Link>
                                    <a
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                                        onClick={() => handleDelete(row.id)}
                                    >
                                        <div className='flex gap-2 justify-items-center underline'>
                                            <div>
                                                <i className="fa fa-trash"></i>
                                            </div>
                                            <div>Delete</div>
                                        </div>
                                    </a>
                                </>
                            )}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
            </Table>

            {showViewModal && (
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 bg-gray-900 ">
                  <div className="bg-white rounded-lg shadow max-w-4xl width">
                    {viewData && (
                        <>
                            <div className="flex justify-between p-4 border-b ">
                                <h3 className="flex justify-between text-2xl font-semibold text-gray-900">
                                    Order# {viewData.order_number}
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                    onClick={hideModal}
                                >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className='flex justify-between'>
                                    <h2 className="text-lg font-bold text-gray-500">
                                        {viewData.employee_name}
                                    </h2>
                                    <h2 className="text-lg font-bold text-gray-500">
                                        {viewData.table_name}
                                    </h2>
                                </div>
                                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-gray-700 uppercase bg-blue-100 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="px-6 py-3">
                                                    Food name
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Price
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    Quantity
                                                </th>
                                                <th scope="col" class="px-6 py-3">
                                                    SubTotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewData.order_items.map((item) => (
                                                <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {item.food_name}
                                                    </th>
                                                    <td class="px-6 py-4">
                                                        Ksh {item.price}
                                                    </td>
                                                    <td class="px-6 py-4 text-center">
                                                        {item.quantity}
                                                    </td>
                                                    <td class="px-6 py-4 ">
                                                       Ksh. {item.sub_total}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
                                <p className='text-3xl font-bold text-gray-900'>Ksh {viewData.total}</p>
                            </div>
                        </>
                    )}
                  </div>
                </div>
              )}

            {showDeleteModal && (
                <div
                    tabIndex="-1"
                    className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50"
                >
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
                    <div className="relative w-full max-w-md">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                        type="button"
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                        data-modal-hide="popup-modal"
                        onClick={handleDeleteCancel}
                        >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-6 text-center">
                        <svg
                            aria-hidden="true"
                            className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this order?
                        </h3>
                        <button
                            data-modal-hide="popup-modal"
                            type="button"
                            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                            onClick={handleDeleteConfirm}
                        >
                            Yes, I'm sure
                        </button>
                        <button
                            data-modal-hide="popup-modal"
                            type="button"
                            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                            onClick={handleDeleteCancel}
                        >
                            No, cancel
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
            )}
    </div>
  )
}

export default OrdersTable