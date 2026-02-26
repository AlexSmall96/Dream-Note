import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
 
export function DeleteModal ({
    handleDelete,
    message,
    heading
}:{
    handleDelete: () => Promise<void>,
    message: string,
    heading?: string
}) {
  	const [isOpen, setIsOpen] = useState(false)

  	return (
		<>
			<FontAwesomeIcon
				icon={faTrashCan}
				onClick={() => setIsOpen(true)}
				className='cursor-pointer transition'
			/>
			<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
						<DialogTitle className="font-bold">{heading}</DialogTitle>
						<Description>{message}</Description>
						<div className="flex gap-4 items-center justify-center">
							<button className='btn btn-gray bg-gray-300 p-1 m-1' onClick={() => setIsOpen(false)}>Cancel</button>
							<button className='bg-red-500 p-1 m-1' onClick={handleDelete}>Yes</button>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
  	)
}



      



