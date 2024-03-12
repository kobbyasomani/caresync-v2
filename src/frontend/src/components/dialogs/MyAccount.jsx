import React from "react"

import Modal from "../Modal";

const MyAccount = () => {
    return (
        <Modal modalId={"my-account"}
            title="My Account"
            text="View and modify your account information including your name, email address, and password."
            hasEndpoint
        >

        </Modal>
    )
}

export default MyAccount