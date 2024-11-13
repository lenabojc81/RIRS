import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <nav className='navbar navbar-expand-lg bg-body-tertiary'>
            <div className="container-fluid">
                <Link className='navbar-brand' href='/'>TT</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <div className="navbar-nav">
                        <Link href="/new" className="nav-link">Add Transaction</Link>
                        {/* <Link href="/transactions" className="nav-link">Transactions</Link> */}
                        {/* <div className="nav-item dropdown">
                            <a 
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="transactionsDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Transactions
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="transactionsDropdown">
                                <li>
                                    <Link href="/transactions" className="dropdown-item">Transaction List</Link>
                                </li>
                                <li>
                                    <Link href="/transactions/new" className="dropdown-item">Add New Transaction</Link>
                                </li>
                            </ul>
                        </div>
                        <Link href="#" className="nav-link">Home</Link> */}
                    </div>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;

