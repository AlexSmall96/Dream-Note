import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { useState } from 'react'
import Button from "../forms/Button";
 
export function DeleteModal ({
    handleDelete,
    message,
    deletedMessage,
    heading
}:{
    handleDelete: () => Promise<void>,
    message: string,
    deletedMessage?: string,
    heading?: string
}) {
  	const [isOpen, setIsOpen] = useState(false)
	const [deleted, setDeleted] = useState(false)
	const [deleting, setDeleting] = useState(false)

	const onDelete = async () => {
		setDeleting(true)
		await handleDelete()
		setDeleting(false)
		setDeleted(true)
	}

	const onClose = () => {
		setIsOpen(false)
		setDeleted(false)
	}

  	return (
		<>
			<FontAwesomeIcon
				icon={faTrashCan}
				onClick={() => setIsOpen(true)}
				className='cursor-pointer transition icon icon-danger'
			/>
			<Dialog open={isOpen} onClose={onClose} className="relative z-50">
				<DialogBackdrop className="fixed inset-0 bg-black/50" />
				{!deleting ?<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
						<DialogTitle className="font-bold">{heading}</DialogTitle>
						<Description>{deleted && deletedMessage ? deletedMessage : message}</Description>
						<div className="flex gap-4 items-center justify-center">
							{!deleted ? 
								<>
									<Button extraClass='btn btn-gray bg-gray-300 p-1 m-1' onClick={onClose} text="Cancel"/>
									<Button extraClass='bg-red-500 p-1 m-1' onClick={onDelete} text="Yes"/>
								</>
							:
								<>
									<Button extraClass='btn btn-gray bg-gray-300 p-1 m-1' onClick={onClose} text="Close"/>
								</>
							}
						</div>
					</DialogPanel>
				</div>:'Deleting...'}
			</Dialog>
		</>
  	)
}



      



